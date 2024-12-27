import { createSlice } from "@reduxjs/toolkit";
import { AppConstants } from "../appConstants";
import { RootState } from "./reduxStore";
import User from "../models/User";
import { UserMembership } from "../models/UserMembership";

export interface AuthState {
  token: string;
  user: User | null;
  membership: UserMembership | null;
}

const initialState: AuthState = {
  token: "",
  user: null,
  membership: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    data: initialState,
  },
  reducers: {
    AddAuth: (state, action) => {
      state.data = action.payload;
    },
    RemoveAuth: (state) => {
      state.data = initialState;
      syncAuthStateLocalStorage(state.data);
    },
  },
});

const syncAuthStateLocalStorage = (data: AuthState) => {
  localStorage.setItem(AppConstants.token, JSON.stringify(data));
};

export const { AddAuth, RemoveAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
export const authState = (state: RootState) => state.auth.data;
