import { createSlice } from '@reduxjs/toolkit';

export interface ReportState {
  reports: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ReportState = {
  reports: [],
  loading: false,
  error: null,
};

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { clearError } = reportSlice.actions;
export default reportSlice.reducer; 