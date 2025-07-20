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
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  Receipt as ReceiptIcon,
  TableRestaurant as TableIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  AccountBalance as AccountBalanceIcon,
  Payment as PaymentIcon,
  ShoppingCart as CartIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface FinancialRecord {
  id: string;
  type: 'SALE' | 'EXPENSE' | 'REFUND' | 'PAYMENT';
  amount: number;
  description: string;
  date: string;
  category: string;
  paymentMethod: string;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
}

interface SalesData {
  totalSales: number;
  todaySales: number;
  monthlySales: number;
  averageOrderValue: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  tableOccupancy: number;
}

interface RecentTransaction {
  id: string;
  tableNumber: number;
  amount: number;
  items: number;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
  paymentMethod: string;
  time: string;
}

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<FinancialRecord | null>(null);
  const [timeFilter, setTimeFilter] = useState('today');

  // Mock real-time data
  const salesData: SalesData = {
    totalSales: 4562075, // Converted to Nepali Rupees (रू)
    todaySales: 284750,
    monthlySales: 1562025,
    averageOrderValue: 4580,
    totalOrders: 156,
    completedOrders: 142,
    pendingOrders: 14,
    tableOccupancy: 78,
  };

  const financialRecords: FinancialRecord[] = [
    {
      id: '1',
      type: 'SALE',
      amount: 12550,
      description: 'Table 5 - Grilled Salmon, Caesar Salad',
      date: '2024-01-15 14:30',
      category: 'Food Sales',
      paymentMethod: 'Credit Card',
      status: 'COMPLETED',
    },
    {
      id: '2',
      type: 'SALE',
      amount: 8975,
      description: 'Table 12 - Beef Burger, Fries',
      date: '2024-01-15 14:25',
      category: 'Food Sales',
      paymentMethod: 'Cash',
      status: 'COMPLETED',
    },
    {
      id: '3',
      type: 'EXPENSE',
      amount: -45000,
      description: 'Kitchen Supplies - Vegetables',
      date: '2024-01-15 10:00',
      category: 'Inventory',
      paymentMethod: 'Bank Transfer',
      status: 'COMPLETED',
    },
    {
      id: '4',
      type: 'SALE',
      amount: 15625,
      description: 'Table 8 - Pizza, Wings, Drinks',
      date: '2024-01-15 14:20',
      category: 'Food Sales',
      paymentMethod: 'Credit Card',
      status: 'PENDING',
    },
  ];

  const recentTransactions: RecentTransaction[] = [
    {
      id: '1',
      tableNumber: 5,
      amount: 12550,
      items: 3,
      status: 'COMPLETED',
      paymentMethod: 'Credit Card',
      time: '14:30',
    },
    {
      id: '2',
      tableNumber: 12,
      amount: 8975,
      items: 2,
      status: 'COMPLETED',
      paymentMethod: 'Cash',
      time: '14:25',
    },
    {
      id: '3',
      tableNumber: 8,
      amount: 15625,
      items: 4,
      status: 'PENDING',
      paymentMethod: 'Credit Card',
      time: '14:20',
    },
    {
      id: '4',
      tableNumber: 3,
      amount: 7890,
      items: 2,
      status: 'COMPLETED',
      paymentMethod: 'Cash',
      time: '14:15',
    },
  ];

  const formatNepaliCurrency = (amount: number) => {
    return `रू ${amount.toLocaleString()}`;
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'SALE': return 'success';
      case 'EXPENSE': return 'error';
      case 'REFUND': return 'warning';
      case 'PAYMENT': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'Credit Card': return <PaymentIcon />;
      case 'Cash': return <MoneyIcon />;
      case 'Bank Transfer': return <AccountBalanceIcon />;
      default: return <PaymentIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
          <DashboardIcon />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time overview of restaurant operations
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
                    {salesData.totalOrders}
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

        {/* Total Sales - Only show to ADMIN */}
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
                      {formatNepaliCurrency(salesData.totalSales)}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Sales
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

        {/* Today's Sales - Only show to ADMIN */}
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
                      {formatNepaliCurrency(salesData.todaySales)}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Today's Sales
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
                    {salesData.pendingOrders}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Pending Orders
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <RestaurantIcon />
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
                      {salesData.completedOrders}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Completed Orders
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <CheckCircleIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Financial Records - Only show to ADMIN */}
      {user?.role === 'ADMIN' && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" fontWeight="bold">
                    Financial Records
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small">
                      <RefreshIcon />
                    </IconButton>
                    <IconButton size="small">
                      <DownloadIcon />
                    </IconButton>
                  </Box>
                </Box>

                <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'grey.50' }}>
                        <TableCell>Type</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Payment Method</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {financialRecords.map((record) => (
                        <TableRow key={record.id} hover>
                          <TableCell>
                            <Chip 
                              label={record.type} 
                              color={getTransactionTypeColor(record.type) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {record.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {record.date}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography 
                              variant="body1" 
                              fontWeight="bold"
                              color={record.amount < 0 ? 'error.main' : 'success.main'}
                            >
                              {formatNepaliCurrency(Math.abs(record.amount))}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getPaymentMethodIcon(record.paymentMethod)}
                              <Typography variant="body2">
                                {record.paymentMethod}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={record.status} 
                              color={getStatusColor(record.status) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="View Details">
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => {
                                    setSelectedTransaction(record);
                                    setOpenTransactionDialog(true);
                                  }}
                                >
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit">
                                <IconButton size="small" color="warning">
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Recent Transactions
                </Typography>
                <List>
                  {recentTransactions.map((transaction) => (
                    <ListItem key={transaction.id} sx={{ mb: 1, border: '1px solid', borderColor: 'grey.200', borderRadius: 1 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: getStatusColor(transaction.status) === 'success' ? 'success.main' : 'warning.main' }}>
                          <TableIcon />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" fontWeight="medium">
                              Table {transaction.tableNumber}
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" color="success.main">
                              {formatNepaliCurrency(transaction.amount)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {transaction.items} items • {transaction.paymentMethod}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {transaction.time}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemIcon>
                        <Chip 
                          label={transaction.status} 
                          color={getStatusColor(transaction.status) as any}
                          size="small"
                        />
                      </ListItemIcon>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Worker Dashboard - Show different content for workers */}
      {user?.role !== 'ADMIN' && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Recent Orders
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track your recent orders and their status
                </Typography>
                {/* Add worker-specific content here */}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button variant="contained" startIcon={<AddIcon />}>
                    Create New Order
                  </Button>
                  <Button variant="outlined" startIcon={<PaymentIcon />}>
                    Process Payment
                  </Button>
                  <Button variant="outlined" startIcon={<TableIcon />}>
                    Manage Tables
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Transaction Details Dialog */}
      <Dialog open={openTransactionDialog} onClose={() => setOpenTransactionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Transaction Details
        </DialogTitle>
        <DialogContent>
          {selectedTransaction && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    {selectedTransaction.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Date: {selectedTransaction.date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Category: {selectedTransaction.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Payment Method: {selectedTransaction.paymentMethod}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color={selectedTransaction.amount < 0 ? 'error.main' : 'success.main'}>
                    Amount: {formatNepaliCurrency(Math.abs(selectedTransaction.amount))}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTransactionDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 