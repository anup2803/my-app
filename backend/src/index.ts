import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Import routes
import authRoutes from "./routes/auth";
import menuRoutes from "./routes/menu";
import orderRoutes from "./routes/orders";
import paymentRoutes from "./routes/payments";
import tableRoutes from "./routes/tables";
import userRoutes from "./routes/users";
import inventoryRoutes from "./routes/inventory";
import reportRoutes from "./routes/reports";

// Import middleware
import { errorHandler } from "./middleware/errorHandler";
import { authenticateToken } from "./middleware/auth";

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env['CORS_ORIGIN'] || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const prisma = new PrismaClient();
const PORT = process.env['PORT'] || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000'), // 15 minutes
  max: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100'), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env['CORS_ORIGIN'] || "http://localhost:3000",
  credentials: true
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', authenticateToken, menuRoutes);
app.use('/api/orders', authenticateToken, orderRoutes);
app.use('/api/payments', authenticateToken, paymentRoutes);
app.use('/api/tables', authenticateToken, tableRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/inventory', authenticateToken, inventoryRoutes);
app.use('/api/reports', authenticateToken, reportRoutes);

// Socket.io connection handling
io.on('connection', (socket: Socket) => {
  console.log('Client connected:', socket.id);

  // Join kitchen room for real-time order updates
  socket.on('join-kitchen', () => {
    socket.join('kitchen');
    console.log('Client joined kitchen room');
  });

  // Join waiter room for order notifications
  socket.on('join-waiter', () => {
    socket.join('waiter');
    console.log('Client joined waiter room');
  });

  // Handle order status updates
  socket.on('order-status-update', async (data: { orderId: string; status: string }) => {
    try {
      const { orderId, status } = data;
      
      // Update order status in database
      await prisma.order.update({
        where: { id: orderId },
        data: { 
          status: status as any,
          completedAt: status === 'COMPLETED' ? new Date() : null
        }
      });

      // Emit to relevant rooms
      io.to('kitchen').emit('order-updated', { orderId, status });
      io.to('waiter').emit('order-updated', { orderId, status });
      
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  });

  // Handle new order notifications
  socket.on('new-order', (orderData: any) => {
    io.to('kitchen').emit('new-order-received', orderData);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Process terminated');
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env['NODE_ENV']}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
});

export { io, prisma }; 