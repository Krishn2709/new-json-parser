import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  input: "",
  parsedOutput: "",
  error: null,
  isValid: false,
};

const jsonParseSlice = createSlice({
  name: "json",
  initialState,
  reducers: {
    setInput: (state, action) => {
      state.input = action.payload;
      state.error = null;
    },
    setParsedOutput: (state, action) => {
      state.parsedOutput = action.payload;
      state.isValid = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isValid = false;
      state.parsedOutput = "";
    },
  },
});

export const { setInput, setParsedOutput, setError } = jsonParseSlice.actions;

export default jsonParseSlice.reducer;
