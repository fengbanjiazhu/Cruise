import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    refreshPaths: 0, // Counter to trigger paths refresh
    refreshIncidents: 0, // Counter to trigger incidents refresh
  },
  reducers: {
    triggerPathsRefresh: (state) => {
      state.refreshPaths += 1;
    },
    triggerIncidentsRefresh: (state) => {
      state.refreshIncidents += 1;
    },
  },
});

export const { triggerPathsRefresh, triggerIncidentsRefresh } = adminSlice.actions;
export default adminSlice.reducer;
