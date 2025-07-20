import { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { AppError } from '../middleware/errorHandler';
import { io } from '../index';

const router = Router();
const prisma = new PrismaClient();

// Validation middleware
const validateOrder = [
  body('tableId').optional().isUUID(),
  body('customerName').optional().trim().isLength({ max: 100 }),
  body('customerPhone').optional().trim().isLength({ max: 20 }),
  body('orderType').isIn(['DINE_IN', 'TAKEAWAY', 'DELIVERY']),
  body('items').isArray({ min: 1 }),
  body('items.*.menuItemId').isUUID(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('items.*.unitPrice').isFloat({ min: 0 }),
  body('items.*.notes').optional().trim().isLength({ max: 200 }),
  body('specialNotes').optional().trim().isLength({ max: 500 })
];

const validateOrderUpdate = [
  param('id').isUUID(),
  body('status').optional().isIn(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'SERVED', 'COMPLETED', 'CANCELLED']),
  body('specialNotes').optional().trim().isLength({ max: 500 })
];

// Generate order number
const generateOrderNumber = async (): Promise<string> => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  
  // Get count of orders for today
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  
  const orderCount = await prisma.order.count({
    where: {
      createdAt: {
        gte: startOfDay,
        lt: endOfDay
      }
    }
  });
  
  return `ORD${dateStr}${(orderCount + 1).toString().padStart(3, '0')}`;
};

// @route   GET /api/orders
// @desc    Get all orders with filters
// @access  Private
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { 
    status, 
    orderType, 
    tableId, 
    startDate, 
    endDate, 
    page = '1', 
    limit = '20' 
  } = req.query as any;

  const where: any = {};
  
  if (status) {
    where.status = status;
  }
  
  if (orderType) {
    where.orderType = orderType;
  }
  
  if (tableId) {
    where.tableId = tableId;
  }
  
  if (startDate && endDate) {
    where.createdAt = {
      gte: new Date(startDate as string),
      lte: new Date(endDate as string)
    };
  }

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        table: true,
        items: {
          include: {
            menuItem: {
              include: {
                category: true
              }
            }
          }
        },
        payments: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum
    }),
    prisma.order.count({ where })
  ]);

  res.status(200).json({
    success: true,
    data: { 
      orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    }
  });
}));

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', [
  param('id').isUUID()
], asyncHandler(async (req: Request, res: Response ) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { id } = req.params as any;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      table: true,
      items: {
        include: {
          menuItem: {
            include: {
              category: true,
              modifiers: true
            }
          }
        }
      },
      payments: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      },
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    }
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  res.status(200).json({
    success: true,
    data: { order }
  });
}));

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', validateOrder, asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { 
    tableId, 
    customerName, 
    customerPhone, 
    orderType, 
    items, 
    specialNotes 
  } = req.body as any;
  const userId = (req as any).user.id;

  // Validate table if provided
  if (tableId) {
    const table = await prisma.table.findUnique({
      where: { id: tableId }
    });

    if (!table) {
      throw new AppError('Table not found', 404);
    }

    if (table.status !== 'AVAILABLE') {
      throw new AppError('Table is not available', 400);
    }
  }

  // Calculate totals
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: item.menuItemId }
    });

    if (!menuItem) {
      throw new AppError(`Menu item ${item.menuItemId} not found`, 404);
    }

    if (!menuItem.isActive) {
      throw new AppError(`Menu item ${menuItem.name} is not available`, 400);
    }

    const totalPrice = item.unitPrice * item.quantity;
    subtotal += totalPrice;

    orderItems.push({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice,
      notes: item.notes
    });
  }

  const tax = subtotal * 0.13; // 13% tax
  const total = subtotal + tax;

  // Generate order number
  const orderNumber = await generateOrderNumber();

  // Create order with items
  const order = await prisma.order.create({
    data: {
      orderNumber,
      tableId,
      customerName,
      customerPhone,
      orderType,
      subtotal,
      tax,
      total,
      specialNotes,
      createdBy: userId,
      items: {
        create: orderItems
      }
    },
    include: {
      table: true,
      items: {
        include: {
          menuItem: {
            include: {
              category: true
            }
          }
        }
      },
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    }
  });

  // Update table status if dine-in
  if (tableId && orderType === 'DINE_IN') {
    await prisma.table.update({
      where: { id: tableId },
      data: { 
        status: 'OCCUPIED',
        currentOrderId: order.id
      }
    });
  }

  // Emit real-time update to kitchen
  io.to('kitchen').emit('new-order-received', {
    orderId: order.id,
    orderNumber: order.orderNumber,
    items: order.items,
    specialNotes: order.specialNotes,
    createdAt: order.createdAt
  });

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: { order }
  });
}));

