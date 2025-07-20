import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
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
  Avatar,
  Fab,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItemIcon,
  ListItemAvatar,
  Collapse,
  CardActions,
  CardMedia,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  ListItemButton,
  Snackbar,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  PriorityHigh as PriorityHighIcon,
  Schedule as ScheduleIcon,
  LocalFireDepartment as FireIcon,
  Kitchen as KitchenIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  Star as StarIcon,
  LocalOffer as OfferIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  CancelOutlined as CancelOutlinedIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Done as DoneIcon,
  NotificationsActive as NotificationsActiveIcon,
  TableRestaurant as TableIcon,
  Receipt as ReceiptIcon,
  People as PeopleIcon,
  AccessTime as AccessTimeIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { ordersAPI } from '../services/api';
import { notificationService } from '../services/notifications';

interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  preparationTime: number;
  isReady: boolean;
}

interface Order {
  id: string;
  orderNumber: string;
  tableId?: string;
  tableNumber?: number;
  customerName?: string;
  customerPhone?: string;
  orderType: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  status: 'RECEIVED' | 'PREPARING' | 'READY' | 'SERVED' | 'COMPLETED' | 'CANCELLED';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  specialNotes?: string;
  createdAt: string;
  updatedAt: string;
  estimatedCompletionTime?: string;
  waiter: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
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
  stockLevel: number;
  minStockLevel: number;
  preparationTime: number;
  chef: string;
  lastUpdated: string;
  ingredients: string[];
  allergens: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const Kitchen: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({ open: false, message: '', severity: 'info' });

