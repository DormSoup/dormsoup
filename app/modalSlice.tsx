import { Event } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type SerializableEvent = Omit<Event, "date"> & { date: string };

export type ModalState = {
  event: SerializableEvent | undefined;
};

const initialState: ModalState = {
  event: undefined
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setCurrentEvent: (state, action: PayloadAction<SerializableEvent>) => {
      state.event = action.payload;
    },
    clearCurrentEvent: (state) => {
      state.event = undefined;
    }
  }
});

export const { setCurrentEvent, clearCurrentEvent } = modalSlice.actions;
export default modalSlice.reducer;
