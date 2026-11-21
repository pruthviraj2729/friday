import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  status: "loading",
  error: null,
  fieldErrors: {}
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated(state, action) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.status = "authenticated";
      state.error = null;
      state.fieldErrors = {};
    },
    setGuest(state) {
      state.user = null;
      state.accessToken = null;
      state.status = "guest";
      state.error = null;
    },
    setAuthError(state, action) {
      state.status = state.user ? "authenticated" : "guest";
      state.error = action.payload.message;
      state.fieldErrors = action.payload.fields || {};
    },
    clearAuthError(state) {
      state.error = null;
      state.fieldErrors = {};
    }
  }
});

export const { setAuthenticated, setGuest, setAuthError, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
