import { createSlice } from "@reduxjs/toolkit";

export interface DomeMember {
  id: string;
  name: string;
  email: string;
}

export interface DomeSwitch {
  id: string;
  name: string;
  roomType: string;
  state: boolean;
  deviceId: string;
}

export interface DomeDevice {
  id: string;
  name: string;
  switches: DomeSwitch[];
}

export interface DomeState {
  id: string | null;
  people: DomeMember[];
  devices: DomeDevice[];
}

// const initialState: DomeState = {
//   id: null,
//   people: [],
//   devices: [],
// };

const initialState: DomeState = {
  id: "dome_id",
  people: [],
  devices: [
    {
      id: "abc",
      name: "device",
      switches: [
        {
          id: "a",
          name: "Livingroom",
          deviceId: "abc",
          roomType: "bedroom",
          state: false,
        },
      ],
    },
  ],
};

export const domeSlice = createSlice({
  name: "dome",
  initialState,
  reducers: {},
});

export default domeSlice.reducer;
