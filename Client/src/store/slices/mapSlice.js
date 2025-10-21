import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  urls: [
    "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png", // Stamen Toner
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", // OpenStreetMap
  ],
  currentIndex: 0,
};

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    toggleMap: (state) => {
      state.currentIndex = (state.currentIndex + 1) % state.urls.length;
    },
  },
});

export const { toggleMap } = mapSlice.actions;
export default mapSlice.reducer;
