import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  name: string;
}

const initialState: UserState = {
  name: "Matias Zapata",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
});

export default userSlice.reducer;
