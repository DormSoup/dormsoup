import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type SearchState = {
  keyword: string
};

const initialState: SearchState = {
  keyword: ""
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchKeyword: (state, action: PayloadAction<string>) => {
      state.keyword = action.payload;
    },
  }
});

export const { setSearchKeyword } = searchSlice.actions;
export default searchSlice.reducer;
