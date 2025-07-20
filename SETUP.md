# 🚀 POS System Setup Guide

This guide will help you set up the complete POS system with backend and frontend.

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **PostgreSQL** (v12 or higher)
   - Download from: https://www.postgresql.org/download/
   - Create a database: `createdb pos_system`

3. **Git** (for cloning the repository)

## 🛠️ Step-by-Step Setup

### Step 1: Clone and Navigate
```bash
git clone <repository-url>
cd pos-systems-using-cursor
```

### Step 2: Backend Setup

#### 2.1 Install Backend Dependencies
```bash
cd backend
npm install
```

#### 2.2 Configure Environment
```bash
# Copy environment file
cp env.example .env
```

Edit `backend/.env` with your database credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/pos_system"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

#### 2.3 Set Up Database
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with initial data
npm run seed
```

#### 2.4 Start Backend Server
```bash
npm run dev
```

The backend will be running at: http://localhost:5000

### Step 3: Frontend Setup

#### 3.1 Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

#### 3.2 Configure Environment
```bash
# Create environment file
echo REACT_APP_API_URL=http://localhost:5000/api > .env
```

#### 3.3 Start Frontend Server
```bash
npm start
```

The frontend will be running at: http://localhost:3000

## 👥 Default Login Credentials

After seeding the database, you can log in with:

### Admin User
- **Email**: admin@restaurant.com
- **Password**: admin123
- **Role**: ADMIN (Full system access)

### Worker User
- **Email**: worker@restaurant.com
- **Password**: worker123
- **Role**: WAITER (Order and payment management)

### Kitchen Staff
- **Email**: kitchen@restaurant.com
- **Password**: kitchen123
- **Role**: KITCHEN_STAFF (Menu and order management)

## 🔧 Quick Start Scripts

### Windows (start.bat)
```bash
# Run the batch file
start.bat
```

### Linux/Mac (setup-backend.sh)
```bash
# Make executable
chmod +x setup-backend.sh

# Run the script
./setup-backend.sh
```

## 🗄️ Database Management

### View Database (Prisma Studio)
```bash
cd backend
npx prisma studio
```
Access at: http://localhost:5555

### Reset Database
```bash
cd backend
npx prisma migrate reset
npm run seed
```

### View Migrations
```bash
cd backend
npx prisma migrate status
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: 
- Ensure PostgreSQL is running
- Check DATABASE_URL in backend/.env
- Verify database exists: `createdb pos_system`

#### 2. Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**:
- Change PORT in backend/.env
- Kill process using the port: `npx kill-port 5000`

#### 3. Frontend Build Errors
```
Module not found: Can't resolve 'axios'
```
**Solution**:
```bash
cd frontend
npm install axios
```

#### 4. Authentication Errors
```
JWT_SECRET is not defined
```
**Solution**:
- Set JWT_SECRET in backend/.env
- Restart backend server

### Reset Everything
```bash
# Stop all servers
# Delete node_modules
rm -rf backend/node_modules frontend/node_modules

# Reinstall dependencies
cd backend && npm install
cd ../frontend && npm install

# Reset database
cd ../backend
npx prisma migrate reset
npm run seed

# Start servers
cd ../backend && npm run dev
cd ../frontend && npm start
```

## 📊 System Verification

### Backend Health Check
```bash
curl http://localhost:5000/health
```
Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.456
}
```

### Frontend API Connection
- Open browser: http://localhost:3000
- Try logging in with default credentials
- Check browser console for API errors

## 🔐 Security Notes

1. **Change Default Passwords**: Update default user passwords in production
2. **JWT Secret**: Use a strong, unique JWT_SECRET in production
3. **Database**: Use strong database passwords
4. **HTTPS**: Enable HTTPS in production
5. **Environment Variables**: Never commit .env files

## 📱 Testing Different Roles

### Admin Testing
1. Login as admin@restaurant.com
2. Test table management (add/edit/delete tables)
3. Test menu management
4. Check admin dashboard statistics

### Worker Testing
1. Login as worker@restaurant.com
2. Test order creation
3. Test payment processing
4. Verify revenue is hidden from workers

### Kitchen Testing
1. Login as kitchen@restaurant.com
2. Test menu item availability updates
3. Test order status updates
4. Verify kitchen-only features

## 🚀 Production Deployment

### Environment Variables
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=very-strong-secret-key
CORS_ORIGIN=https://yourdomain.com
```

### Build Commands
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
```

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Check console logs for error messages
4. Ensure database is running and accessible
5. Verify environment variables are set correctly

## 🔄 Updates

To update the system:
```bash
git pull origin main
cd backend && npm install
cd ../frontend && npm install
cd ../backend && npx prisma migrate deploy
```

---

**🎉 Congratulations!** Your POS system should now be running successfully. 