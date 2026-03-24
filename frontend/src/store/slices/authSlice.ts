import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
