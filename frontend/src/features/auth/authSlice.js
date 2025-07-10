import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoggedin: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isLoggedin = true;
      localStorage.setItem("payyou-user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedin = false;
      localStorage.removeItem("payyou-user");
    },
  },
});


export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
