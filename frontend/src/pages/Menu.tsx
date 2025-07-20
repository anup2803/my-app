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
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  Star as StarIcon,
  LocalOffer as OfferIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Notifications as NotificationsIcon,
  PhotoCamera as PhotoIcon,
  Description as DescriptionIcon,
  Warning as WarningIcon,
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'APPETIZER' | 'MAIN_COURSE' | 'DESSERT' | 'BEVERAGE' | 'SALAD' | 'SIDE';
  image: string;
  isAvailable: boolean;
  isPopular: boolean;
  isVegetarian: boolean;
  isGlutenFree: boolean;
  preparationTime: number; // in minutes
  calories: number;
  ingredients: string[];
  allergens: string[];
  stockQuantity: number;
  minStockLevel: number;
  totalSales: number;
  averageRating: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  totalRevenue: number;
}

const Menu: React.FC = () => {
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Mock data
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Grilled Salmon',
      description: 'Fresh Atlantic salmon grilled to perfection with herbs and lemon',
      price: 28.50,
      category: 'MAIN_COURSE',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop',
      isAvailable: true,
      isPopular: true,
      isVegetarian: false,
      isGlutenFree: true,
      preparationTime: 15,
      calories: 450,
      ingredients: ['Salmon', 'Lemon', 'Herbs', 'Olive Oil', 'Salt', 'Pepper'],
      allergens: ['Fish'],
      stockQuantity: 25,
      minStockLevel: 10,
      totalSales: 156,
      averageRating: 4.8,
    },
    {
      id: '2',
      name: 'Caesar Salad',
      description: 'Crisp romaine lettuce with Caesar dressing, croutons, and parmesan',
      price: 12.00,
      category: 'SALAD',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop',
      isAvailable: true,
      isPopular: false,
      isVegetarian: false,
      isGlutenFree: false,
      preparationTime: 8,
      calories: 280,
      ingredients: ['Romaine Lettuce', 'Caesar Dressing', 'Croutons', 'Parmesan Cheese'],
      allergens: ['Gluten', 'Dairy'],
      stockQuantity: 15,
      minStockLevel: 5,
      totalSales: 89,
      averageRating: 4.2,
    },
    {
      id: '3',
      name: 'Beef Burger',
      description: 'Juicy beef patty with lettuce, tomato, cheese, and special sauce',
      price: 18.75,
      category: 'MAIN_COURSE',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
      isAvailable: true,
      isPopular: true,
      isVegetarian: false,
      isGlutenFree: false,
      preparationTime: 12,
      calories: 650,
      ingredients: ['Beef Patty', 'Bun', 'Lettuce', 'Tomato', 'Cheese', 'Sauce'],
      allergens: ['Gluten', 'Dairy'],
      stockQuantity: 30,
      minStockLevel: 15,
      totalSales: 234,
      averageRating: 4.6,
    },
    {
      id: '4',
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
      price: 22.50,
      category: 'MAIN_COURSE',
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=200&fit=crop',
      isAvailable: true,
      isPopular: true,
      isVegetarian: true,
      isGlutenFree: false,
      preparationTime: 20,
      calories: 520,
      ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella', 'Basil'],
      allergens: ['Gluten', 'Dairy'],
      stockQuantity: 20,
      minStockLevel: 8,
      totalSales: 187,
      averageRating: 4.7,
    },
    {
      id: '5',
      name: 'Chocolate Cake',
      description: 'Rich chocolate cake with chocolate ganache and fresh berries',
      price: 9.50,
      category: 'DESSERT',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop',
      isAvailable: true,
      isPopular: false,
      isVegetarian: true,
      isGlutenFree: false,
      preparationTime: 5,
      calories: 380,
      ingredients: ['Chocolate', 'Flour', 'Eggs', 'Sugar', 'Butter', 'Berries'],
      allergens: ['Gluten', 'Eggs', 'Dairy'],
      stockQuantity: 12,
      minStockLevel: 6,
      totalSales: 67,
      averageRating: 4.4,
    },
    {
      id: '6',
      name: 'Fresh Orange Juice',
      description: 'Freshly squeezed orange juice served cold',
      price: 4.25,
      category: 'BEVERAGE',
      image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&h=200&fit=crop',
      isAvailable: true,
      isPopular: false,
      isVegetarian: true,
      isGlutenFree: true,
      preparationTime: 3,
      calories: 120,
      ingredients: ['Fresh Oranges'],
      allergens: [],
      stockQuantity: 50,
      minStockLevel: 20,
      totalSales: 145,
      averageRating: 4.1,
    },
  ];

  const categories: Category[] = [
    {
      id: 'APPETIZER',
      name: 'Appetizers',
      description: 'Start your meal with our delicious appetizers',
      itemCount: 8,
      totalRevenue: 1250.75,
    },
    {
      id: 'MAIN_COURSE',
      name: 'Main Courses',
      description: 'Our signature main dishes',
      itemCount: 15,
      totalRevenue: 4560.25,
    },
    {
      id: 'SALAD',
      name: 'Salads',
      description: 'Fresh and healthy salad options',
      itemCount: 6,
      totalRevenue: 890.50,
    },
    {
      id: 'DESSERT',
      name: 'Desserts',
      description: 'Sweet endings to your meal',
      itemCount: 10,
      totalRevenue: 670.25,
    },
    {
      id: 'BEVERAGE',
      name: 'Beverages',
      description: 'Refreshing drinks and cocktails',
      itemCount: 12,
      totalRevenue: 450.75,
    },
  ];

  const stats = {
    totalItems: menuItems.length,
    availableItems: menuItems.filter(item => item.isAvailable).length,
    popularItems: menuItems.filter(item => item.isPopular).length,
    lowStockItems: menuItems.filter(item => item.stockQuantity <= item.minStockLevel).length,
    totalRevenue: menuItems.reduce((sum, item) => sum + (item.totalSales * item.price), 0),
    averageRating: Math.round(menuItems.reduce((sum, item) => sum + item.averageRating, 0) / menuItems.length * 10) / 10,
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setIsEditMode(false);
    setOpenItemDialog(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsEditMode(true);
    setOpenItemDialog(true);
  };

  const handleDeleteItem = (itemId: string) => {
    console.log('Delete item:', itemId);
  };

  const handleToggleAvailability = (itemId: string) => {
    console.log('Toggle availability:', itemId);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'APPETIZER': return 'primary';
      case 'MAIN_COURSE': return 'success';
      case 'SALAD': return 'info';
      case 'DESSERT': return 'warning';
      case 'BEVERAGE': return 'secondary';
      default: return 'default';
    }
  };

  const getStockColor = (quantity: number, minLevel: number) => {
    if (quantity <= minLevel) return 'error';
    if (quantity <= minLevel * 2) return 'warning';
    return 'success';
  };

  const filteredItems = selectedCategory === 'ALL' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
          <RestaurantIcon />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Menu Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage menu items, categories, and pricing
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
                    {stats.totalItems}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Items
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <RestaurantIcon />
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
                    {stats.availableItems}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Available Items
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
                    ${stats.totalRevenue.toLocaleString()}
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
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.averageRating}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Avg Rating
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <StarIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Category Filter and Actions */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Category Filter</InputLabel>
            <Select
              value={selectedCategory}
              label="Category Filter"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="ALL">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant={viewMode === 'grid' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddItem}
          sx={{ borderRadius: 2 }}
        >
          Add Menu Item
        </Button>
      </Box>

      {/* Low Stock Alert */}
      {stats.lowStockItems > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {stats.lowStockItems} items are running low on stock. Please restock soon.
        </Alert>
      )}

      {/* Menu Items Grid/List View */}
      {viewMode === 'grid' ? (
        <ImageList cols={3} gap={16}>
          {filteredItems.map((item) => (
            <ImageListItem key={item.id} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                style={{ height: 200, objectFit: 'cover' }}
              />
              <ImageListItemBar
                title={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="bold">
                      {item.name}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="success.main">
                      ${item.price}
                    </Typography>
                  </Box>
                }
                subtitle={
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {item.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={item.category.replace('_', ' ')} 
                        color={getCategoryColor(item.category) as any}
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
                      {!item.isAvailable && (
                        <Chip 
                          label="Unavailable" 
                          color="error"
                          size="small"
                        />
                      )}
                      <Chip 
                        label={`Stock: ${item.stockQuantity}`} 
                        color={getStockColor(item.stockQuantity, item.minStockLevel) as any}
                        size="small"
                      />
                    </Box>
                  </Box>
                }
                actionIcon={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit Item">
                      <IconButton 
                        size="small" 
                        color="warning"
                        onClick={() => handleEditItem(item)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Item">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              />
            </ImageListItem>
          ))}
        </ImageList>
      ) : (
        <Card>
          <CardContent>
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    <TableCell>Item</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Sales</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            src={item.image} 
                            variant="rounded"
                            sx={{ width: 50, height: 50 }}
                          />
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {item.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                              {item.description}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={item.category.replace('_', ' ')} 
                          color={getCategoryColor(item.category) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold" color="success.main">
                          ${item.price}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">
                            {item.stockQuantity}
                          </Typography>
                          <Chip 
                            label={item.stockQuantity <= item.minStockLevel ? 'Low' : 'OK'} 
                            color={getStockColor(item.stockQuantity, item.minStockLevel) as any}
                            size="small"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip 
                            label={item.isAvailable ? 'Available' : 'Unavailable'} 
                            color={item.isAvailable ? 'success' : 'error'}
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
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {item.totalSales} sold
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <StarIcon sx={{ color: 'warning.main', fontSize: 16 }} />
                          <Typography variant="body2">
                            {item.averageRating}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton size="small" color="primary">
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Item">
                            <IconButton 
                              size="small" 
                              color="warning"
                              onClick={() => handleEditItem(item)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Toggle Availability">
                            <IconButton 
                              size="small" 
                              color={item.isAvailable ? 'error' : 'success'}
                              onClick={() => handleToggleAvailability(item.id)}
                            >
                              {item.isAvailable ? <CancelIcon /> : <CheckCircleIcon />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Item">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteItem(item.id)}
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
      )}

      {/* Add/Edit Menu Item Dialog */}
      <Dialog open={openItemDialog} onClose={() => setOpenItemDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditMode ? 'Edit Menu Item' : 'Add New Menu Item'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Item Name"
                  defaultValue={selectedItem?.name || ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  defaultValue={selectedItem?.description || ''}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  defaultValue={selectedItem?.price || ''}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                    defaultValue={selectedItem?.category || 'MAIN_COURSE'}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Preparation Time (minutes)"
                  type="number"
                  defaultValue={selectedItem?.preparationTime || ''}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Calories"
                  type="number"
                  defaultValue={selectedItem?.calories || ''}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Stock Quantity"
                  type="number"
                  defaultValue={selectedItem?.stockQuantity || ''}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Minimum Stock Level"
                  type="number"
                  defaultValue={selectedItem?.minStockLevel || ''}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked={selectedItem?.isAvailable ?? true} />}
                  label="Available"
                />
                <FormControlLabel
                  control={<Switch defaultChecked={selectedItem?.isPopular ?? false} />}
                  label="Popular Item"
                />
                <FormControlLabel
                  control={<Switch defaultChecked={selectedItem?.isVegetarian ?? false} />}
                  label="Vegetarian"
                />
                <FormControlLabel
                  control={<Switch defaultChecked={selectedItem?.isGlutenFree ?? false} />}
                  label="Gluten Free"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenItemDialog(false)}>Cancel</Button>
          <Button variant="contained">
            {isEditMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Menu; 