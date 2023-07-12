import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { WritableDraft } from "immer/dist/internal";

import { SerializableEventWithTags } from "../EventType";
import { GetEventTextSearchResponse } from "../api/event-text-search/route";
import { GetEventsResponse } from "../api/events/route";

import { RootState } from "./store";

export type SearchState = {
  keyword: string;
  filters: string[];

  displayPastEvents: boolean;
  eventIdsWithMatchingTexts: Set<number>;
  events: SerializableEventWithTags[];
  dateToEvents: Map<string, SerializableEventWithTags[]>;
};

const initialState: SearchState = {
  keyword: "",
  filters: [],

  displayPastEvents: false,
  eventIdsWithMatchingTexts: new Set<number>(),
  events: [],
  dateToEvents: new Map<string, SerializableEventWithTags[]>()
};

export const setSearchKeyword = createAsyncThunk(
  "search/setSearchKeyword",
  async (keyword: string, thunkAPI) => {
    thunkAPI.dispatch(setSearchKeywordInternal(keyword));
    thunkAPI.dispatch(setEventIdsWithMatchingTexts(new Set()));
    if (keyword === "") return;
    const events: GetEventTextSearchResponse = await (
      await fetch("/api/event-text-search?" + new URLSearchParams({ keyword }))
    ).json();

    if (keyword === (thunkAPI.getState() as RootState).search.keyword) {
      thunkAPI.dispatch(
        setEventIdsWithMatchingTexts(new Set([...events.map((event) => event.id)]))
      );
    }
  }
);

export const setDisplayPastEvents = createAsyncThunk(
  "search/setShowPastEvents",
  async (displayPastEvents: boolean, thunkAPI) => {
    const params = displayPastEvents
      ? new URLSearchParams({ order: "desc", until: new Date().toISOString() })
      : new URLSearchParams({ order: "asc", since: new Date().toISOString() });
    thunkAPI.dispatch(setDisplayPastEventsInternal(displayPastEvents));
    thunkAPI.dispatch(setEvents([]));
    const events: GetEventsResponse = await (await fetch("/api/events?" + params)).json();
    thunkAPI.dispatch(
      setEvents(
        events.map((event) => ({
          ...event,
          date: event.date as any as string,
          tags: event.tags.map((tag) => tag.name)
        }))
      )
    );
  }
);

function updateDateToEvents(state: WritableDraft<SearchState>) {
  const dateToEvents = new Map<string, SerializableEventWithTags[]>();
  const filteredEvents = state.events.filter((event) => {
    if (state.filters.length > 0 && event.tags.every((tag) => !state.filters.includes(tag)))
      return false;
    if (state.keyword === "") return true;
    if (state.eventIdsWithMatchingTexts.has(event.id)) return true;
    return [event.title, event.location, event.organizer].some((content) =>
      content.toLowerCase().includes(state.keyword)
    );
  });
  for (const event of filteredEvents) {
    const formatted = new Date(event.date).toISOString().split("T")[0];
    const otherEvents = dateToEvents.get(formatted);
    if (otherEvents === undefined) dateToEvents.set(formatted, [event]);
    else otherEvents.push(event);
  }
  state.dateToEvents = dateToEvents;
}

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchKeywordInternal: (state, action: PayloadAction<string>) => {
      state.keyword = action.payload;
    },
    setDisplayPastEventsInternal: (state, action: PayloadAction<boolean>) => {
      state.displayPastEvents = action.payload;
    },

    setEventIdsWithMatchingTexts: (state, action: PayloadAction<Set<number>>) => {
      state.eventIdsWithMatchingTexts = action.payload;
      updateDateToEvents(state);
    },
    setEvents: (state, action: PayloadAction<SerializableEventWithTags[]>) => {
      state.events = action.payload;
      updateDateToEvents(state);
    },
    toggleSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters = state.filters.includes(action.payload)
        ? state.filters.filter((filter) => filter !== action.payload)
        : [...state.filters, action.payload];
      updateDateToEvents(state);
    }
  }
});

const { setSearchKeywordInternal, setDisplayPastEventsInternal } = searchSlice.actions;

export const { setEventIdsWithMatchingTexts, toggleSearchFilter, setEvents } = searchSlice.actions;

// export const { setSearchKeyword, toggleSearchFilter } = searchSlice.actions;
export default searchSlice.reducer;
