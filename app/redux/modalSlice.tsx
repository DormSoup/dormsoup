import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { SerializableEvent } from "../EventType";

export type EventDetailState = {
  modal:
    | undefined
    | {
        type: "event-detail";
        event: SerializableEvent;
      }
    | {
        type: "filter-panel";
      }
    | {
        type: "edit-event";
        event: SerializableEvent;
      };
};

const initialState: EventDetailState = { modal: undefined };

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setEventDetailModal: (state, action: PayloadAction<SerializableEvent>) => {
      state.modal = {
        type: "event-detail",
        event: action.payload
      };
    },
    setFilterPanelModal: (state) => {
      state.modal = { type: "filter-panel" };
    },
    setEditEventModal: (state, action: PayloadAction<SerializableEvent>) => {
      state.modal = {
        type: "edit-event",
        event: action.payload
      };
    },
    clearModal: (state) => {
      state.modal = undefined;
    }
  }
});

export const { setEventDetailModal, setFilterPanelModal, setEditEventModal, clearModal } =
  modalSlice.actions;
export default modalSlice.reducer;
