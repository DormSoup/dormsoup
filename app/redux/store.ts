"use client";

import { configureStore } from "@reduxjs/toolkit";

import { useDispatch } from "react-redux";

import modalReducer from "./modalSlice";
import searchReducer from "./searchSlice";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    search: searchReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
