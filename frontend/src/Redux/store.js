import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authReducer.js";
import notificationReducer from "./notificationReducer.js";
import modalReducer from "./modalReducer.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    modal: modalReducer,
  },
});