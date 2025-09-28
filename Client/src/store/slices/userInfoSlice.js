import { createSlice } from "@reduxjs/toolkit";
import { fetchGet } from "../../utils/api";

const initialState = {
  token: localStorage.getItem("jwt") || null,
  user: null,
  isLoggedIn: false,
  loadingUser: false,
};

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoggedIn = true;
    },
    removeUser: (state) => {
      localStorage.removeItem("jwt");
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = action.payload;
      }
    },
    startLoadingUser: (state) => {
      state.loadingUser = true;
    },
    endLoadingUser: (state) => {
      state.loadingUser = false;
    },
    // updateSavedList: (state, action) => {
    //   if (state.user) {
    //     state.user.savedList = action.payload;
    //   }
    // },
  },
});

export const fetchUserInfoUntilSuccess = () => async (dispatch, getState) => {
  const token = getState().userInfo.token;
  const user = getState().userInfo.user;
  // console.log("TOKEN::", token);

  if ((user != null && user != undefined) || !token) return;

  dispatch(startLoadingUser());

  const tryFetch = async () => {
    try {
      const data = await fetchGet("user/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setUser({ user: data.data, token, loadingUser: true }));
      dispatch(endLoadingUser());
    } catch (err) {
      console.log("User fetch failed, retrying in 1s...", err);
      setTimeout(tryFetch, 5000);
    }
  };

  tryFetch();
};

export const { setUser, removeUser, updateUser, startLoadingUser, endLoadingUser } =
  userInfoSlice.actions;

export default userInfoSlice.reducer;
