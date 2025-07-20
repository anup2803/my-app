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
} from '@mui/material';
import {
  People as PeopleIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  PersonAdd as PersonAddIcon,
  Group as GroupIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

interface Worker {
  id: string;
  name: string;
  email: string;
  role: 'WAITER' | 'KITCHEN_STAFF' | 'MANAGER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'ON_BREAK';
  phone: string;
  avatar: string;
  joinDate: string;
  lastActive: string;
  performance: number;
}

const Workers: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Mock data
  const workers: Worker[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@restaurant.com',
      role: 'WAITER',
      status: 'ACTIVE',
      phone: '+1 (555) 123-4567',
      avatar: 'https://i.pravatar.cc/150?img=5',
      joinDate: '2023-03-15',
      lastActive: '2024-01-15 14:30',
      performance: 95,
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@restaurant.com',
      role: 'KITCHEN_STAFF',
      status: 'ACTIVE',
      phone: '+1 (555) 234-5678',
      avatar: 'https://i.pravatar.cc/150?img=6',
      joinDate: '2023-01-20',
      lastActive: '2024-01-15 13:45',
      performance: 88,
    },
    {
      id: '3',
      name: 'Emily Davis',
      email: 'emily@restaurant.com',
      role: 'WAITER',
      status: 'ON_BREAK',
      phone: '+1 (555) 345-6789',
      avatar: 'https://i.pravatar.cc/150?img=7',
      joinDate: '2023-06-10',
      lastActive: '2024-01-15 12:20',
      performance: 92,
    },
    {
      id: '4',
      name: 'Carlos Rodriguez',
      email: 'carlos@restaurant.com',
      role: 'KITCHEN_STAFF',
      status: 'ACTIVE',
      phone: '+1 (555) 456-7890',
      avatar: 'https://i.pravatar.cc/150?img=8',
      joinDate: '2022-11-05',
      lastActive: '2024-01-15 11:15',
      performance: 96,
    },
  ];

  const stats = {
    totalWorkers: workers.length,
    activeWorkers: workers.filter(w => w.status === 'ACTIVE').length,
    onBreak: workers.filter(w => w.status === 'ON_BREAK').length,
    averagePerformance: Math.round(workers.reduce((sum, w) => sum + w.performance, 0) / workers.length),
  };

  const handleAddWorker = () => {
    setSelectedWorker(null);
    setIsEditMode(false);
    setOpenDialog(true);
  };

  const handleEditWorker = (worker: Worker) => {
    setSelectedWorker(worker);
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const handleDeleteWorker = (workerId: string) => {
    // Handle delete worker
    console.log('Delete worker:', workerId);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'error';
      case 'MANAGER': return 'warning';
      case 'WAITER': return 'info';
      case 'KITCHEN_STAFF': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'ON_BREAK': return 'warning';
      case 'INACTIVE': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircleIcon />;
      case 'ON_BREAK': return <ScheduleIcon />;
      case 'INACTIVE': return <CancelIcon />;
      default: return <WarningIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
          <PeopleIcon />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Staff Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your restaurant staff and their roles
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
                    {stats.totalWorkers}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Staff
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <GroupIcon />
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
                    {stats.activeWorkers}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active Staff
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
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.onBreak}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    On Break
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <ScheduleIcon />
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
                    {stats.averagePerformance}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Avg Performance
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <TrendingUpIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Workers Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              Staff Members
            </Typography>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleAddWorker}
              sx={{ borderRadius: 2 }}
            >
              Add Staff Member
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  <TableCell>Staff Member</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Performance</TableCell>
                  <TableCell>Last Active</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workers.map((worker) => (
                  <TableRow key={worker.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={
                            <Avatar sx={{ width: 12, height: 12, bgcolor: getStatusColor(worker.status) === 'success' ? 'success.main' : 'warning.main' }}>
                              {getStatusIcon(worker.status)}
                            </Avatar>
                          }
                        >
                          <Avatar src={worker.avatar} />
                        </Badge>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {worker.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {worker.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={worker.role.replace('_', ' ')} 
                        color={getRoleColor(worker.role) as any}
                        size="small"
                        icon={<WorkIcon />}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={worker.status.replace('_', ' ')} 
                        color={getStatusColor(worker.status) as any}
                        size="small"
                        icon={getStatusIcon(worker.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={worker.performance} 
                          sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {worker.performance}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {worker.lastActive}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" color="primary">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Staff Member">
                          <IconButton 
                            size="small" 
                            color="warning"
                            onClick={() => handleEditWorker(worker)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove Staff Member">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteWorker(worker.id)}
                          >
                            <DeleteIcon />
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

      {/* Add/Edit Worker Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditMode ? 'Edit Staff Member' : 'Add New Staff Member'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  defaultValue={selectedWorker?.name || ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  defaultValue={selectedWorker?.email || ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  defaultValue={selectedWorker?.phone || ''}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    label="Role"
                    defaultValue={selectedWorker?.role || 'WAITER'}
                  >
                    <MenuItem value="WAITER">Waiter</MenuItem>
                    <MenuItem value="KITCHEN_STAFF">Kitchen Staff</MenuItem>
                    <MenuItem value="MANAGER">Manager</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Active Status"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained">
            {isEditMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Workers; 