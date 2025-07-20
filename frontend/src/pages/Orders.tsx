import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Divider,
  LinearProgress,
  Alert,
  Badge,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Tabs,
  Tab,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  Timer as TimerIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as CartIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  TableRestaurant as TableIcon,
  Menu as MenuIcon,
  Category as CategoryIcon,
  LocalOffer as OfferIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { notificationService } from '../services/notifications';

interface Order {
  id: string;
  tableNumber: number;
  customerName?: string;
  items: OrderItem[];
  totalAmount: number;
  tax: number;
  tip: number;
  finalAmount: number;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'SERVED' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'UNPAID' | 'PAID' | 'PARTIAL';
  paymentMethod?: string;
  orderTime: string;
  estimatedReadyTime: string;
  waiter: string;
  notes?: string;
  specialRequests?: string;
}

interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
  isReady: boolean;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  isPopular: boolean;
}

interface TableData {
  id: string;
  number: number;
  capacity: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
  currentOrder?: Order;
}

const Orders: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Mock data
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      tableNumber: 5,
      customerName: 'John Smith',
      items: [
        {
          id: '1',
          menuItemId: '1',
          name: 'Grilled Salmon',
          price: 2850,
          quantity: 2,
          specialInstructions: 'Medium rare, no butter',
          isReady: false,
        },
        {
          id: '2',
          menuItemId: '2',
          name: 'Caesar Salad',
          price: 1200,
          quantity: 1,
          specialInstructions: '',
          isReady: true,
        },
      ],
      totalAmount: 6900,
      tax: 552,
      tip: 1035,
      finalAmount: 8487,
      status: 'PREPARING',
      paymentStatus: 'UNPAID',
      orderTime: '14:30',
      estimatedReadyTime: '15:00',
      waiter: 'Sarah Johnson',
      notes: 'Customer allergic to nuts',
    },
    {
      id: '2',
      tableNumber: 12,
      customerName: 'Mike Chen',
      items: [
        {
          id: '3',
          menuItemId: '3',
          name: 'Beef Burger',
          price: 1875,
          quantity: 3,
          specialInstructions: 'Well done, extra cheese',
          isReady: false,
        },
        {
          id: '4',
          menuItemId: '4',
          name: 'French Fries',
          price: 850,
          quantity: 3,
          specialInstructions: '',
          isReady: false,
        },
      ],
      totalAmount: 8175,
      tax: 654,
      tip: 1226,
      finalAmount: 10055,
      status: 'PENDING',
      paymentStatus: 'UNPAID',
      orderTime: '14:35',
      estimatedReadyTime: '15:05',
      waiter: 'Mike Chen',
      notes: 'Rush order - customer in hurry',
    },
  ]);

  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Grilled Salmon',
      description: 'Fresh Atlantic salmon grilled to perfection',
      price: 2850,
      category: 'MAIN_COURSE',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop',
      isAvailable: true,
      isPopular: true,
    },
    {
      id: '2',
      name: 'Caesar Salad',
      description: 'Crisp romaine lettuce with Caesar dressing',
      price: 1200,
      category: 'SALAD',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop',
      isAvailable: true,
      isPopular: false,
    },
    {
      id: '3',
      name: 'Beef Burger',
      description: 'Juicy beef patty with fresh vegetables',
      price: 1875,
      category: 'MAIN_COURSE',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
      isAvailable: true,
      isPopular: true,
    },
    {
      id: '4',
      name: 'French Fries',
      description: 'Crispy golden fries with sea salt',
      price: 850,
      category: 'SIDE',
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop',
      isAvailable: true,
      isPopular: false,
    },
  ];

  const tables: TableData[] = [
    {
      id: '1',
      number: 1,
      capacity: 4,
      status: 'OCCUPIED',
      currentOrder: orders[0],
    },
    {
      id: '2',
      number: 2,
      capacity: 6,
      status: 'AVAILABLE',
    },
    {
      id: '3',
      number: 3,
      capacity: 2,
      status: 'RESERVED',
    },
    {
      id: '4',
      number: 4,
      capacity: 8,
      status: 'AVAILABLE',
    },
  ];

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'PENDING').length,
    preparingOrders: orders.filter(o => o.status === 'PREPARING').length,
    readyOrders: orders.filter(o => o.status === 'READY').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.finalAmount, 0),
    averageOrderValue: Math.round(orders.reduce((sum, o) => sum + o.finalAmount, 0) / orders.length),
  };

  const handleAddOrder = () => {
    setSelectedOrder(null);
    setIsEditMode(false);
    setOpenOrderDialog(true);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsEditMode(true);
    setOpenOrderDialog(true);
  };

  const handleDeleteOrder = (orderId: string) => {
    console.log('Delete order:', orderId);
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    // Update order status
    const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);

    // Send notification to kitchen based on status
    if (newStatus === 'PREPARING') {
      notificationService.showNotification(
        'Order sent to kitchen',
        'info',
        'Order is now being prepared by kitchen staff'
      );
    } else if (newStatus === 'READY') {
      notificationService.showNotification(
        'Order ready for serving',
        'success',
        'Order is ready to be served to customer'
      );
    } else if (newStatus === 'SERVED') {
      notificationService.showNotification(
        'Order served',
        'success',
        'Order has been served to customer'
      );
    }
  };

  const handlePayment = (order: Order) => {
    setSelectedOrder(order);
    setOpenPaymentDialog(true);
  };

  const handleCreateOrder = (tableNumber: number, items: string[]) => {
    // Create new order
    const newOrder: Order = {
      id: Date.now().toString(),
      tableNumber,
      items: items.map((item, index) => ({
        id: (index + 1).toString(),
        menuItemId: item,
        name: `Item ${index + 1}`,
        price: 1000,
        quantity: 1,
        isReady: false,
      })),
      totalAmount: items.length * 1000,
      tax: items.length * 80,
      tip: items.length * 150,
      finalAmount: items.length * 1230,
      status: 'PENDING',
      paymentStatus: 'UNPAID',
      orderTime: new Date().toLocaleTimeString(),
      estimatedReadyTime: new Date(Date.now() + 30 * 60000).toLocaleTimeString(),
      waiter: user?.firstName + ' ' + user?.lastName || 'Unknown',
    };

    setOrders([...orders, newOrder]);

    // Send notification to kitchen
    notificationService.showNotification(
      'New order received',
      'info',
      `Order #${newOrder.id} for Table ${tableNumber} has been sent to kitchen`
    );

    // In real app, this would send a socket notification to kitchen
    console.log(`New order sent to kitchen: ${newOrder.id}`);
  };

  const handlePaymentComplete = (orderId: string, tableNumber: number, amount: number) => {
    notificationService.notifyPaymentCompleted(orderId, tableNumber, amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'PREPARING': return 'info';
      case 'READY': return 'success';
      case 'SERVED': return 'primary';
      case 'COMPLETED': return 'default';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'UNPAID': return 'error';
      case 'PAID': return 'success';
      case 'PARTIAL': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <AssignmentIcon />;
      case 'PREPARING': return <RestaurantIcon />;
      case 'READY': return <CheckCircleIcon />;
      case 'SERVED': return <PeopleIcon />;
      case 'COMPLETED': return <CheckCircleIcon />;
      case 'CANCELLED': return <CancelIcon />;
      default: return <WarningIcon />;
    }
  };

  const formatNepaliCurrency = (amount: number) => {
    return `रू ${amount.toLocaleString()}`;
  };

  const filteredMenuItems = selectedCategory === 'ALL' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  // Role-based access control
  const canCreateOrder = user?.role === 'ADMIN' ||  user?.role === 'MANAGER';
  const canViewAllOrders = user?.role === 'ADMIN';
  const canProcessPayment = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
          <ReceiptIcon />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Order Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and manage customer orders
          </Typography>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalOrders}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Orders
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <ReceiptIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {formatNepaliCurrency(stats.totalRevenue)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Revenue
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <MoneyIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {formatNepaliCurrency(stats.averageOrderValue)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Avg Order Value
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <TrendingUpIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.pendingOrders + stats.preparingOrders}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active Orders
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <RestaurantIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Order Creation and Management */}
      {canCreateOrder && (
        <Grid container spacing={3}>
          {/* Menu Selection */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" fontWeight="bold">
                    Menu Selection
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Category Filter</InputLabel>
                    <Select
                      value={selectedCategory}
                      label="Category Filter"
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <MenuItem value="ALL">All Categories</MenuItem>
                      <MenuItem value="APPETIZER">Appetizers</MenuItem>
                      <MenuItem value="MAIN_COURSE">Main Courses</MenuItem>
                      <MenuItem value="SALAD">Salads</MenuItem>
                      <MenuItem value="SIDE">Sides</MenuItem>
                      <MenuItem value="DESSERT">Desserts</MenuItem>
                      <MenuItem value="BEVERAGE">Beverages</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <ImageList cols={3} gap={16}>
                  {filteredMenuItems.map((item) => (
                    <ImageListItem key={item.id} sx={{ borderRadius: 2, overflow: 'hidden', cursor: 'pointer' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        style={{ height: 150, objectFit: 'cover' }}
                      />
                      <ImageListItemBar
                        title={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" fontWeight="medium">
                              {item.name}
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" color="success.main">
                              {formatNepaliCurrency(item.price)}
                            </Typography>
                          </Box>
                        }
                        subtitle={
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {item.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Chip 
                                label={item.category.replace('_', ' ')} 
                                size="small"
                              />
                              {item.isPopular && (
                                <Chip 
                                  label="Popular" 
                                  color="warning"
                                  size="small"
                                  icon={<StarIcon />}
                                />
                              )}
                            </Box>
                          </Box>
                        }
                        actionIcon={
                          <Tooltip title="Add to Order">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => console.log('Add item to order:', item.id)}
                            >
                              <AddIcon />
                            </IconButton>
                          </Tooltip>
                        }
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </CardContent>
            </Card>
          </Grid>

          {/* Table Selection and Current Orders */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Table Status
                </Typography>
                <List>
                  {tables.map((table) => (
                    <ListItem key={table.id} sx={{ mb: 1, border: '1px solid', borderColor: 'grey.200', borderRadius: 1 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: table.status === 'AVAILABLE' ? 'success.main' : 'warning.main' }}>
                          <TableIcon />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" fontWeight="medium">
                              Table {table.number}
                            </Typography>
                            <Chip 
                              label={table.status} 
                              color={table.status === 'AVAILABLE' ? 'success' : 'warning'}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Capacity: {table.capacity} people
                            </Typography>
                            {table.currentOrder && (
                              <Typography variant="body2" color="error.main">
                                Active Order: {formatNepaliCurrency(table.currentOrder.finalAmount)}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <ListItemIcon>
                        {table.status === 'AVAILABLE' ? (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => setSelectedTable(table)}
                          >
                            Select
                          </Button>
                        ) : (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => console.log('View table details:', table.id)}
                          >
                            View
                          </Button>
                        )}
                      </ListItemIcon>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Current Orders */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              Current Orders
            </Typography>
            {canCreateOrder && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddOrder}
                sx={{ borderRadius: 2 }}
              >
                New Order
              </Button>
            )}
          </Box>

          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  <TableCell>Order Details</TableCell>
                  <TableCell>Table</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          Order #{order.id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.items.length} items • {order.customerName || 'Walk-in'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Waiter: {order.waiter}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="bold">
                        Table {order.tableNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={order.status} 
                        color={getStatusColor(order.status) as any}
                        size="small"
                        icon={getStatusIcon(order.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={order.paymentStatus} 
                        color={getPaymentStatusColor(order.paymentStatus) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="bold" color="success.main">
                        {formatNepaliCurrency(order.finalAmount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {order.orderTime}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ready: {order.estimatedReadyTime}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Order">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleEditOrder(order)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        {canProcessPayment && order.paymentStatus === 'UNPAID' && (
                          <Tooltip title="Process Payment">
                            <IconButton 
                              size="small" 
                              color="success"
                              onClick={() => handlePayment(order)}
                            >
                              <PaymentIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {canCreateOrder && (
                          <Tooltip title="Update Status">
                            <IconButton 
                              size="small" 
                              color="warning"
                              onClick={() => console.log('Update status:', order.id)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {canCreateOrder && (
                          <Tooltip title="Cancel Order">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteOrder(order.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Order Dialog */}
      <Dialog open={openOrderDialog} onClose={() => setOpenOrderDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditMode ? 'Edit Order' : 'Create New Order'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              <Step>
                <StepLabel>Select Table</StepLabel>
                <StepContent>
                  <Grid container spacing={2}>
                    {tables.filter(t => t.status === 'AVAILABLE').map((table) => (
                      <Grid item xs={6} key={table.id}>
                        <Card 
                          sx={{ 
                            cursor: 'pointer',
                            border: selectedTable?.id === table.id ? '2px solid #1976d2' : '1px solid #e0e0e0'
                          }}
                          onClick={() => setSelectedTable(table)}
                        >
                          <CardContent>
                            <Typography variant="h6" fontWeight="bold">
                              Table {table.number}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Capacity: {table.capacity} people
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  <Button
                    variant="contained"
                    onClick={() => setActiveStep(1)}
                    disabled={!selectedTable}
                    sx={{ mt: 2 }}
                  >
                    Continue
                  </Button>
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Add Menu Items</StepLabel>
                <StepContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Selected Table: {selectedTable?.number}
                  </Typography>
                  <Grid container spacing={2}>
                    {menuItems.map((item) => (
                      <Grid item xs={6} key={item.id}>
                        <Card sx={{ cursor: 'pointer' }}>
                          <CardContent>
                            <Typography variant="body1" fontWeight="medium">
                              {item.name}
                            </Typography>
                            <Typography variant="body2" color="success.main" fontWeight="bold">
                              {formatNepaliCurrency(item.price)}
                            </Typography>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => console.log('Add item:', item.id)}
                            >
                              Add to Order
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  <Button
                    variant="contained"
                    onClick={() => setActiveStep(2)}
                    sx={{ mt: 2 }}
                  >
                    Continue
                  </Button>
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Order Summary</StepLabel>
                <StepContent>
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Table: {selectedTable?.number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Items: 0 selected
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total: {formatNepaliCurrency(0)}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setOpenOrderDialog(false);
                      setActiveStep(0);
                    }}
                  >
                    Create Order
                  </Button>
                </StepContent>
              </Step>
            </Stepper>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Process Payment - Order #{selectedOrder?.id}</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Subtotal:</Typography>
                    <Typography>{formatNepaliCurrency(selectedOrder.totalAmount)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Tax:</Typography>
                    <Typography>{formatNepaliCurrency(selectedOrder.tax)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Tip:</Typography>
                    <Typography>{formatNepaliCurrency(selectedOrder.tip)}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">Total:</Typography>
                    <Typography variant="h6" fontWeight="bold" color="success.main">
                      {formatNepaliCurrency(selectedOrder.finalAmount)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Method</InputLabel>
                    <Select label="Payment Method">
                      <MenuItem value="cash">Cash</MenuItem>
                      <MenuItem value="credit">Credit Card</MenuItem>
                      <MenuItem value="debit">Debit Card</MenuItem>
                      <MenuItem value="mobile">Mobile Payment</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Amount Received"
                    type="number"
                    defaultValue={selectedOrder.finalAmount}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPaymentDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="success"
            onClick={() => {
              if (selectedOrder) {
                handlePaymentComplete(selectedOrder.id, selectedOrder.tableNumber, selectedOrder.finalAmount);
              }
              setOpenPaymentDialog(false);
            }}
          >
            Process Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Orders; 