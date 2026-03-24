import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  isSidebarOpen: boolean;
}

const initialState: UIState = {
  isSidebarOpen: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebar: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebar } = uiSlice.actions;
export default uiSlice.reducer;
