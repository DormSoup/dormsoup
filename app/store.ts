"use client";

import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./modalSlice";

const store = configureStore({
  reducer: {
    modal: modalReducer
  },
  devTools: process.env.NODE_ENV !== "production"
});

export const store1 = store;
console.log("STORE: ", store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
