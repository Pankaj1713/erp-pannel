import { createSlice } from "@reduxjs/toolkit";

export const sessionSlice = createSlice({
  name: "auth/session",
  initialState: {
    token: "",
    imageUrl: "",
    signedIn: false,
  },
  reducers: {
    onSignInSuccess: (state, action) => {
      state.signedIn = true;
      state.token = action.payload?.token;
      state.imageUrl = action.payload?.s3BucketBaseUrl;
    },
    onSignOutSuccess: (state) => {
      state.signedIn = false;
      state.token = "";
      state.imageUrl = "";
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { onSignInSuccess, onSignOutSuccess, setToken } =
  sessionSlice.actions;
export default sessionSlice.reducer;
