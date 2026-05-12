import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("bookshelf_user");
const initialState = {
  isAuthenticated: !!storedUser,
  user: JSON.parse(storedUser) || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("bookshelf_user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.clear();
    },
    refreshUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("bookshelf_user", JSON.stringify(state.user));
    },
  },
});

export const { login, logout, refreshUser } = authSlice.actions;
export default authSlice.reducer;