// @route   PUT /api/orders/:id
// @desc    Update order
// @access  Private
router.put('/:id', validateOrderUpdate, asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { id } = req.params as any;
  const { status, specialNotes } = req.body as any;

  // Check if order exists
  const existingOrder = await prisma.order.findUnique({
    where: { id },
    include: {
      table: true,
      items: {
        include: {
          menuItem: true
        }
      }
    }
  });

  if (!existingOrder) {
    throw new AppError('Order not found', 404);
  }

  // Update order
  const updateData: any = {};
  if (status) updateData.status = status;
  if (specialNotes !== undefined) updateData.specialNotes = specialNotes;
  
  if (status === 'COMPLETED') {
    updateData.completedAt = new Date();
  }

  const order = await prisma.order.update({
    where: { id },
    data: updateData,
    include: {
      table: true,
      items: {
        include: {
          menuItem: {
            include: {
              category: true
            }
          }
        }
      },
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    }
  });

  // Update table status if order is completed
  if (status === 'COMPLETED' && order.tableId) {
    await prisma.table.update({
      where: { id: order.tableId },
      data: { 
        status: 'AVAILABLE',
        currentOrderId: null
      }
    });
  }

  // Emit real-time update
  io.to('kitchen').emit('order-updated', {
    orderId: order.id,
    status: order.status,
    updatedAt: order.updatedAt
  });

  io.to('waiter').emit('order-updated', {
    orderId: order.id,
    status: order.status,
    updatedAt: order.updatedAt
  });

  res.status(200).json({
    success: true,
    message: 'Order updated successfully',
    data: { order }
  });
}));

// @route   DELETE /api/orders/:id
// @desc    Cancel order
// @access  Private
router.delete('/:id', [
  param('id').isUUID()
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { id } = req.params as any;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      table: true,
      payments: true
    }
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Check if order has payments
  if (order.payments.length > 0) {
    throw new AppError('Cannot cancel order with payments', 400);
  }

  // Update order status to cancelled
  await prisma.order.update({
    where: { id },
    data: { 
      status: 'CANCELLED',
      completedAt: new Date()
    }
  });

  // Update table status if dine-in
  if (order.tableId && order.orderType === 'DINE_IN') {
    await prisma.table.update({
      where: { id: order.tableId },
      data: { 
        status: 'AVAILABLE',
        currentOrderId: null
      }
    });
  }

  // Emit real-time update
  io.to('kitchen').emit('order-updated', {
    orderId: order.id,
    status: 'CANCELLED'
  });

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully'
  });
}));

// @route   GET /api/orders/kitchen/active
// @desc    Get active orders for kitchen
// @access  Private
router.get('/kitchen/active', asyncHandler(async (_req: Request, res: Response) => {
  const activeOrders = await prisma.order.findMany({
    where: {
      status: {
        in: ['PENDING', 'CONFIRMED', 'PREPARING']
      }
    },
    include: {
      table: true,
      items: {
        include: {
          menuItem: {
            include: {
              category: true
            }
          }
        }
      },
      user: {
        select: {
          firstName: true,
          lastName: true
        }
      }
    },
    orderBy: [
      { status: 'asc' },
      { createdAt: 'asc' }
    ]
  });

  res.status(200).json({
    success: true,
    data: { orders: activeOrders }
  });
}));

export default router; 