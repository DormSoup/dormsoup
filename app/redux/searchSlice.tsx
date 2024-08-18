import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { WritableDraft } from "immer/dist/internal";

import { SerializableEventWithTags } from "../EventType";
import { GetEventTextSearchResponse } from "../api/event-text-search/route";
import { GetEventsResponse } from "../api/events/route";
import { LikeEventResponse } from "../api/like-event/route";
import { toDisplayName } from "../components/EventTagsBar";

import { RootState } from "./store";

export type SearchState = {
  keyword: string;
  filters: string[];
  bySentDate: boolean;
  displayPastEvents: boolean;
  noEvents: boolean;
  subscribed: boolean | undefined;
  eventIdsWithMatchingTexts: number[];
  events: SerializableEventWithTags[];
  dateToEvents: { [key: string]: SerializableEventWithTags[] };
};

const initialState: SearchState = {
  keyword: "",
  filters: [],
  bySentDate: false,
  displayPastEvents: false,
  eventIdsWithMatchingTexts: [],
  noEvents: false,
  subscribed: undefined,
  events: [],
  dateToEvents: {}
};

export const setSearchKeyword = createAsyncThunk(
  "search/setSearchKeyword",
  async (keyword: string, thunkAPI) => {
    thunkAPI.dispatch(setEventIdsWithMatchingTexts([]));
    thunkAPI.dispatch(setSearchKeywordInternal(keyword));
    if (keyword === "") return;
    const events: GetEventTextSearchResponse = await (
      await fetch("/api/event-text-search?" + new URLSearchParams({ keyword }))
    ).json();

    if (keyword === (thunkAPI.getState() as RootState).search.keyword) {
      thunkAPI.dispatch(setEventIdsWithMatchingTexts(events.map((event) => event.id)));
    }
  }
);

export const setBySentDate = createAsyncThunk(
  "search/setBySentDate",
  async (bySentDate: boolean, thunkAPI) =>{
    thunkAPI.dispatch(setBySentDateInternal(bySentDate));
  }
)

export const setDisplayPastEvents = createAsyncThunk(
  "search/setShowPastEvents",
  async (displayPastEvents: boolean, thunkAPI) => {
    // minus 4 hours to account for time zone difference
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() - 4);
    const params = displayPastEvents
      ? new URLSearchParams({ order: "desc", until: currentTime.toISOString() })
      : new URLSearchParams({ order: "asc", since: currentTime.toISOString() });
    thunkAPI.dispatch(setEvents([]));
    thunkAPI.dispatch(setDisplayPastEventsInternal(displayPastEvents));
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

export const likeEvent = createAsyncThunk("search/likeEvent", async (eventId: number, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  thunkAPI.dispatch(
    setEvents(
      state.search.events.map((event) => {
        if (event.id !== eventId) return event;
        const newEvent = {
          ...event,
          liked: !event.liked,
          likes: !event.liked ? event.likes + 1 : event.likes - 1
        };
        // if (state.eventDetail.event?.id === eventId) thunkAPI.dispatch(setCurrentEvent(newEvent));
        return newEvent;
      })
    )
  );
  const response: LikeEventResponse = await (
    await fetch("/api/like-event", {
      method: "POST",
      body: JSON.stringify({ id: eventId })
    })
  ).json();
});

export const toggleSubscribe = createAsyncThunk("search/toggleSubscribe", async (_, thunkAPI) => {
  const response = await (
    await fetch("/api/toggle-subscribe", {
      method: "POST"
    })
  ).json();
  thunkAPI.dispatch(setSubscribed(response.subscribed));
});

export const getIsSubscribed = createAsyncThunk("search/getIsSubscribed", async (_, thunkAPI) => {
  const response = await (
    await fetch("/api/toggle-subscribe", {
      method: "GET"
    })
  ).json();
  thunkAPI.dispatch(setSubscribed(response.subscribed));
});

function updateDateToEvents(state: WritableDraft<SearchState>) {
  const dateToEvents: { [key: string]: SerializableEventWithTags[] } = {};
  const filteredEvents = state.events.filter((event) => {
    if (state.filters.includes("Liked") && !event.liked) return false;
    const filtersExceptLike = state.filters.filter((filter) => filter !== "Liked");
    if (
      filtersExceptLike.length > 0 &&
      toDisplayName(event.tags).every((tag) => !filtersExceptLike.includes(tag))
    )
      return false;
    if (state.keyword === "") return true;
    if (state.eventIdsWithMatchingTexts.includes(event.id)) return true;
    return [event.title, event.location, event.organizer].some((content) =>
      content.toLowerCase().includes(state.keyword)
    );
  });
  state.noEvents = filteredEvents.length === 0;
  for (const event of filteredEvents) {
    const formatted = new Date(state.bySentDate ? (event.recievedDate ? event.recievedDate: event.date) : event.date)
      .toISOString()
      .split("T")[0];
    const otherEvents = dateToEvents[formatted];
    if (otherEvents === undefined) dateToEvents[formatted] = [event];
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
      if (action.payload === "") updateDateToEvents(state);
    },
    setDisplayPastEventsInternal: (state, action: PayloadAction<boolean>) => {
      state.displayPastEvents = action.payload;
      state.noEvents = false;
    },
    setSubscribed: (state, action: PayloadAction<boolean>) => {
      state.subscribed = action.payload;
    },
    setBySentDateInternal: (state, action: PayloadAction<boolean>) => {
      state.bySentDate = action.payload;
      updateDateToEvents(state);
    },
    setEventIdsWithMatchingTexts: (state, action: PayloadAction<number[]>) => {
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

const { setSearchKeywordInternal, setDisplayPastEventsInternal, setBySentDateInternal } = searchSlice.actions;

export const { setEventIdsWithMatchingTexts, toggleSearchFilter, setEvents, setSubscribed } =
  searchSlice.actions;

// export const { setSearchKeyword, toggleSearchFilter } = searchSlice.actions;
export default searchSlice.reducer;
