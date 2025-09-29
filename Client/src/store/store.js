import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "./slices/userInfoSlice";
import adminReducer from "./slices/adminSlice";

export const store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
    admin: adminReducer,
  },
});
