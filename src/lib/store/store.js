import { configureStore } from "@reduxjs/toolkit";
import jsonParseReducer from "./features/jsonParseSlice";

export const store = configureStore({
  reducer: {
    json: jsonParseReducer,
  },
});
