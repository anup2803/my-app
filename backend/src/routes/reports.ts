import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { AppError } from '../middleware/errorHandler';
import { requireManager } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// @route   GET /api/reports/sales
// @desc    Get sales report
// @access  Private (Manager+)
router.get('/sales', requireManager, asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query as any;

  if (!startDate || !endDate) {
    throw new AppError('Start date and end date are required', 400);
  }

  const start = new Date(startDate as string);
  const end = new Date(endDate as string);

  // Get orders in date range
  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end
      },
      status: 'COMPLETED'
    },
    include: {
      items: {
        include: {
          menuItem: {
            include: {
              category: true
            }
          }
        }
      },
      payments: {
        where: {
          status: 'COMPLETED'
        }
      }
    }
  });

  // Calculate totals
  const totalSales = orders.reduce((sum: number, order: any) => sum + Number(order.total), 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  // Group by date
  const salesByDate = orders.reduce((acc: any, order: any) => {
    const date = order.createdAt.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { sales: 0, orders: 0 };
    }
    acc[date].sales += Number(order.total);
    acc[date].orders += 1;
    return acc;
  }, {} as any);

  // Top selling items
  const itemSales = orders.reduce((acc: any, order: any) => {
    order.items.forEach((item: any) => {
      const itemName = item.menuItem.name;
      if (!acc[itemName]) {
        acc[itemName] = { quantity: 0, revenue: 0 };
      }
      acc[itemName].quantity += item.quantity;
      acc[itemName].revenue += Number(item.totalPrice);
    });
    return acc;
  }, {} as any);

  const topSellingItems = Object.entries(itemSales)
    .map(([name, data]: [string, any]) => ({
      name,
      quantity: data.quantity,
      revenue: data.revenue
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);

  // Payment method breakdown
  const paymentMethods = orders.reduce((acc: any, order: any) => {
    order.payments.forEach((payment: any) => {
      const method = payment.method;
      if (!acc[method]) {
        acc[method] = { count: 0, amount: 0 };
      }
      acc[method].count += 1;
      acc[method].amount += Number(payment.amount);
    });
    return acc;
  }, {} as any);

  res.status(200).json({
    success: true,
    data: {
      summary: {
        totalSales,
        totalOrders,
        averageOrderValue,
        dateRange: { start, end }
      },
      salesByDate,
      topSellingItems,
      paymentMethods
    }
  });
}));

// @route   GET /api/reports/staff-performance
// @desc    Get staff performance report
// @access  Private (Manager+)
router.get('/staff-performance', requireManager, asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query as any;

  if (!startDate || !endDate) {
    throw new AppError('Start date and end date are required', 400);
  }

  const start = new Date(startDate as string);
  const end = new Date(endDate as string);

  // Get staff performance data
  const staffPerformance = await prisma.user.findMany({
    where: {
      role: {
        in: ['WAITER', 'MANAGER']
      },
      isActive: true
    },
    include: {
      orders: {
        where: {
          createdAt: {
            gte: start,
            lte: end
          },
          status: 'COMPLETED'
        },
        include: {
          items: true,
          payments: {
            where: {
              status: 'COMPLETED'
            }
          }
        }
      }
    }
  });

  const performanceData = staffPerformance.map((staff: any) => {
    const totalOrders = staff.orders.length;
    const totalSales = staff.orders.reduce((sum: number, order: any) => sum + Number(order.total), 0);
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    const totalItems = staff.orders.reduce((sum: number, order: any) => 
      sum + order.items.reduce((itemSum: number, item: any) => itemSum + item.quantity, 0), 0
    );

    return {
      id: staff.id,
      name: `${staff.firstName} ${staff.lastName}`,
      role: staff.role,
      totalOrders,
      totalSales,
      averageOrderValue,
      totalItems,
      averageItemsPerOrder: totalOrders > 0 ? totalItems / totalOrders : 0
    };
  });

  res.status(200).json({
    success: true,
    data: {
      performanceData,
      dateRange: { start, end }
    }
  });
}));

// @route   GET /api/reports/inventory
// @desc    Get inventory report
// @access  Private (Manager+)
router.get('/inventory', requireManager, asyncHandler(async (_req: Request, res: Response) => {
  // Get all ingredients with their usage
  const ingredients = await prisma.ingredient.findMany({
    where: { isActive: true },
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

  const inventoryReport = ingredients.map((ingredient: any) => {
    const totalUsage = ingredient.usages.reduce((sum: number, usage: any) => sum + Number(usage.quantity), 0);
    const menuItems = ingredient.usages.map((usage: any) => usage.menuItem.name);
    const stockValue = Number(ingredient.currentStock) * Number(ingredient.costPerUnit);
    const isLowStock = Number(ingredient.currentStock) <= Number(ingredient.minStock);

    return {
      id: ingredient.id,
      name: ingredient.name,
      currentStock: ingredient.currentStock,
      minStock: ingredient.minStock,
      unit: ingredient.unit,
      costPerUnit: ingredient.costPerUnit,
      stockValue,
      totalUsage,
      menuItems,
      isLowStock,
      supplier: ingredient.supplier
    };
  });

  // Calculate inventory summary
  const totalItems = ingredients.length;
  const lowStockItems = ingredients.filter((i: any) => Number(i.currentStock) <= Number(i.minStock)).length;
  const totalStockValue = ingredients.reduce((sum: number, i: any) => 
    sum + (Number(i.currentStock) * Number(i.costPerUnit)), 0
  );

  res.status(200).json({
    success: true,
    data: {
      summary: {
        totalItems,
        lowStockItems,
        totalStockValue
      },
      inventoryReport
    }
  });
}));

// @route   GET /api/reports/dashboard
// @desc    Get dashboard summary
// @access  Private
router.get('/dashboard', asyncHandler(async (_req: Request, res: Response) => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  // Today's orders
  const todayOrders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: startOfDay,
        lt: endOfDay
      }
    },
    include: {
      items: true,
      payments: {
        where: {
          status: 'COMPLETED'
        }
      }
    }
  });

  // Today's sales
  const todaySales = todayOrders.reduce((sum: number, order: any) => sum + Number(order.total), 0);
  const todayCompletedOrders = todayOrders.filter((o: any) => o.status === 'COMPLETED').length;
  const todayPendingOrders = todayOrders.filter((o: any) => 
    ['PENDING', 'CONFIRMED', 'PREPARING'].includes(o.status)
  ).length;

  // Active tables
  const activeTables = await prisma.table.count({
    where: {
      status: 'OCCUPIED'
    }
  });

  // Low stock items
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

  // Recent orders
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      table: true,
      user: {
        select: {
          firstName: true,
          lastName: true
        }
      }
    }
  });

  res.status(200).json({
    success: true,
    data: {
      today: {
        sales: todaySales,
        orders: todayOrders.length,
        completedOrders: todayCompletedOrders,
        pendingOrders: todayPendingOrders
      },
      activeTables,
      lowStockIngredients,
      recentOrders
    }
  });
}));

export default router; 