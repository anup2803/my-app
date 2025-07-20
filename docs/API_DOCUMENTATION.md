# Restaurant POS System API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "username": "username",
      "firstName": "John",
      "lastName": "Doe",
      "role": "WAITER",
      "isActive": true
    },
    "token": "jwt_token_here"
  }
}
```

#### POST /auth/logout
Logout and invalidate session.

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### GET /auth/me
Get current user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "username": "username",
      "firstName": "John",
      "lastName": "Doe",
      "role": "WAITER",
      "isActive": true
    }
  }
}
```

### Menu Management

#### GET /menu/categories
Get all active categories.

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "category_id",
        "name": "Starters",
        "description": "Appetizers and starters",
        "image": "image_url",
        "isActive": true,
        "sortOrder": 1,
        "_count": {
          "items": 5
        }
      }
    ]
  }
}
```

#### POST /menu/categories
Create new category (Manager+).

**Request Body:**
```json
{
  "name": "Desserts",
  "description": "Sweet treats",
  "sortOrder": 4
}
```

#### GET /menu/items
Get menu items with optional filters.

**Query Parameters:**
- `categoryId`: Filter by category
- `search`: Search by name or description
- `isActive`: Filter by active status

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "item_id",
        "name": "Margherita Pizza",
        "description": "Classic tomato and mozzarella",
        "price": 12.99,
        "image": "image_url",
        "categoryId": "category_id",
        "isActive": true,
        "isVegetarian": true,
        "isSpicy": false,
        "preparationTime": 15,
        "category": {
          "id": "category_id",
          "name": "Main Course"
        },
        "modifiers": [
          {
            "id": "modifier_id",
            "name": "Extra Cheese",
            "price": 2.00
          }
        ]
      }
    ]
  }
}
```

### Order Management

#### GET /orders
Get orders with pagination and filters.

