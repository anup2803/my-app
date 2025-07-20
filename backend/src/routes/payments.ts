import { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { PaymentGateway, PaymentStatus, PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import { asyncHandler } from '../middleware/errorHandler';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Initialize payment gateways
const stripe = new Stripe(process.env['STRIPE_SECRET_KEY']!, {
  apiVersion: '2023-10-16'
});

const razorpay = new Razorpay({
  key_id: process.env['RAZORPAY_KEY_ID']!,
  key_secret: process.env['RAZORPAY_SECRET']!
});

// Validation middleware
const validatePayment = [
  body('orderId').isUUID(),
  body('amount').isFloat({ min: 0.01 }),
  body('method').isIn(['CASH', 'CARD', 'KHALTI', 'ESEWA', 'MOBILE_WALLET']),
  body('transactionId').optional().trim().isLength({ max: 100 })
];

const validateRefund = [
  param('id').isUUID(),
  body('amount').isFloat({ min: 0.01 }),
  body('reason').optional().trim().isLength({ max: 200 })
];

// @route   POST /api/payments
// @desc    Process payment
// @access  Private
router.post('/', validatePayment, asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { orderId, amount, method, transactionId, metadata } = req.body as any;
  const userId = (req as any).user.id;

  // Check if order exists and is not completed
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      payments: true
    }
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.status === 'CANCELLED') {
    throw new AppError('Cannot process payment for cancelled order', 400);
  }

  // Calculate total paid amount
  const totalPaid = order.payments
    .filter((p: any) => p.status === 'COMPLETED')
    .reduce((sum: number, p: any) => sum + Number(p.amount), 0);

  const remainingAmount = Number(order.total) - totalPaid;

  if (amount > remainingAmount) {
    throw new AppError('Payment amount exceeds remaining balance', 400);
  }

  let paymentStatus: PaymentStatus = 'PENDING' as PaymentStatus;
  let gateway: PaymentGateway | null = null;

  // Process payment based on method
  switch (method) {
    case 'CASH':
      paymentStatus = 'COMPLETED' as PaymentStatus;
      gateway = 'CASH' as PaymentGateway;
      break;

    case 'CARD':
      // For demo purposes, we'll simulate card payment
      // In production, you'd integrate with Stripe
      if (metadata?.stripePaymentIntentId) {
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(metadata.stripePaymentIntentId);
          if (paymentIntent.status === 'succeeded') {
            paymentStatus = 'COMPLETED' as PaymentStatus;
            gateway = 'STRIPE' as PaymentGateway;
          } else {
            throw new AppError('Payment failed', 400);
          }
        } catch (error) {
          throw new AppError('Invalid payment intent', 400);
        }
      } else {
        // Simulate successful payment for demo
        paymentStatus = 'COMPLETED' as PaymentStatus;
        gateway = 'STRIPE' as PaymentGateway;
      }
      break;

    case 'KHALTI':
    case 'ESEWA':
      // For demo purposes, we'll simulate digital wallet payment
      // In production, you'd integrate with respective gateways
      if (metadata?.razorpayPaymentId) {
        try {
          const payment = await razorpay.payments.fetch(metadata.razorpayPaymentId);
          if (payment.status === 'captured') {
            paymentStatus = 'COMPLETED' as PaymentStatus;
            gateway = 'RAZORPAY' as PaymentGateway;
          } else {
            throw new AppError('Payment failed', 400);
          }
        } catch (error) {
          throw new AppError('Invalid payment ID', 400);
        }
      } else {
        // Simulate successful payment for demo
        paymentStatus = 'COMPLETED' as PaymentStatus;
        gateway = 'RAZORPAY' as PaymentGateway;
      }
      break;

    default:
      throw new AppError('Invalid payment method', 400);
  }

  // Create payment record
  const payment = await prisma.payment.create({
    data: {
      orderId,
      amount,
      method,
      status: paymentStatus,
      transactionId: transactionId || `TXN_${Date.now()}`,
      gateway: gateway as PaymentGateway,
      metadata: metadata || {},
      processedBy: userId
    },
    include: {
      order: {
        include: {
          table: true,
          items: {
            include: {
              menuItem: true
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

  // Update order status if fully paid
  const newTotalPaid = totalPaid + Number(amount);
  if (newTotalPaid >= Number(order.total)) {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'COMPLETED' }
    });
  }

  res.status(201).json({
    success: true,
    message: 'Payment processed successfully',
    data: { payment }
  });
}));

// @route   GET /api/payments/order/:orderId
// @desc    Get payments for an order
// @access  Private
router.get('/order/:orderId', [
  param('orderId').isUUID()
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { orderId } = req.params as any;

  const payments = await prisma.payment.findMany({
    where: { orderId },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    success: true,
    data: { payments }
  });
}));

