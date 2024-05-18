import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload,
      };
    },
    logout: (state) => {
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    },
  },
});
export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
