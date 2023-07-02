import { Event } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type SerializableEvent = Omit<Event, "date" | "text"> & { date: string };

export type EventDetailState = {
  event: SerializableEvent | undefined;
};

const initialState: EventDetailState = {
  event: undefined
};

export const eventDetailSlice = createSlice({
  name: "eventDetail",
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

export const { setCurrentEvent, clearCurrentEvent } = eventDetailSlice.actions;
export default eventDetailSlice.reducer;
