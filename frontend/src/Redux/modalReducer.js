import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    isOpen: false,
    message: "", 
    onConfirmAction: null,
    payload: null,
  },
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.message = action.payload.message;
      // state.onConfirmAction = action.payload.onConfirmAction;
      // state.payload = action.payload.payload ?? null;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.message = "";
      // state.onConfirmAction = null;
      // state.payload = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;