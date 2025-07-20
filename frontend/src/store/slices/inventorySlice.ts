import { createSlice } from '@reduxjs/toolkit';

export interface InventoryState {
  ingredients: any[];
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  ingredients: [],
  loading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { clearError } = inventorySlice.actions;
export default inventorySlice.reducer; 