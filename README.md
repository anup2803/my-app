# Restaurant POS System

A comprehensive Point of Sale (POS) system built with React, TypeScript, Node.js, and PostgreSQL. Features role-based access control for Admin, Workers, and Kitchen staff.

## 🚀 Features

### Admin Panel
- **Dashboard**: System overview with statistics and quick actions
- **Table Management**: Add, edit, and delete restaurant tables
- **Menu Management**: Manage categories and menu items
- **User Management**: Manage staff accounts and permissions
- **System Settings**: Configure restaurant settings

### Worker Panel
- **Orders**: Create and manage customer orders
- **Payments**: Process payments with multiple payment methods
- **Tables**: View table status and manage reservations
- **Menu**: Browse menu items with pictures

### Kitchen Panel
- **Menu Management**: Update menu items and availability
- **Stock Management**: Track ingredient inventory
- **Order Processing**: View and update order status
- **Real-time Updates**: Live order notifications

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for UI components
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Axios** for API communication
- **React Toastify** for notifications

### Backend
- **Node.js** with TypeScript
- **Express.js** for API framework
- **PostgreSQL** with Prisma ORM
- **JWT** for authentication
- **Socket.io** for real-time communication
- **bcryptjs** for password hashing

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd pos-systems-using-cursor
```

### 2. Set Up Database
```bash
# Install PostgreSQL if not already installed
# Create a new database
createdb pos_system
```

### 3. Configure Environment Variables

#### Backend (.env)
```bash
cd backend
cp env.example .env
```

Edit `backend/.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/pos_system"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env)
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Install Dependencies
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 5. Set Up Database
```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed the database
npm run seed
```

### 6. Start the Application

#### Start Backend
```bash
cd backend
npm run dev
```

#### Start Frontend (in a new terminal)
```bash
cd frontend
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Prisma Studio**: http://localhost:5555

## 👥 Default Users

After seeding the database, you can log in with these credentials:

### Admin User
- **Email**: admin@restaurant.com
- **Password**: admin123
- **Role**: ADMIN

### Worker User
- **Email**: worker@restaurant.com
- **Password**: worker123
- **Role**: WAITER

### Kitchen Staff
- **Email**: kitchen@restaurant.com
- **Password**: kitchen123
- **Role**: KITCHEN_STAFF

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Menu Management
- `GET /api/menu/categories` - Get all categories
- `GET /api/menu/items` - Get menu items
- `POST /api/menu/items` - Create menu item
- `PUT /api/menu/items/:id` - Update menu item
- `DELETE /api/menu/items/:id` - Delete menu item

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `PATCH /api/orders/:id/status` - Update order status

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Create payment
- `PATCH /api/payments/:id/status` - Update payment status

### Tables
- `GET /api/tables` - Get all tables
- `POST /api/tables` - Create table
- `PUT /api/tables/:id` - Update table
- `DELETE /api/tables/:id` - Delete table

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🏗️ Project Structure

```
pos-systems-using-cursor/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── public/             # Static files
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   └── index.ts        # Server entry point
│   └── prisma/             # Database schema and migrations
└── docs/                   # Documentation
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for different roles
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Express-validator for request validation
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Secure cross-origin requests

## 📊 Database Schema

The system uses PostgreSQL with the following main entities:

- **Users**: Staff accounts with roles
- **Categories**: Menu categories
- **MenuItems**: Individual menu items
- **Tables**: Restaurant tables
- **Orders**: Customer orders
- **OrderItems**: Items within orders
- **Payments**: Payment transactions
- **Ingredients**: Inventory items

## 🚀 Deployment

### Production Build
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
```

### Environment Variables
Make sure to set appropriate environment variables for production:
- `NODE_ENV=production`
- `DATABASE_URL` (production database)
- `JWT_SECRET` (strong secret key)
- `CORS_ORIGIN` (your domain)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in the `docs/` folder
- Review the API endpoints documentation

## 🔄 Updates

- **v1.0.0**: Initial release with basic POS functionality
- **v1.1.0**: Added real-time notifications and kitchen panel
- **v1.2.0**: Enhanced admin panel and table management