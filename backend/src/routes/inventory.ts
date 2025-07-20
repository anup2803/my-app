import { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { AppError } from '../middleware/errorHandler';
import { requireManager } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Validation middleware
const validateIngredient = [
  body('name').trim().isLength({ min: 1, max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('unit').trim().isLength({ min: 1, max: 20 }),
  body('currentStock').isFloat({ min: 0 }),
  body('minStock').isFloat({ min: 0 }),
  body('costPerUnit').isFloat({ min: 0 }),
  body('supplier').optional().trim().isLength({ max: 100 })
];

// @route   GET /api/inventory/ingredients
// @desc    Get all ingredients
// @access  Private
router.get('/ingredients', asyncHandler(async (req: Request, res: Response) => {
  const { isActive, lowStock } = req.query as any;

  const where: any = {};
  
  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }
  
  if (lowStock === 'true') {
    where.currentStock = {
      lte: { minStock: true }
    };
  }

  const ingredients = await prisma.ingredient.findMany({
    where,
    include: {
      _count: {
        select: { usages: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  res.status(200).json({
    success: true,
    data: { ingredients }
  });
}));

// @route   GET /api/inventory/ingredients/:id
// @desc    Get ingredient by ID
// @access  Private
router.get('/ingredients/:id', [
  param('id').isUUID()
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { id } = req.params as any;

  const ingredient = await prisma.ingredient.findUnique({
    where: { id },
    include: {
      usages: {
        include: {
          menuItem: {
            include: {
              category: true
            }
          }
        }
      }
    }
  });

  if (!ingredient) {
    throw new AppError('Ingredient not found', 404);
  }

  res.status(200).json({
    success: true,
    data: { ingredient }
  });
}));

// @route   POST /api/inventory/ingredients
// @desc    Create new ingredient
// @access  Private (Manager+)
router.post('/ingredients', requireManager, validateIngredient, asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { name, description, unit, currentStock, minStock, costPerUnit, supplier } = req.body as any;

  // Check if ingredient already exists
  const existingIngredient = await prisma.ingredient.findUnique({
    where: { name }
  });

  if (existingIngredient) {
    throw new AppError('Ingredient already exists', 400);
  }

  const ingredient = await prisma.ingredient.create({
    data: {
      name,
      description,
      unit,
      currentStock,
      minStock,
      costPerUnit,
      supplier
    }
  });

  res.status(201).json({
    success: true,
    message: 'Ingredient created successfully',
    data: { ingredient }
  });
}));

// @route   PUT /api/inventory/ingredients/:id
// @desc    Update ingredient
// @access  Private (Manager+)
router.put('/ingredients/:id', requireManager, [
  param('id').isUUID(),
  ...validateIngredient
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { id } = req.params as any;
  const { name, description, unit, currentStock, minStock, costPerUnit, supplier } = req.body as any;

  // Check if ingredient exists
  const existingIngredient = await prisma.ingredient.findUnique({
    where: { id }
  });

  if (!existingIngredient) {
    throw new AppError('Ingredient not found', 404);
  }

  // Check if name conflicts
  if (name !== existingIngredient.name) {
    const nameExists = await prisma.ingredient.findUnique({
      where: { name }
    });

    if (nameExists) {
      throw new AppError('Ingredient name already exists', 400);
    }
  }

  const ingredient = await prisma.ingredient.update({
    where: { id },
    data: {
      name,
      description,
      unit,
      currentStock,
      minStock,
      costPerUnit,
      supplier
    }
  });

  res.status(200).json({
    success: true,
    message: 'Ingredient updated successfully',
    data: { ingredient }
  });
}));

// @route   DELETE /api/inventory/ingredients/:id
// @desc    Delete ingredient
// @access  Private (Manager+)
router.delete('/ingredients/:id', requireManager, [
  param('id').isUUID()
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { id } = req.params as any;

  // Check if ingredient has usages
  const ingredientWithUsages = await prisma.ingredient.findUnique({
    where: { id },
    include: {
      _count: {
        select: { usages: true }
      }
    }
  });

  if (!ingredientWithUsages) {
    throw new AppError('Ingredient not found', 404);
  }

  if (ingredientWithUsages._count.usages > 0) {
    throw new AppError('Cannot delete ingredient with existing usages', 400);
  }

  await prisma.ingredient.delete({
    where: { id }
  });

  res.status(200).json({
    success: true,
    message: 'Ingredient deleted successfully'
  });
}));

// @route   POST /api/inventory/ingredients/:id/adjust-stock
// @desc    Adjust ingredient stock
// @access  Private (Manager+)
router.post('/ingredients/:id/adjust-stock', requireManager, [
  param('id').isUUID(),
  body('adjustment').isFloat(),
  body('reason').optional().trim().isLength({ max: 200 })
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { id } = req.params as any;
  const { adjustment, reason } = req.body as any;

  const ingredient = await prisma.ingredient.findUnique({
    where: { id }
  });

  if (!ingredient) {
    throw new AppError('Ingredient not found', 404);
  }

  const newStock = Number(ingredient.currentStock) + adjustment;
  
  if (newStock < 0) {
    throw new AppError('Stock cannot be negative', 400);
  }

  const updatedIngredient = await prisma.ingredient.update({
    where: { id },
    data: { currentStock: newStock }
  });

  res.status(200).json({
    success: true,
    message: 'Stock adjusted successfully',
    data: { 
      ingredient: updatedIngredient,
      adjustment,
      reason: reason || 'Manual adjustment'
    }
  });
}));

// @route   GET /api/inventory/low-stock
// @desc    Get low stock alerts
// @access  Private
router.get('/low-stock', asyncHandler(async (_req: Request, res: Response) => {
  const allIngredients = await prisma.ingredient.findMany({
    where: { isActive: true },
    orderBy: [
      { currentStock: 'asc' },
      { name: 'asc' }
    ]
  });
  const lowStockIngredients = allIngredients.filter(
    ing => Number(ing.currentStock) <= Number(ing.minStock)
  );

  res.status(200).json({
    success: true,
    data: { 
      lowStockIngredients,
      count: lowStockIngredients.length
    }
  });
}));

// @route   POST /api/inventory/menu-items/:id/ingredients
// @desc    Add ingredient usage to menu item
// @access  Private (Manager+)
router.post('/menu-items/:id/ingredients', requireManager, [
  param('id').isUUID(),
  body('ingredientId').isUUID(),
  body('quantity').isFloat({ min: 0.01 })
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { id: menuItemId } = req.params as any;
  const { ingredientId, quantity } = req.body as any;

  // Check if menu item exists
  const menuItem = await prisma.menuItem.findUnique({
    where: { id: menuItemId }
  });

  if (!menuItem) {
    throw new AppError('Menu item not found', 404);
  }

  // Check if ingredient exists
  const ingredient = await prisma.ingredient.findUnique({
    where: { id: ingredientId }
  });

  if (!ingredient) {
    throw new AppError('Ingredient not found', 404);
  }

  // Check if usage already exists
  const existingUsage = await prisma.ingredientUsage.findUnique({
    where: {
      menuItemId_ingredientId: {
        menuItemId,
        ingredientId
      }
    }
  });

  if (existingUsage) {
    throw new AppError('Ingredient usage already exists', 400);
  }

  const usage = await prisma.ingredientUsage.create({
    data: {
      menuItemId,
      ingredientId,
      quantity
    },
    include: {
      ingredient: true,
      menuItem: {
        include: {
          category: true
        }
      }
    }
  });

  res.status(201).json({
    success: true,
    message: 'Ingredient usage added successfully',
    data: { usage }
  });
}));

// @route   DELETE /api/inventory/menu-items/:id/ingredients/:ingredientId
// @desc    Remove ingredient usage from menu item
// @access  Private (Manager+)
router.delete('/menu-items/:id/ingredients/:ingredientId', requireManager, [
  param('id').isUUID(),
  param('ingredientId').isUUID()
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { id: menuItemId, ingredientId } = req.params as any;

  const usage = await prisma.ingredientUsage.findUnique({
    where: {
      menuItemId_ingredientId: {
        menuItemId,
        ingredientId
      }
    }
  });

  if (!usage) {
    throw new AppError('Ingredient usage not found', 404);
  }

  await prisma.ingredientUsage.delete({
    where: {
      menuItemId_ingredientId: {
        menuItemId,
        ingredientId
      }
    }
  });

  res.status(200).json({
    success: true,
    message: 'Ingredient usage removed successfully'
  });
}));

export default router; 