import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type SearchState = {
  keyword: string;
  filters: string[];
};

const initialState: SearchState = {
  keyword: "",
  filters: []
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchKeyword: (state, action: PayloadAction<string>) => {
      state.keyword = action.payload;
    },
    toggleSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters = state.filters.includes(action.payload)
        ? state.filters.filter((filter) => filter !== action.payload)
        : [...state.filters, action.payload];
    }
  }
});

export const { setSearchKeyword, toggleSearchFilter } = searchSlice.actions;
export default searchSlice.reducer;