  // Mock data for orders
  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-001',
      tableId: '1',
      tableNumber: 5,
      customerName: 'John Smith',
      orderType: 'DINE_IN',
      status: 'RECEIVED',
      items: [
        {
          id: '1',
          menuItemId: '1',
          name: 'Grilled Salmon',
          quantity: 2,
          unitPrice: 2850,
          totalPrice: 5700,
          preparationTime: 20,
          isReady: false,
        },
        {
          id: '2',
          menuItemId: '2',
          name: 'Caesar Salad',
          quantity: 1,
          unitPrice: 1200,
          totalPrice: 1200,
          preparationTime: 8,
          isReady: false,
        },
      ],
      subtotal: 6900,
      tax: 690,
      discount: 0,
      total: 7590,
      specialNotes: 'Salmon medium rare, extra dressing on salad',
      createdAt: '2024-01-15 14:30:00',
      updatedAt: '2024-01-15 14:30:00',
      waiter: 'Sarah Johnson',
      priority: 'HIGH',
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      tableId: '2',
      tableNumber: 3,
      customerName: 'Mike Chen',
      orderType: 'DINE_IN',
      status: 'PREPARING',
      items: [
        {
          id: '3',
          menuItemId: '3',
          name: 'Beef Burger',
          quantity: 3,
          unitPrice: 1875,
          totalPrice: 5625,
          preparationTime: 15,
          isReady: true,
        },
        {
          id: '4',
          menuItemId: '4',
          name: 'French Fries',
          quantity: 3,
          unitPrice: 850,
          totalPrice: 2550,
          preparationTime: 10,
          isReady: false,
        },
      ],
      subtotal: 8175,
      tax: 817.5,
      discount: 0,
      total: 8992.5,
      createdAt: '2024-01-15 14:25:00',
      updatedAt: '2024-01-15 14:35:00',
      waiter: 'Mike Chen',
      priority: 'MEDIUM',
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      tableId: '3',
      tableNumber: 8,
      customerName: 'Lisa Wang',
      orderType: 'DINE_IN',
      status: 'READY',
      items: [
        {
          id: '5',
          menuItemId: '5',
          name: 'Chicken Curry',
          quantity: 2,
          unitPrice: 2200,
          totalPrice: 4400,
          preparationTime: 25,
          isReady: true,
        },
      ],
      subtotal: 4400,
      tax: 440,
      discount: 0,
      total: 4840,
      createdAt: '2024-01-15 14:20:00',
      updatedAt: '2024-01-15 14:45:00',
      waiter: 'David Kim',
      priority: 'LOW',
    },
  ];

  // Mock menu items
  const mockMenuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Grilled Salmon',
      description: 'Fresh Atlantic salmon grilled to perfection',
      price: 2850,
      category: 'MAIN_COURSE',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop',
      isAvailable: true,
      isPopular: true,
      stockLevel: 15,
      minStockLevel: 5,
      preparationTime: 20,
      chef: 'Chef Carlos',
      lastUpdated: '2024-01-15 14:30',
      ingredients: ['Salmon', 'Lemon', 'Herbs', 'Olive Oil'],
      allergens: ['Fish'],
      nutritionalInfo: { calories: 350, protein: 45, carbs: 2, fat: 18 },
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
      stockLevel: 8,
      minStockLevel: 3,
      preparationTime: 8,
      chef: 'Chef Sarah',
      lastUpdated: '2024-01-15 14:25',
      ingredients: ['Romaine Lettuce', 'Parmesan Cheese', 'Croutons'],
      allergens: ['Dairy', 'Gluten'],
      nutritionalInfo: { calories: 180, protein: 8, carbs: 12, fat: 14 },
    },
  ];

  useEffect(() => {
    setOrders(mockOrders);
    setMenuItems(mockMenuItems);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleOrderStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      setLoading(true);
      // Update order status via API
      await ordersAPI.updateOrderStatus(orderId, newStatus);
      
      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
            : order
        )
      );

      setNotification({
        open: true,
        message: `Order ${orderId} status updated to ${newStatus}`,
        severity: 'success',
      });

      // Send notification to workers via socket
      notificationService.updateOrderStatus(orderId, newStatus);

      // If order is ready, notify workers specifically
      if (newStatus === 'READY') {
        notificationService.showNotification(
          'Order Ready',
          'success',
          `Order ${orderId} is ready for serving`
        );
      }
    } catch (error) {
      setNotification({
        open: true,
        message: 'Failed to update order status',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleItemReady = (orderId: string, itemId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map(item =>
                item.id === itemId ? { ...item, isReady: true } : item
              ),
            }
          : order
      )
    );
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setOpenOrderDialog(true);
  };

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(order => order.status === status);
  };

  const getPriorityColor = (priority: Order['priority']) => {
    switch (priority) {
      case 'URGENT': return 'error';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'info';
      case 'LOW': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'RECEIVED': return 'info';
      case 'PREPARING': return 'warning';
      case 'READY': return 'success';
      case 'SERVED': return 'primary';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  const formatNepaliCurrency = (amount: number) => {
    return `रू ${amount.toLocaleString()}`;
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (timeString: string) => {
    const now = new Date();
    const time = new Date(timeString);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ${diffInMinutes % 60}m ago`;
  };

  const tabs = [
    { label: 'Received', status: 'RECEIVED', icon: <NotificationsActiveIcon /> },
    { label: 'Preparing', status: 'PREPARING', icon: <KitchenIcon /> },
    { label: 'Ready', status: 'READY', icon: <CheckCircleIcon /> },
    { label: 'Menu', status: 'MENU', icon: <RestaurantIcon /> },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
          <KitchenIcon />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Kitchen Panel
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Order management and menu updates
          </Typography>
        </Box>
        <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
          <Badge badgeContent={getOrdersByStatus('RECEIVED').length} color="error">
            <IconButton color="primary">
              <NotificationsActiveIcon />
            </IconButton>
          </Badge>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {getOrdersByStatus('RECEIVED').length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    New Orders
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <NotificationsActiveIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {getOrdersByStatus('PREPARING').length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    In Progress
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <KitchenIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {getOrdersByStatus('READY').length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Ready to Serve
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <CheckCircleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {menuItems.filter(item => item.isAvailable).length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Available Items
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

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          {tabs.map((tab, index) => (
            <Tab
              key={tab.status}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {tab.icon}
                  <Typography variant="body2">
                    {tab.label} ({getOrdersByStatus(tab.status as Order['status']).length})
                  </Typography>
                </Box>
              }
            />
          ))}
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ mt: 3 }}>
        {selectedTab < 3 ? (
          // Order Management Tabs
          <Grid container spacing={3}>
            {getOrdersByStatus(tabs[selectedTab].status as Order['status']).map((order) => (
              <Grid item xs={12} md={6} lg={4} key={order.id}>
                <Card sx={{ 
                  height: '100%',
                  border: `2px solid ${
                    order.priority === 'URGENT' ? '#f44336' :
                    order.priority === 'HIGH' ? '#ff9800' :
                    order.priority === 'MEDIUM' ? '#2196f3' : '#4caf50'
                  }`,
                  position: 'relative'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {order.orderNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Table {order.tableNumber} • {order.customerName}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                        <Chip
                          label={order.priority}
                          color={getPriorityColor(order.priority) as any}
                          size="small"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {getTimeAgo(order.createdAt)}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <List dense>
                      {order.items.map((item) => (
                        <ListItem key={item.id} sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              {item.isReady ? <CheckCircleIcon /> : <TimerIcon />}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" fontWeight="medium">
                                  {item.name} x{item.quantity}
                                </Typography>
                                <Chip
                                  label={item.isReady ? 'Ready' : `${item.preparationTime}m`}
                                  color={item.isReady ? 'success' : 'warning'}
                                  size="small"
                                />
                              </Box>
                            }
                            secondary={
                              <Typography variant="caption" color="text.secondary">
                                {item.notes && `Notes: ${item.notes}`}
                              </Typography>
                            }
                          />
                          {!item.isReady && order.status === 'PREPARING' && (
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleItemReady(order.id, item.id)}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          )}
                        </ListItem>
                      ))}
                    </List>

                    {order.specialNotes && (
                      <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
                        <Typography variant="body2">
                          <strong>Special Notes:</strong> {order.specialNotes}
                        </Typography>
                      </Alert>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {formatNepaliCurrency(order.total)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Waiter: {order.waiter}
                      </Typography>
                    </Box>

                    <CardActions sx={{ px: 0, pt: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewOrder(order)}
                        startIcon={<ViewIcon />}
                      >
                        View Details
                      </Button>
                      
                      {order.status === 'RECEIVED' && (
                        <Button
                          size="small"
                          variant="contained"
                          color="warning"
                          onClick={() => handleOrderStatusUpdate(order.id, 'PREPARING')}
                          startIcon={<PlayArrowIcon />}
                        >
                          Start Preparing
                        </Button>
                      )}
                      
                      {order.status === 'PREPARING' && order.items.every(item => item.isReady) && (
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => handleOrderStatusUpdate(order.id, 'READY')}
                          startIcon={<DoneIcon />}
                        >
                          Mark Ready
                        </Button>
                      )}
                    </CardActions>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          // Menu Management Tab
          <Grid container spacing={3}>
            {menuItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card sx={{ height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.image}
                    alt={item.name}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {item.name}
                      </Typography>
                      <Chip
                        label={item.isAvailable ? 'Available' : 'Unavailable'}
                        color={item.isAvailable ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {item.description}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {formatNepaliCurrency(item.price)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.preparationTime}m prep
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Stock: {item.stockLevel}
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={item.isAvailable}
                            onChange={() => {
                              // Handle availability toggle
                            }}
                            color="primary"
                          />
                        }
                        label="Available"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Order Details Dialog */}
      <Dialog open={openOrderDialog} onClose={() => setOpenOrderDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ReceiptIcon color="primary" />
            <Typography variant="h6">
              Order Details - {selectedOrder?.orderNumber}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Order Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Order Number"
                        secondary={selectedOrder.orderNumber}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Table"
                        secondary={`Table ${selectedOrder.tableNumber}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Customer"
                        secondary={selectedOrder.customerName}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Waiter"
                        secondary={selectedOrder.waiter}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Created"
                        secondary={formatTime(selectedOrder.createdAt)}
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Order Items
                  </Typography>
                  <List dense>
                    {selectedOrder.items.map((item) => (
                      <ListItem key={item.id}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body1" fontWeight="medium">
                                {item.name}
                              </Typography>
                              <Typography variant="body1" fontWeight="bold">
                                {formatNepaliCurrency(item.totalPrice)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Quantity: {item.quantity} • {item.preparationTime}m prep time
                              </Typography>
                              {item.notes && (
                                <Typography variant="body2" color="text.secondary">
                                  Notes: {item.notes}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <Chip
                          label={item.isReady ? 'Ready' : 'Preparing'}
                          color={item.isReady ? 'success' : 'warning'}
                          size="small"
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>

              {selectedOrder.specialNotes && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Special Notes:</strong> {selectedOrder.specialNotes}
                  </Typography>
                </Alert>
              )}

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  Total: {formatNepaliCurrency(selectedOrder.total)}
                </Typography>
                <Chip
                  label={selectedOrder.status}
                  color={getStatusColor(selectedOrder.status) as any}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenOrderDialog(false)}>Close</Button>
          {selectedOrder && selectedOrder.status === 'RECEIVED' && (
            <Button
              variant="contained"
              color="warning"
              onClick={() => {
                handleOrderStatusUpdate(selectedOrder.id, 'PREPARING');
                setOpenOrderDialog(false);
              }}
              startIcon={<PlayArrowIcon />}
            >
              Start Preparing
            </Button>
          )}
          {selectedOrder && selectedOrder.status === 'PREPARING' && selectedOrder.items.every(item => item.isReady) && (
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                handleOrderStatusUpdate(selectedOrder.id, 'READY');
                setOpenOrderDialog(false);
              }}
              startIcon={<DoneIcon />}
            >
              Mark Ready
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Kitchen; 