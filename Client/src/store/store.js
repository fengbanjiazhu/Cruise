import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "./slices/userInfoSlice";
import adminReducer from "./slices/adminSlice";
import mapReducer from "./slices/mapSlice";

export const store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
    admin: adminReducer,
    mapURL: mapReducer,
  },
});