// @route   POST /api/payments/:id/refund
// @desc    Process refund
// @access  Private
router.post('/:id/refund', validateRefund, asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { id } = req.params as any;
  const { amount, reason } = req.body as any;
  const userId = (req as any).user.id;

  // Check if payment exists
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      order: true
    }
  });

  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  if (payment.status !== 'COMPLETED') {
    throw new AppError('Only completed payments can be refunded', 400);
  }

  if (amount > Number(payment.amount)) {
    throw new AppError('Refund amount cannot exceed payment amount', 400);
  }

  // Process refund based on gateway
  let refundStatus = 'COMPLETED';

  switch (payment.gateway) {
    case 'STRIPE':
      if (payment.transactionId) {
        try {
          const refund = await stripe.refunds.create({
            payment_intent: payment.transactionId,
            amount: Math.round(amount * 100) // Convert to cents
          });
          refundStatus = refund.status === 'succeeded' ? 'COMPLETED' : 'FAILED';
        } catch (error) {
          throw new AppError('Refund processing failed', 400);
        }
      }
      break;

    case 'RAZORPAY':
      if (payment.transactionId) {
        try {
          const refund = await razorpay.payments.refund(payment.transactionId, {
            amount: Math.round(amount * 100) // Convert to paise
          });
          refundStatus = refund.status === 'processed' ? 'COMPLETED' : 'FAILED';
        } catch (error) {
          throw new AppError('Refund processing failed', 400);
        }
      }
      break;

    case 'CASH':
      // Cash refunds are always successful
      refundStatus = 'COMPLETED';
      break;

    default:
      throw new AppError('Unsupported payment gateway for refund', 400);
  }

  // Create refund payment record
  const refundPayment = await prisma.payment.create({
    data: {
      orderId: payment.orderId,
      amount: -amount, // Negative amount for refund
      method: payment.method,
      status: refundStatus as PaymentStatus,
      transactionId: `REF_${Date.now()}`,
      gateway: payment.gateway,
      metadata: {
        originalPaymentId: payment.id,
        reason: reason || 'Customer request'
      },
      processedBy: userId
    },
    include: {
      order: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    }
  });

  // Update original payment status
  await prisma.payment.update({
    where: { id },
    data: { status: 'REFUNDED' }
  });

  res.status(200).json({
    success: true,
    message: 'Refund processed successfully',
    data: { refund: refundPayment }
  });
}));

// @route   GET /api/payments/summary
// @desc    Get payment summary
// @access  Private
router.get('/summary', asyncHandler(async (req: Request, res: Response  ) => {
  const { startDate, endDate } = req.query as any  ;

  const where: any = {};
  
  if (startDate && endDate) {
    where.createdAt = {
      gte: new Date(startDate as string),
      lte: new Date(endDate as string)
    };
  }

  const [payments, totalAmount, totalRefunds] = await Promise.all([
    prisma.payment.findMany({
      where: {
        ...where,
        status: 'COMPLETED'
      },
      select: {
        method: true,
        amount: true,
        createdAt: true
      }
    }),
    prisma.payment.aggregate({
      where: {
        ...where,
        status: 'COMPLETED',
        amount: { gt: 0 }
      },
      _sum: { amount: true }
    }),
    prisma.payment.aggregate({
      where: {
        ...where,
        status: 'COMPLETED',
        amount: { lt: 0 }
      },
      _sum: { amount: true }
    })
  ]);

  // Group by payment method
  const methodSummary = payments.reduce((acc: any, payment: any) => {
    const method = payment.method;
    if (!acc[method]) {
      acc[method] = { count: 0, total: 0 };
    }
    acc[method].count++;
    acc[method].total += Number(payment.amount);
    return acc;
  }, {} as any);

  res.status(200).json({
    success: true,
    data: {
      summary: {
        totalPayments: payments.length,
        totalAmount: Number(totalAmount._sum.amount || 0),
        totalRefunds: Math.abs(Number(totalRefunds._sum.amount || 0)),
        netAmount: Number(totalAmount._sum.amount || 0) + Number(totalRefunds._sum.amount || 0),
        methodSummary
      }
    }
  });
}));

export default router;