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
  people: [
    { id: "a", name: "Juan Perez", email: "juanperez@gmail.com" },
    { id: "b", name: "Juana Perez", email: "juanperez@gmail.com" },
    { id: "c", name: "Gonzalo Perez", email: "juanperez@gmail.com" },
  ],
  devices: [
    {
      id: "new",
      name: "Device",
      switches: [
        {
          id: "a",
          name: "Livingroom",
          deviceId: "abc",
          roomType: "Bedroom",
          state: false,
        },
        {
          id: "b",
          name: "Bedroom",
          deviceId: "abc",
          roomType: "Bedroom",
          state: false,
        },
      ],
    },
    {
      id: "cba",
      name: "Device",
      switches: [
        {
          id: "a",
          name: "Livingroom",
          deviceId: "abc",
          roomType: "Bedroom",
          state: false,
        },
        {
          id: "b",
          name: "Bedroom",
          deviceId: "abc",
          roomType: "Bedroom",
          state: false,
        },
        {
          id: "c",
          name: "Bedroom",
          deviceId: "abc",
          roomType: "Bedroom",
          state: false,
        },
        {
          id: "d",
          name: "Bedroom",
          deviceId: "abc",
          roomType: "Bedroom",
          state: false,
        },
        {
          id: "e",
          name: "Bedroom",
          deviceId: "abc",
          roomType: "Bedroom",
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
