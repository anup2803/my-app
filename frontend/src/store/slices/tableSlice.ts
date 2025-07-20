import { createSlice } from '@reduxjs/toolkit';

export interface TableState {
  tables: any[];
  loading: boolean;
  error: string | null;
}

const initialState: TableState = {
  tables: [],
  loading: false,
  error: null,
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { clearError } = tableSlice.actions;
export default tableSlice.reducer; 