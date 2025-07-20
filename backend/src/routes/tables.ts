import { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { PrismaClient, TableStatus } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { requireManager } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const validateTable = [
  body('number').isInt({ min: 1 }),
  body('capacity').isInt({ min: 1, max: 20 }),
  body('status').optional().isIn(['AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING'])
];

// GET all tables
router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const tables = await prisma.table.findMany({
    include: {
      assignedUser: {
        select: { id: true, firstName: true, lastName: true }
      },
      orders: {
        where: {
          status: { in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'SERVED'] }
        },
        include: {
          items: { include: { menuItem: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    },
    orderBy: { number: 'asc' }
  });

  res.status(200).json({ success: true, data: { tables } });
}));

// GET table by ID
router.get('/:id', [param('id').isUUID()], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new AppError('Validation failed', 400);

  const id = req.params['id']!;

  const table = await prisma.table.findUnique({
    where: { id },
    include: {
      assignedUser: { select: { id: true, firstName: true, lastName: true } },
      orders: {
        include: {
          items: { include: { menuItem: true } },
          payments: true
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!table) throw new AppError('Table not found', 404);

  res.status(200).json({ success: true, data: { table } });
}));

// POST create table
router.post('/', requireManager, validateTable, asyncHandler(async (req: Request, res: Response ) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new AppError('Validation failed', 400);

  const number = parseInt(req.body.number, 10);
  const capacity = parseInt(req.body.capacity, 10);
  const status = req.body.status as TableStatus | undefined;

  const existingTable = await prisma.table.findUnique({ where: { number } });
  if (existingTable) throw new AppError('Table number already exists', 400);

  const table = await prisma.table.create({
    data: {
      number,
      capacity,
      status: status || 'AVAILABLE'
    }
  });

  res.status(201).json({
    success: true,
    message: 'Table created successfully',
    data: { table }
  });
}));

// PUT update table
router.put('/:id', requireManager, [param('id').isUUID(), ...validateTable], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new AppError('Validation failed', 400);

  const id = req.params['id']!;
  const number = parseInt(req.body.number, 10);
  const capacity = parseInt(req.body.capacity, 10);
  const status = req.body.status as TableStatus;

  const existingTable = await prisma.table.findUnique({ where: { id } });
  if (!existingTable) throw new AppError('Table not found', 404);

  if (number !== existingTable.number) {
    const numberExists = await prisma.table.findUnique({ where: { number } });
    if (numberExists) throw new AppError('Table number already exists', 400);
  }

  const table = await prisma.table.update({
    where: { id },
    data: { number, capacity, status }
  });

  res.status(200).json({
    success: true,
    message: 'Table updated successfully',
    data: { table }
  });
}));

// DELETE table
router.delete('/:id', requireManager, [param('id').isUUID()], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new AppError('Validation failed', 400);

  const id = req.params['id']!;

  const tableWithOrders = await prisma.table.findUnique({
    where: { id },
    include: {
      orders: {
        where: {
          status: { in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'SERVED'] }
        }
      }
    }
  });

  if (!tableWithOrders) throw new AppError('Table not found', 404);
  if (tableWithOrders.orders.length > 0)
    throw new AppError('Cannot delete table with active orders', 400);

  await prisma.table.delete({ where: { id } });

  res.status(200).json({ success: true, message: 'Table deleted successfully' });
}));

// POST assign table to staff
router.post('/:id/assign', requireManager, [
  param('id').isUUID(),
  body('userId').isUUID()
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new AppError('Validation failed', 400);

  const id = req.params['id']!;
  const userId = req.body.userId;

  const table = await prisma.table.findUnique({ where: { id } });
  if (!table) throw new AppError('Table not found', 404);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, isActive: true, role: true }
  });

  if (!user || !user.isActive) throw new AppError('User not found or inactive', 404);
  if (!['WAITER', 'MANAGER', 'ADMIN'].includes(user.role))
    throw new AppError('Only waiters can be assigned to tables', 400);

  const updatedTable = await prisma.table.update({
    where: { id },
    data: { assignedTo: userId },
    include: {
      assignedUser: {
        select: { id: true, firstName: true, lastName: true }
      }
    }
  });

  res.status(200).json({
    success: true,
    message: 'Table assigned successfully',
    data: { table: updatedTable }
  });
}));

// POST unassign table
router.post('/:id/unassign', requireManager, [param('id').isUUID()], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new AppError('Validation failed', 400);

  const id = req.params['id']!;

  const table = await prisma.table.findUnique({ where: { id } });
  if (!table) throw new AppError('Table not found', 404);

  const updatedTable = await prisma.table.update({
    where: { id },
    data: { assignedTo: null },
    include: {
      assignedUser: {
        select: { id: true, firstName: true, lastName: true }
      }
    }
  });

  res.status(200).json({
    success: true,
    message: 'Table unassigned successfully',
    data: { table: updatedTable }
  });
}));

// GET table status summary
router.get('/status/summary', asyncHandler(async (_req: Request, res: Response) => {
  const tables = await prisma.table.findMany({ select: { status: true } });

  const summary = tables.reduce((acc: Record<string, number>, table) => {
    acc[table.status] = (acc[table.status] || 0) + 1;
    return acc;
  }, {});

  res.status(200).json({ success: true, data: { summary } });
}));

export default router;
