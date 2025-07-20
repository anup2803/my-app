import React, { useState } from 'react';
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
  Divider,
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
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Radio,
  RadioGroup,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Switch,
  FormGroup,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
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
  Receipt as ReceiptIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  PhoneAndroid as MobileIcon,
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { notificationService } from '../utils/notifications';

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

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  isAvailable: boolean;
}

const Payments: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [amountReceived, setAmountReceived] = useState<number>(0);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  // Mock data
  const orders: Order[] = [
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
      status: 'SERVED',
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
      status: 'SERVED',
      paymentStatus: 'UNPAID',
      orderTime: '14:35',
      estimatedReadyTime: '15:05',
      waiter: 'Mike Chen',
      notes: 'Rush order - customer in hurry',
    },
  ];

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
    {
      id: '5',
      name: 'Chicken Tikka',
      description: 'Spicy grilled chicken with Indian spices',
      price: 2200,
      category: 'MAIN_COURSE',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop',
      isAvailable: true,
      isPopular: true,
    },
    {
      id: '6',
      name: 'Chocolate Cake',
      description: 'Rich chocolate cake with cream frosting',
      price: 950,
      category: 'DESSERT',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop',
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

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'cash',
      name: 'Cash',
      icon: <MoneyIcon />,
      description: 'Pay with cash',
      isAvailable: true,
    },
    {
      id: 'credit',
      name: 'Credit Card',
      icon: <CreditCardIcon />,
      description: 'Pay with credit card',
      isAvailable: true,
    },
    {
      id: 'debit',
      name: 'Debit Card',
      icon: <CreditCardIcon />,
      description: 'Pay with debit card',
      isAvailable: true,
    },
    {
      id: 'mobile',
      name: 'Mobile Payment',
      icon: <MobileIcon />,
      description: 'Pay with mobile wallet',
      isAvailable: true,
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: <BankIcon />,
      description: 'Pay via bank transfer',
      isAvailable: false,
    },
  ];

  const stats = {
    totalPayments: orders.filter(o => o.paymentStatus === 'PAID').length,
    pendingPayments: orders.filter(o => o.paymentStatus === 'UNPAID').length,
    totalRevenue: orders.filter(o => o.paymentStatus === 'PAID').reduce((sum, o) => sum + o.finalAmount, 0),
    averagePayment: Math.round(orders.filter(o => o.paymentStatus === 'PAID').reduce((sum, o) => sum + o.finalAmount, 0) / Math.max(orders.filter(o => o.paymentStatus === 'PAID').length, 1)),
  };

  const handlePayment = (order: Order) => {
    setSelectedOrder(order);
    setAmountReceived(order.finalAmount);
    setOpenPaymentDialog(true);
  };

  const handleCreateOrder = () => {
    setSelectedOrder(null);
    setSelectedItems([]);
    setActiveStep(0);
    setOpenOrderDialog(true);
  };

  const handlePaymentComplete = (orderId: string, tableNumber: number, amount: number, method: string) => {
    notificationService.notifyPaymentCompleted(orderId, tableNumber, amount);
    setOpenPaymentDialog(false);
    setSelectedOrder(null);
    setSelectedPaymentMethod('');
    setAmountReceived(0);
  };

  const handleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const formatNepaliCurrency = (amount: number) => {
    return `रू ${amount.toLocaleString()}`;
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

  const filteredMenuItems = selectedCategory === 'ALL' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  // Role-based access control
  const canProcessPayment = user?.role === 'ADMIN' || user?.role === 'MANAGER';
  const canCreateOrder = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
          <PaymentIcon />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Payment Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Process payments and manage billing
          </Typography>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={user?.role === 'ADMIN' ? 3 : 4}>
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
                    {stats.totalPayments}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Completed Payments
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <CheckCircleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Revenue - Only show to ADMIN */}
        {user?.role === 'ADMIN' && (
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
        )}

        {/* Average Payment - Only show to ADMIN */}
        {user?.role === 'ADMIN' && (
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
                      {formatNepaliCurrency(stats.averagePayment)}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Avg Payment
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <TrendingUpIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={user?.role === 'ADMIN' ? 3 : 4}>
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
                    {stats.pendingPayments}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Pending Payments
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <WarningIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Additional card for workers to balance the layout */}
        {user?.role !== 'ADMIN' && (
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {orders.filter(o => o.status === 'SERVED').length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Orders to Serve
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <PeopleIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Tabs for different sections */}
      <Card sx={{ mb: 3 }}>
        <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)}>
          <Tab label="Pending Payments" />
          <Tab label="Create Order" />
          <Tab label="Payment History" />
        </Tabs>
      </Card>

      {/* Pending Payments Tab */}
      {selectedTab === 0 && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="bold">
                Pending Payments
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small">
                  <FilterIcon />
                </IconButton>
                <IconButton size="small">
                  <SortIcon />
                </IconButton>
              </Box>
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    <TableCell>Order Details</TableCell>
                    <TableCell>Table</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Payment Status</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.filter(o => o.paymentStatus === 'UNPAID').map((order) => (
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
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Order">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          {canProcessPayment && (
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
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Create Order Tab */}
      {selectedTab === 1 && canCreateOrder && (
        <Grid container spacing={3}>
          {/* Table Selection */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Select Table
                </Typography>
                <List>
                  {tables.filter(t => t.status === 'AVAILABLE').map((table) => (
                    <ListItem key={table.id} sx={{ mb: 1, border: '1px solid', borderColor: 'grey.200', borderRadius: 1 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'success.main' }}>
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
                              label="Available" 
                              color="success"
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            Capacity: {table.capacity} people
                          </Typography>
                        }
                      />
                      <ListItemIcon>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => setSelectedTable(table)}
                        >
                          Select
                        </Button>
                      </ListItemIcon>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Menu Selection */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Select Menu Items
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
                    <ImageListItem 
                      key={item.id} 
                      sx={{ 
                        borderRadius: 2, 
                        overflow: 'hidden', 
                        cursor: 'pointer',
                        border: selectedItems.includes(item.id) ? '3px solid #1976d2' : '1px solid #e0e0e0',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        }
                      }}
                      onClick={() => handleItemSelection(item.id)}
                    >
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
                          <Tooltip title={selectedItems.includes(item.id) ? "Remove from Order" : "Add to Order"}>
                            <IconButton 
                              size="small" 
                              color={selectedItems.includes(item.id) ? "error" : "primary"}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleItemSelection(item.id);
                              }}
                            >
                              {selectedItems.includes(item.id) ? <CancelIcon /> : <AddIcon />}
                            </IconButton>
                          </Tooltip>
                        }
                      />
                    </ImageListItem>
                  ))}
                </ImageList>

                {selectedItems.length > 0 && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Selected Items ({selectedItems.length})
                    </Typography>
                    <Grid container spacing={2}>
                      {selectedItems.map(itemId => {
                        const item = menuItems.find(i => i.id === itemId);
                        return item ? (
                          <Grid item xs={12} sm={6} key={itemId}>
                            <Card sx={{ p: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                                />
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography variant="body2" fontWeight="medium">
                                    {item.name}
                                  </Typography>
                                  <Typography variant="body2" color="success.main" fontWeight="bold">
                                    {formatNepaliCurrency(item.price)}
                                  </Typography>
                                </Box>
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleItemSelection(itemId)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </Card>
                          </Grid>
                        ) : null;
                      })}
                    </Grid>
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => setOpenOrderDialog(true)}
                        disabled={!selectedTable}
                      >
                        Create Order
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setSelectedItems([])}
                      >
                        Clear Selection
                      </Button>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Payment History Tab */}
      {selectedTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Payment History
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Payment history functionality will be implemented here.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Payment Dialog */}
      <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PaymentIcon color="primary" />
            <Typography variant="h6">
              Process Payment - Order #{selectedOrder?.id}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                {/* Order Summary */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>
                  <Card sx={{ p: 2, mb: 2 }}>
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
                  </Card>

                  <Typography variant="body2" color="text.secondary">
                    Table: {selectedOrder.tableNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Customer: {selectedOrder.customerName || 'Walk-in'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Waiter: {selectedOrder.waiter}
                  </Typography>
                </Grid>

                {/* Payment Method Selection */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Payment Method
                  </Typography>
                  <RadioGroup
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  >
                    {paymentMethods.map((method) => (
                      <FormControlLabel
                        key={method.id}
                        value={method.id}
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {method.icon}
                            <Box>
                              <Typography variant="body1" fontWeight="medium">
                                {method.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {method.description}
                              </Typography>
                            </Box>
                          </Box>
                        }
                        disabled={!method.isAvailable}
                        sx={{ 
                          mb: 1, 
                          p: 1, 
                          border: '1px solid', 
                          borderColor: 'grey.200', 
                          borderRadius: 1,
                          '&.Mui-checked': {
                            borderColor: 'primary.main',
                            bgcolor: 'primary.50',
                          }
                        }}
                      />
                    ))}
                  </RadioGroup>

                  <TextField
                    fullWidth
                    label="Amount Received"
                    type="number"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(Number(e.target.value))}
                    sx={{ mt: 2 }}
                  />

                  {amountReceived > selectedOrder.finalAmount && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Change: {formatNepaliCurrency(amountReceived - selectedOrder.finalAmount)}
                    </Alert>
                  )}
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
            disabled={!selectedPaymentMethod || amountReceived < (selectedOrder?.finalAmount || 0)}
            onClick={() => {
              if (selectedOrder && selectedPaymentMethod) {
                handlePaymentComplete(selectedOrder.id, selectedOrder.tableNumber, selectedOrder.finalAmount, selectedPaymentMethod);
              }
            }}
          >
            Process Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Order Dialog */}
      <Dialog open={openOrderDialog} onClose={() => setOpenOrderDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ReceiptIcon color="primary" />
            <Typography variant="h6">
              Create New Order
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body1" gutterBottom>
              Selected Table: {selectedTable?.number}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Selected Items: {selectedItems.length}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Total Amount: {formatNepaliCurrency(selectedItems.reduce((sum, itemId) => {
                const item = menuItems.find(i => i.id === itemId);
                return sum + (item?.price || 0);
              }, 0))}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenOrderDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              // Create order logic here
              setOpenOrderDialog(false);
              setSelectedItems([]);
              setSelectedTable(null);
            }}
          >
            Create Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payments; 