import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  register: (userData: {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }) => api.post('/auth/register', userData),
  
  logout: () => api.post('/auth/logout'),
  
  refreshToken: () => api.post('/auth/refresh'),
  
  getProfile: () => api.get('/auth/profile'),
};

// Menu API
export const menuAPI = {
  getCategories: () => api.get('/menu/categories'),
  
  getMenuItems: (categoryId?: string) =>
    api.get('/menu/items', { params: { categoryId } }),
  
  createMenuItem: (itemData: {
    name: string;
    description?: string;
    price: number;
    categoryId: string;
    isVegetarian?: boolean;
    isSpicy?: boolean;
    preparationTime?: number;
  }) => api.post('/menu/items', itemData),
  
  updateMenuItem: (id: string, itemData: any) =>
    api.put(`/menu/items/${id}`, itemData),
  
  deleteMenuItem: (id: string) => api.delete(`/menu/items/${id}`),
  
  createCategory: (categoryData: {
    name: string;
    description?: string;
    sortOrder?: number;
  }) => api.post('/menu/categories', categoryData),
  
  updateCategory: (id: string, categoryData: any) =>
    api.put(`/menu/categories/${id}`, categoryData),
  
  deleteCategory: (id: string) => api.delete(`/menu/categories/${id}`),
};

// Orders API
export const ordersAPI = {
  getOrders: (params?: {
    status?: string;
    tableId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => api.get('/orders', { params }),
  
  getOrder: (id: string) => api.get(`/orders/${id}`),
  
  createOrder: (orderData: {
    tableId?: string;
    customerName?: string;
    customerPhone?: string;
    orderType: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
    items: Array<{
      menuItemId: string;
      quantity: number;
      unitPrice: number;
      notes?: string;
    }>;
    specialNotes?: string;
  }) => api.post('/orders', orderData),
  
  updateOrderStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),
  
  updateOrder: (id: string, orderData: any) =>
    api.put(`/orders/${id}`, orderData),
  
  deleteOrder: (id: string) => api.delete(`/orders/${id}`),
};

// Payments API
export const paymentsAPI = {
  getPayments: (params?: {
    orderId?: string;
    status?: string;
    method?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => api.get('/payments', { params }),
  
  createPayment: (paymentData: {
    orderId: string;
    amount: number;
    method: 'CASH' | 'CARD' | 'KHALTI' | 'ESEWA' | 'MOBILE_WALLET';
    transactionId?: string;
    gateway?: 'STRIPE' | 'RAZORPAY' | 'CASH';
  }) => api.post('/payments', paymentData),
  
  updatePaymentStatus: (id: string, status: string) =>
    api.patch(`/payments/${id}/status`, { status }),
  
  getPayment: (id: string) => api.get(`/payments/${id}`),
};

// Tables API
export const tablesAPI = {
  getTables: () => api.get('/tables'),
  
  getTable: (id: string) => api.get(`/tables/${id}`),
  
  createTable: (tableData: {
    number: number;
    capacity: number;
    status?: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING';
  }) => api.post('/tables', tableData),
  
  updateTable: (id: string, tableData: any) =>
    api.put(`/tables/${id}`, tableData),
  
  deleteTable: (id: string) => api.delete(`/tables/${id}`),
  
  updateTableStatus: (id: string, status: string) =>
    api.patch(`/tables/${id}/status`, { status }),
};

// Users API
export const usersAPI = {
  getUsers: (params?: {
    role?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) => api.get('/users', { params }),
  
  getUser: (id: string) => api.get(`/users/${id}`),
  
  createUser: (userData: {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }) => api.post('/users', userData),
  
  updateUser: (id: string, userData: any) =>
    api.put(`/users/${id}`, userData),
  
  deleteUser: (id: string) => api.delete(`/users/${id}`),
  
  updateUserStatus: (id: string, isActive: boolean) =>
    api.patch(`/users/${id}/status`, { isActive }),
};

// Inventory API
export const inventoryAPI = {
  getIngredients: (params?: {
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) => api.get('/inventory/ingredients', { params }),
  
  getIngredient: (id: string) => api.get(`/inventory/ingredients/${id}`),
  
  createIngredient: (ingredientData: {
    name: string;
    description?: string;
    unit: string;
    currentStock: number;
    minStock: number;
    costPerUnit: number;
    supplier?: string;
  }) => api.post('/inventory/ingredients', ingredientData),
  
  updateIngredient: (id: string, ingredientData: any) =>
    api.put(`/inventory/ingredients/${id}`, ingredientData),
  
  deleteIngredient: (id: string) => api.delete(`/inventory/ingredients/${id}`),
  
  updateStock: (id: string, quantity: number) =>
    api.patch(`/inventory/ingredients/${id}/stock`, { quantity }),
};

// Reports API
export const reportsAPI = {
  getSalesReport: (params: {
    startDate: string;
    endDate: string;
    groupBy?: 'day' | 'week' | 'month';
  }) => api.get('/reports/sales', { params }),
  
  getOrderReport: (params: {
    startDate: string;
    endDate: string;
    status?: string;
  }) => api.get('/reports/orders', { params }),
  
  getInventoryReport: () => api.get('/reports/inventory'),
  
  getTableReport: (params: {
    startDate: string;
    endDate: string;
  }) => api.get('/reports/tables', { params }),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/reports/dashboard'),
  
  getRecentOrders: (limit?: number) =>
    api.get('/reports/recent-orders', { params: { limit } }),
  
  getTopItems: (limit?: number) =>
    api.get('/reports/top-items', { params: { limit } }),
};

export default api; 