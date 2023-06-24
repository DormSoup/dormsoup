"use client";

import { configureStore } from "@reduxjs/toolkit";

import { useDispatch } from "react-redux";

import eventDetailReducer from "./eventDetailSlice";
import searchReducer from "./searchSlice";

export const store = configureStore({
  reducer: {
    eventDetail: eventDetailReducer,
    search: searchReducer,
  },
  devTools: process.env.NODE_ENV !== "production"
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
