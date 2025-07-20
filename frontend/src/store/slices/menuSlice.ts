import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types
export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  categoryId: string;
  isActive: boolean;
  isVegetarian: boolean;
  isSpicy: boolean;
  preparationTime?: number;
  category: Category;
  modifiers: Modifier[];
}

export interface Modifier {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
}

export interface MenuState {
  categories: Category[];
  menuItems: MenuItem[];
  modifiers: Modifier[];
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  categories: [],
  menuItems: [],
  modifiers: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchCategories = createAsyncThunk(
  'menu/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/menu/categories');
      return response.data.data.categories;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const fetchMenuItems = createAsyncThunk(
  'menu/fetchMenuItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/menu/items');
      return response.data.data.items;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch menu items');
    }
  }
);

export const fetchModifiers = createAsyncThunk(
  'menu/fetchModifiers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/menu/modifiers');
      return response.data.data.modifiers;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch modifiers');
    }
  }
);

// Slice
const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch menu items
      .addCase(fetchMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.menuItems = action.payload;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch modifiers
      .addCase(fetchModifiers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModifiers.fulfilled, (state, action) => {
        state.loading = false;
        state.modifiers = action.payload;
      })
      .addCase(fetchModifiers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = menuSlice.actions;
export default menuSlice.reducer; 