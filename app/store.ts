"use client";

import { configureStore } from "@reduxjs/toolkit";

import { useDispatch } from "react-redux";

import modalReducer from "./modalSlice";

export const store = configureStore({
  reducer: {
    modal: modalReducer
  },
  devTools: process.env.NODE_ENV !== "production"
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
