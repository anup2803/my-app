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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  TableRestaurant as TableIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

interface TableData {
  id: string;
  number: number;
  capacity: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING';
  location: 'INDOOR' | 'OUTDOOR' | 'VIP';
  lastCleaned: string;
}

const Tables: React.FC = () => {
  const [openTableDialog, setOpenTableDialog] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [tables, setTables] = useState<TableData[]>([
    {
      id: '1',
      number: 1,
      capacity: 4,
      status: 'AVAILABLE',
      location: 'INDOOR',
      lastCleaned: '2024-01-15 13:00',
    },
    {
      id: '2',
      number: 2,
      capacity: 6,
      status: 'AVAILABLE',
      location: 'INDOOR',
      lastCleaned: '2024-01-15 12:30',
    },
    {
      id: '3',
      number: 3,
      capacity: 2,
      status: 'AVAILABLE',
      location: 'OUTDOOR',
      lastCleaned: '2024-01-15 11:45',
    },
    {
      id: '4',
      number: 4,
      capacity: 8,
      status: 'AVAILABLE',
      location: 'VIP',
      lastCleaned: '2024-01-15 14:15',
    },
    {
      id: '5',
      number: 5,
      capacity: 4,
      status: 'AVAILABLE',
      location: 'INDOOR',
      lastCleaned: '2024-01-15 13:30',
    },
  ]);

  const [formData, setFormData] = useState({
    number: '',
    capacity: '',
    location: 'INDOOR',
  });

  const handleAddTable = () => {
    setSelectedTable(null);
    setIsEditMode(false);
    setFormData({
      number: '',
      capacity: '',
      location: 'INDOOR',
    });
    setOpenTableDialog(true);
  };

  const handleEditTable = (table: TableData) => {
    setSelectedTable(table);
    setIsEditMode(true);
    setFormData({
      number: table.number.toString(),
      capacity: table.capacity.toString(),
      location: table.location,
    });
    setOpenTableDialog(true);
  };

  const handleDeleteTable = (tableId: string) => {
    setTables(tables.filter(table => table.id !== tableId));
  };

  const handleSaveTable = () => {
    if (isEditMode && selectedTable) {
      // Edit existing table
      setTables(tables.map(table => 
        table.id === selectedTable.id 
          ? {
              ...table,
              number: parseInt(formData.number),
              capacity: parseInt(formData.capacity),
              location: formData.location as 'INDOOR' | 'OUTDOOR' | 'VIP',
            }
          : table
      ));
    } else {
      // Add new table
      const newTable: TableData = {
        id: Date.now().toString(),
        number: parseInt(formData.number),
        capacity: parseInt(formData.capacity),
        status: 'AVAILABLE',
        location: formData.location as 'INDOOR' | 'OUTDOOR' | 'VIP',
        lastCleaned: new Date().toLocaleString(),
      };
      setTables([...tables, newTable]);
    }
    setOpenTableDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'success';
      case 'OCCUPIED': return 'error';
      case 'RESERVED': return 'warning';
      case 'CLEANING': return 'info';
      default: return 'default';
    }
  };

  const getLocationColor = (location: string) => {
    switch (location) {
      case 'INDOOR': return 'primary';
      case 'OUTDOOR': return 'success';
      case 'VIP': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return <CheckCircleIcon />;
      case 'OCCUPIED': return <WarningIcon />;
      case 'RESERVED': return <CancelIcon />;
      case 'CLEANING': return <WarningIcon />;
      default: return <CheckCircleIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
            <TableIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Table Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Add, edit, and manage restaurant tables
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddTable}
          sx={{ borderRadius: 2 }}
        >
          Add Table
        </Button>
      </Box>

      {/* Statistics */}
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
                    {tables.length}
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
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {tables.filter(t => t.status === 'AVAILABLE').length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Available Tables
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
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {tables.filter(t => t.location === 'VIP').length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    VIP Tables
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <PeopleIcon />
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
                    {tables.reduce((sum, table) => sum + table.capacity, 0)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Capacity
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <PeopleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tables Grid */}
      <Grid container spacing={3}>
        {tables.map((table) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={table.id}>
            <Card sx={{ 
              height: '100%',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    Table {table.number}
                  </Typography>
                  <Chip
                    icon={getStatusIcon(table.status)}
                    label={table.status}
                    color={getStatusColor(table.status) as any}
                    size="small"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Capacity: {table.capacity} people
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Location: {table.location}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last cleaned: {table.lastCleaned}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Tooltip title="Edit Table">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEditTable(table)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Table">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteTable(table.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Table Dialog */}
      <Dialog open={openTableDialog} onClose={() => setOpenTableDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TableIcon color="primary" />
            <Typography variant="h6">
              {isEditMode ? 'Edit Table' : 'Add New Table'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Table Number"
              type="number"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Location</InputLabel>
              <Select
                value={formData.location}
                label="Location"
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              >
                <MenuItem value="INDOOR">Indoor</MenuItem>
                <MenuItem value="OUTDOOR">Outdoor</MenuItem>
                <MenuItem value="VIP">VIP</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTableDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveTable}
            disabled={!formData.number || !formData.capacity}
          >
            {isEditMode ? 'Update' : 'Add'} Table
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tables; 