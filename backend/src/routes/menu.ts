import { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { AppError } from '../middleware/errorHandler';
import { requireManager } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Validation middleware
const validateCategory = [
  body('name').trim().isLength({ min: 1, max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('sortOrder').optional().isInt({ min: 0 })
];

const validateMenuItem = [
  body('name').trim().isLength({ min: 1, max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('price').isFloat({ min: 0 }),
  body('categoryId').isUUID(),
  body('isVegetarian').optional().isBoolean(),
  body('isSpicy').optional().isBoolean(),
  body('preparationTime').optional().isInt({ min: 1, max: 120 })
];

const validateModifier = [
  body('name').trim().isLength({ min: 1, max: 100 }),
  body('price').isFloat({ min: 0 })
];

// @route   GET /api/menu/categories
// @desc    Get all categories
// @access  Public
router.get('/categories', asyncHandler(async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: { items: true }
      }
    },
    orderBy: { sortOrder: 'asc' }
  });

  res.status(200).json({
    success: true,
    data: { categories }
  });
}));

// @route   POST /api/menu/categories
// @desc    Create new category
// @access  Private (Manager+)
router.post('/categories', requireManager, validateCategory, asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { name, description, sortOrder }: { name: string; description?: string; sortOrder?: number } = req.body;

  // Check if category already exists
  const existingCategory = await prisma.category.findUnique({
    where: { name }
  });

  if (existingCategory) {
    throw new AppError('Category already exists', 400);
  }

  const category = await prisma.category.create({
    data: {
      name,
      description: description ?? null,
      sortOrder: sortOrder ?? 0
    }
  });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: { category }
  });
}));

// @route   PUT /api/menu/categories/:id
// @desc    Update category
// @access  Private (Manager+)
router.put('/categories/:id', requireManager, [
  param('id').isUUID(),
  ...validateCategory
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const id = req.params["id"] as string;
  const { name, description, sortOrder }: { name: string; description?: string; sortOrder?: number } = req.body;

  // Check if category exists
  const existingCategory = await prisma.category.findUnique({
    where: { id }
  });

  if (!existingCategory) {
    throw new AppError('Category not found', 404);
  }

  // Check if name is already taken by another category
  if (name !== existingCategory.name) {
    const nameExists = await prisma.category.findUnique({
      where: { name }
    });

    if (nameExists) {
      throw new AppError('Category name already exists', 400);
    }
  }

  const updateData: any = { name, description: description ?? null };
  if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
  const category = await prisma.category.update({
    where: { id },
    data: updateData
  });

  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: { category }
  });
}));

// @route   DELETE /api/menu/categories/:id
// @desc    Delete category
// @access  Private (Manager+)
router.delete('/categories/:id', requireManager, [
  param('id').isUUID()
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const id = req.params["id"] as string;

  // Check if category has items
  const categoryWithItems = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { items: true }
      }
    }
  });

  if (!categoryWithItems) {
    throw new AppError('Category not found', 404);
  }

  if (categoryWithItems._count.items > 0) {
    throw new AppError('Cannot delete category with existing items', 400);
  }

  await prisma.category.delete({
    where: { id }
  });

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully'
  });
}));

// @route   GET /api/menu/items
// @desc    Get all menu items
// @access  Public
router.get('/items', asyncHandler(async (req: Request, res: Response) => {
  const { categoryId, search, isActive } = req.query as { categoryId?: string; search?: string; isActive?: string };

  const where: any = {};
  
  if (categoryId) {
    where.categoryId = categoryId as string;
  }
  
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } }
    ];
  }
  
  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  const items = await prisma.menuItem.findMany({
    where,
    include: {
      category: true,
      modifiers: true
    },
    orderBy: [
      { category: { sortOrder: 'asc' } },
      { name: 'asc' }
    ]
  });

  res.status(200).json({
    success: true,
    data: { items }
  });
}));

// @route   GET /api/menu/items/:id
// @desc    Get menu item by ID
// @access  Public
router.get('/items/:id', [
  param('id').isUUID()
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const id = req.params["id"] as string;

  const item = await prisma.menuItem.findUnique({
    where: { id },
    include: {
      category: true,
      modifiers: true,
      ingredients: {
        include: {
          ingredient: true
        }
      }
    }
  });

  if (!item) {
    throw new AppError('Menu item not found', 404);
  }

  res.status(200).json({
    success: true,
    data: { item }
  });
}));

