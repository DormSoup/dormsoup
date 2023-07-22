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
    clearModal: (state) => {
      state.modal = undefined;
    }
  }
});

export const { setEventDetailModal, setFilterPanelModal, clearModal } = modalSlice.actions;
export default modalSlice.reducer;
