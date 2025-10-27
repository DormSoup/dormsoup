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

let lastModal: unknown = null;

// Subscribes to changes to modal, updates URL params accordingly
store.subscribe(() => {
  const state = store.getState().modal;
  const modal = state.modal;
  // Prevent running if modal hasn't changed
  if (modal === lastModal) return;
  lastModal = modal;

  const params = new URLSearchParams(window.location.search);

  if (modal) {
    if (modal.type === "event-detail") {
      params.set("eventId", modal.event.id.toString());
    } else {
      params.delete("eventId");
    }
  }

  else {
    params.delete("eventId");
  }

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", newUrl);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