// @route   POST /api/menu/items
// @desc    Create new menu item
// @access  Private (Manager+)
router.post('/items', requireManager, validateMenuItem, asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { 
    name, 
    description, 
    price, 
    categoryId, 
    isVegetarian, 
    isSpicy, 
    preparationTime,
    modifierIds 
  }: { name: string; description?: string; price: number; categoryId: string; isVegetarian?: boolean; isSpicy?: boolean; preparationTime?: number; modifierIds?: string[] } = req.body;

  // Check if category exists
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  // Create menu item
  const createData: any = {
    name,
    description: description ?? null,
    price,
    categoryId,
    isVegetarian: isVegetarian ?? false,
    isSpicy: isSpicy ?? false,
    preparationTime: preparationTime ?? null,
  };
  if (modifierIds) createData.modifiers = { connect: modifierIds.map((id: string) => ({ id })) };
  const item = await prisma.menuItem.create({
    data: createData,
    include: {
      category: true,
      modifiers: true
    }
  });

  res.status(201).json({
    success: true,
    message: 'Menu item created successfully',
    data: { item }
  });
}));

// @route   PUT /api/menu/items/:id
// @desc    Update menu item
// @access  Private (Manager+)
router.put('/items/:id', requireManager, [
  param('id').isUUID(),
  ...validateMenuItem
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const id = req.params["id"] as string;
  const { 
    name, 
    description, 
    price, 
    categoryId, 
    isVegetarian, 
    isSpicy, 
    preparationTime,
    modifierIds 
  }: { name: string; description?: string; price: number; categoryId: string; isVegetarian?: boolean; isSpicy?: boolean; preparationTime?: number; modifierIds?: string[] } = req.body;

  // Check if item exists
  const existingItem = await prisma.menuItem.findUnique({
    where: { id }
  });

  if (!existingItem) {
    throw new AppError('Menu item not found', 404);
  }

  // Check if category exists
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  // Update menu item
  const updateData: any = {
    name,
    description: description ?? null,
    price,
    categoryId,
    isVegetarian: isVegetarian ?? false,
    isSpicy: isSpicy ?? false,
    preparationTime: preparationTime ?? null,
  };
  if (modifierIds) updateData.modifiers = { set: modifierIds.map((id: string) => ({ id })) };
  const item = await prisma.menuItem.update({
    where: { id },
    data: updateData,
    include: {
      category: true,
      modifiers: true
    }
  });

  res.status(200).json({
    success: true,
    message: 'Menu item updated successfully',
    data: { item }
  });
}));

// @route   DELETE /api/menu/items/:id
// @desc    Delete menu item
// @access  Private (Manager+)
router.delete('/items/:id', requireManager, [
  param('id').isUUID()
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const id = req.params["id"] as string;

  // Check if item exists and has no orders
  const itemWithOrders = await prisma.menuItem.findUnique({
    where: { id },
    include: {
      _count: {
        select: { orderItems: true }
      }
    }
  });

  if (!itemWithOrders) {
    throw new AppError('Menu item not found', 404);
  }

  if (itemWithOrders._count.orderItems > 0) {
    throw new AppError('Cannot delete item with existing orders', 400);
  }

  await prisma.menuItem.delete({
    where: { id }
  });

  res.status(200).json({
    success: true,
    message: 'Menu item deleted successfully'
  });
}));

// @route   GET /api/menu/modifiers
// @desc    Get all modifiers
// @access  Public
router.get('/modifiers', asyncHandler(async (_req: Request, res: Response) => {
  const modifiers = await prisma.modifier.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  });

  res.status(200).json({
    success: true,
    data: { modifiers }
  });
}));

// @route   POST /api/menu/modifiers
// @desc    Create new modifier
// @access  Private (Manager+)
router.post('/modifiers', requireManager, validateModifier, asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { name, price }: { name: string; price: number } = req.body;

  // Check if modifier already exists
  const existingModifier = await prisma.modifier.findFirst({ where: { name } });

  if (existingModifier) {
    throw new AppError('Modifier already exists', 400);
  }

  const modifier = await prisma.modifier.create({
    data: { name, price }
  });

  res.status(201).json({
    success: true,
    message: 'Modifier created successfully',
    data: { modifier }
  });
}));

export default router; 