**Query Parameters:**
- `status`: Filter by order status
- `orderType`: Filter by order type (DINE_IN, TAKEAWAY, DELIVERY)
- `tableId`: Filter by table
- `startDate`: Start date for filtering
- `endDate`: End date for filtering
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "order_id",
        "orderNumber": "ORD20231201001",
        "tableId": "table_id",
        "customerName": "John Doe",
        "customerPhone": "+1234567890",
        "orderType": "DINE_IN",
        "status": "COMPLETED",
        "subtotal": 25.98,
        "tax": 3.38,
        "discount": 0,
        "total": 29.36,
        "specialNotes": "Extra spicy",
        "createdAt": "2023-12-01T10:30:00Z",
        "completedAt": "2023-12-01T11:15:00Z",
        "table": {
          "id": "table_id",
          "number": 5,
          "capacity": 4
        },
        "items": [
          {
            "id": "order_item_id",
            "quantity": 2,
            "unitPrice": 12.99,
            "totalPrice": 25.98,
            "notes": "Extra cheese",
            "menuItem": {
              "id": "menu_item_id",
              "name": "Margherita Pizza",
              "category": {
                "id": "category_id",
                "name": "Main Course"
              }
            }
          }
        ],
        "payments": [
          {
            "id": "payment_id",
            "amount": 29.36,
            "method": "CARD",
            "status": "COMPLETED"
          }
        ],
        "user": {
          "id": "user_id",
          "firstName": "John",
          "lastName": "Doe"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

#### POST /orders
Create new order.

**Request Body:**
```json
{
  "tableId": "table_id",
  "customerName": "John Doe",
  "customerPhone": "+1234567890",
  "orderType": "DINE_IN",
  "items": [
    {
      "menuItemId": "menu_item_id",
      "quantity": 2,
      "unitPrice": 12.99,
      "notes": "Extra cheese"
    }
  ],
  "specialNotes": "Extra spicy"
}
```

#### PUT /orders/:id
Update order status.

**Request Body:**
```json
{
  "status": "COMPLETED",
  "specialNotes": "Updated notes"
}
```

### Payment Processing

#### POST /payments
Process payment.

**Request Body:**
```json
{
  "orderId": "order_id",
  "amount": 29.36,
  "method": "CARD",
  "transactionId": "txn_123456",
  "metadata": {
    "stripePaymentIntentId": "pi_123456"
  }
}
```

#### GET /payments/order/:orderId
Get payments for an order.

**Response:**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": "payment_id",
        "amount": 29.36,
        "method": "CARD",
        "status": "COMPLETED",
        "transactionId": "txn_123456",
        "gateway": "STRIPE",
        "createdAt": "2023-12-01T11:15:00Z",
        "user": {
          "id": "user_id",
          "firstName": "John",
          "lastName": "Doe"
        }
      }
    ]
  }
}
```

### Table Management

#### GET /tables
Get all tables with status.

**Response:**
```json
{
  "success": true,
  "data": {
    "tables": [
      {
        "id": "table_id",
        "number": 5,
        "capacity": 4,
        "status": "OCCUPIED",
        "currentOrderId": "order_id",
        "assignedTo": "user_id",
        "assignedUser": {
          "id": "user_id",
          "firstName": "John",
          "lastName": "Doe"
        },
        "orders": [
          {
            "id": "order_id",
            "status": "SERVED",
            "items": [
              {
                "quantity": 2,
                "menuItem": {
                  "name": "Margherita Pizza"
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### Inventory Management

#### GET /inventory/ingredients
Get all ingredients.

**Query Parameters:**
- `isActive`: Filter by active status
- `lowStock`: Filter low stock items

**Response:**
```json
{
  "success": true,
  "data": {
    "ingredients": [
      {
        "id": "ingredient_id",
        "name": "Tomato Sauce",
        "description": "Fresh tomato sauce",
        "unit": "liters",
        "currentStock": 5.5,
        "minStock": 2.0,
        "costPerUnit": 3.50,
        "supplier": "Fresh Foods Co.",
        "isActive": true,
        "_count": {
          "usages": 3
        }
      }
    ]
  }
}
```

#### POST /inventory/ingredients/:id/adjust-stock
Adjust ingredient stock.

**Request Body:**
```json
{
  "adjustment": 2.5,
  "reason": "Received new shipment"
}
```

### Reports

#### GET /reports/sales
Get sales report.

**Query Parameters:**
- `startDate`: Start date (required)
- `endDate`: End date (required)
- `groupBy`: Grouping (day, week, month)

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalSales": 1250.75,
      "totalOrders": 45,
      "averageOrderValue": 27.79,
      "dateRange": {
        "start": "2023-12-01T00:00:00Z",
        "end": "2023-12-07T23:59:59Z"
      }
    },
    "salesByDate": {
      "2023-12-01": {
        "sales": 180.50,
        "orders": 6
      }
    },
    "topSellingItems": [
      {
        "name": "Margherita Pizza",
        "quantity": 25,
        "revenue": 324.75
      }
    ],
    "paymentMethods": {
      "CARD": {
        "count": 30,
        "amount": 833.75
      },
      "CASH": {
        "count": 15,
        "amount": 417.00
      }
    }
  }
}
```

#### GET /reports/dashboard
Get dashboard summary.

**Response:**
```json
{
  "success": true,
  "data": {
    "today": {
      "sales": 180.50,
      "orders": 6,
      "completedOrders": 4,
      "pendingOrders": 2
    },
    "activeTables": 3,
    "lowStockItems": 2,
    "recentOrders": [
      {
        "id": "order_id",
        "orderNumber": "ORD20231201001",
        "status": "COMPLETED",
        "createdAt": "2023-12-01T10:30:00Z",
        "table": {
          "number": 5
        },
        "user": {
          "firstName": "John",
          "lastName": "Doe"
        }
      }
    ]
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## WebSocket Events

### Real-time Updates

Connect to WebSocket at: `ws://localhost:5000`

#### Join Rooms
```javascript
// Join kitchen room
socket.emit('join-kitchen');

// Join waiter room
socket.emit('join-waiter');
```

#### Events

**New Order Received (Kitchen)**
```javascript
socket.on('new-order-received', (data) => {
  console.log('New order:', data);
  // data: { orderId, orderNumber, items, specialNotes, createdAt }
});
```

**Order Updated**
```javascript
socket.on('order-updated', (data) => {
  console.log('Order updated:', data);
  // data: { orderId, status, updatedAt }
});
```

**Update Order Status**
```javascript
socket.emit('order-status-update', {
  orderId: 'order_id',
  status: 'READY'
});
```

## Rate Limiting

API endpoints are rate-limited to 100 requests per 15 minutes per IP address.

## Security

- All sensitive endpoints require authentication
- JWT tokens expire after 7 days
- Passwords are hashed using bcrypt
- Input validation on all endpoints
- CORS configured for frontend domain 

**This means your backend server is NOT running or not reachable at `localhost:5000`.**

---

## How to Fix

### 1. **Start Your Backend Server**

Open a new terminal and run:

```sh
cd backend
npm run dev
```
or, if you use a different command (like `npm start` or `node src/index.js`), use that.

---

### 2. **Verify the Backend is Running**

- You should see output like:  
  `Server listening on port 5000`
- Open your browser and go to:  
  [http://localhost:5000/api/health](http://localhost:5000/api/health)  
  (or any health endpoint you have)
- You should get a response (not an error).

---

### 3. **Try Logging In Again**

- Go back to your frontend.
- Try to log in.
- It should now work.

---

## Why This Happens

- If the backend is not running, all API requests will fail with `ERR_CONNECTION_REFUSED`.
- The frontend cannot authenticate, so it always redirects you to the login page.

---

## Summary

**Start your backend server on port 5000, then try logging in again.**  
If you still have issues after starting the backend, let me know the new error messages or behavior! 

## 🔍 **Check Your Backend Status**

### 1. **Is Your Backend Running?**

Open a new terminal and check if your backend is actually running:

```bash
# Go to backend directory
cd backend

# Check if the server is running
npm run dev
```

You should see output like:
```
Server listening on port 5000
Database connected successfully
```

### 2. **Check if Port 5000 is Available**

In your terminal, run:
```bash
# On Windows
netstat -an | findstr :5000

# On Mac/Linux
lsof -i :5000
```

If nothing shows up, the backend is not running.

### 3. **Test Backend Directly**

Open your browser and go to:
- `http://localhost:5000/api/health`
- `http://localhost:5000/api/auth/login`

If you get "Connection refused" or "This site can't be reached", your backend is not running.

## 🚨 **Your Backend is NOT Running**

The `SYN_SENT` status means:
- Your frontend is trying to connect to `localhost:5000`
- But nothing is listening on port 5000
- So the connection attempts are failing

## 🚀 **Start Your Backend Now**

Open a **new terminal** and run:

```bash
cd backend
npm run dev
```

You should see output like:
```
[nodemon] 3.1.10
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: ts,json
[nodemon] starting `ts-node src/index.ts`
Server listening on port 5000
Database connected successfully
```

## ✅ **Once Backend is Running**

1. **Test the backend**: Go to `http://localhost:5000/api/health` in your browser
2. **Try logging in**: Go to `http://localhost:3000` and try to log in
3. **Check for errors**: Look for any new error messages

##  **If Backend Won't Start**

If you get errors when running `npm run dev`, share those error messages and I'll help you fix them.

**The key issue is that your backend server needs to be running for the frontend to work!**

Let me know what happens when you start the backend! 