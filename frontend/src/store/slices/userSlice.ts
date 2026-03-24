import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string | null;
  fullName: string | null;
  username: string | null;
  email: string | null;
  role: string | null;
}

const initialState: UserState = {
  id: null,
  fullName: null,
  username: null,
  email: null,
  role: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
