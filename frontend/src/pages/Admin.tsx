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
  ListItemAvatar,
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  Dashboard as DashboardIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  Store as StoreIcon,
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  TableRestaurant as TableIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Speed as SpeedIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface SystemStats {
  totalTables: number;
  availableTables: number;
  occupiedTables: number;
  totalMenuItems: number;
  activeMenuItems: number;
  systemUptime: number;
  tableOccupancy: number;
  averageTableCapacity: number;
}

interface RecentActivity {
  id: string;
  type: 'USER_LOGIN' | 'SYSTEM_UPDATE' | 'TABLE_UPDATE' | 'MENU_UPDATE';
  description: string;
  time: string;
  user: string;
  amount?: number;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
}

const Admin: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);

  // Mock data
  const stats: SystemStats = {
    totalTables: 20,
    availableTables: 8,
    occupiedTables: 12,
    totalMenuItems: 45,
    activeMenuItems: 42,
    systemUptime: 99.8,
    tableOccupancy: 60,
    averageTableCapacity: 4,
  };

  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'TABLE_UPDATE',
      description: 'New table added - Table 15',
      time: '2 minutes ago',
      user: 'Admin',
    },
    {
      id: '2',
      type: 'MENU_UPDATE',
      description: 'Menu updated - 3 new items added',
      time: '5 minutes ago',
      user: 'Admin',
    },
    {
      id: '3',
      type: 'USER_LOGIN',
      description: 'Chef Carlos logged in',
      time: '10 minutes ago',
      user: 'Chef Carlos',
    },
    {
      id: '4',
      type: 'SYSTEM_UPDATE',
      description: 'System settings updated',
      time: '15 minutes ago',
      user: 'Admin',
    },
  ];

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'View Reports',
      description: 'Access detailed analytics and reports',
      icon: <AssessmentIcon />,
      color: '#667eea',
      action: () => console.log('View Reports'),
    },
    {
      id: '2',
      title: 'System Settings',
      description: 'Configure restaurant settings and preferences',
      icon: <SettingsIcon />,
      color: '#43e97b',
      action: () => setOpenSettingsDialog(true),
    },
    {
      id: '3',
      title: 'User Management',
      description: 'Manage staff accounts and permissions',
      icon: <PeopleIcon />,
      color: '#fa709a',
      action: () => console.log('User Management'),
    },
    {
      id: '4',
      title: 'Menu Management',
      description: 'Update menu items and pricing',
      icon: <RestaurantIcon />,
      color: '#4facfe',
      action: () => console.log('Menu Management'),
    },
  ];

  const formatNepaliCurrency = (amount: number) => {
    return `रू ${amount.toLocaleString()}`;
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'TABLE_UPDATE': return 'primary';
      case 'MENU_UPDATE': return 'success';
      case 'USER_LOGIN': return 'info';
      case 'SYSTEM_UPDATE': return 'warning';
      default: return 'default';
    }
  };

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'TABLE_UPDATE': return <TableIcon />;
      case 'MENU_UPDATE': return <RestaurantIcon />;
      case 'USER_LOGIN': return <PeopleIcon />;
      case 'SYSTEM_UPDATE': return <SettingsIcon />;
      default: return <NotificationsIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
          <AdminIcon />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            System overview and management
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
                    {stats.totalTables}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Tables
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <TableIcon />
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
                    {stats.availableTables}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Available Tables
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <TableIcon />
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
                    {stats.occupiedTables}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Occupied Tables
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <TableIcon />
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
                    {stats.totalMenuItems}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Menu Items
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

      {/* Quick Actions */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={3}>
            {quickActions.map((action) => (
              <Grid item xs={12} sm={6} md={3} key={action.id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    }
                  }}
                  onClick={action.action}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: action.color, width: 48, height: 48 }}>
                        {action.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {action.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {action.description}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold">
                  Recent Activity
                </Typography>
                <Button variant="outlined" startIcon={<RefreshIcon />}>
                  Refresh
                </Button>
              </Box>

              <List>
                {recentActivities.map((activity) => (
                  <ListItem key={activity.id} sx={{ mb: 2, border: '1px solid', borderColor: 'grey.200', borderRadius: 2 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${getActivityTypeColor(activity.type)}.main` }}>
                        {getActivityTypeIcon(activity.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body1" fontWeight="medium">
                            {activity.description}
                          </Typography>
                          {activity.amount && (
                            <Typography variant="body1" fontWeight="bold" color="success.main">
                              {formatNepaliCurrency(activity.amount)}
                            </Typography>
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {activity.user} • {activity.time}
                          </Typography>
                        </Box>
                      }
                    />
                    <Chip 
                      label={activity.type.replace('_', ' ')} 
                      color={getActivityTypeColor(activity.type) as any}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                System Status
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">System Uptime</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {stats.systemUptime}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.systemUptime}
                  color="success"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">Average Table Capacity</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {stats.averageTableCapacity}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={75}
                  color="warning"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">Total Menu Items</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {stats.totalMenuItems}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={90}
                  color="info"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  System Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Last Updated</Typography>
                    <Typography variant="body2">2 minutes ago</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Active Users</Typography>
                    <Typography variant="body2">8 online</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">System Status</Typography>
                    <Chip label="Online" color="success" size="small" />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Settings Dialog */}
      <Dialog open={openSettingsDialog} onClose={() => setOpenSettingsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SettingsIcon color="primary" />
            <Typography variant="h6">
              System Settings
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body1" color="text.secondary">
              System settings and configuration options will be implemented here.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSettingsDialog(false)}>Close</Button>
          <Button variant="contained" color="primary">
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Admin; 