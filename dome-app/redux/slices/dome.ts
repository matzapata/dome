import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchUserData,
  updateDeviceName,
  updateSwitchName,
  updateSwitchRoom,
  updateUserName,
} from "./domeThunk";
import {
  extractDevicesFromDbPayload,
  extractMembersFromDbPayload,
  extractSwitchesFromDbPayload,
} from "./domeUtils";

export interface DomeMember {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface DomeSwitch {
  id: string; // id represents board pinout
  name: string;
  room: string;
  state: boolean;
  deviceId: string;
}

export interface DomeDevice {
  id: string;
  name: string;
}

export interface DomeState {
  id: string | null; // id of the dome
  user: {
    uid: string | null;
    name: string;
    isAdmin: boolean;
  };
  members: DomeMember[];
  devices: DomeDevice[];
  switches: DomeSwitch[];
}

const initialState: DomeState = {
  id: null,
  user: {
    uid: null,
    name: "",
    isAdmin: false,
  },
  members: [],
  devices: [],
  switches: [],
};

export const domeSlice = createSlice({
  name: "dome",
  initialState,
  reducers: {
    updateSwitchState: (
      state,
      action: PayloadAction<{
        deviceId: string;
        switchId: string | number;
        state: boolean;
      }>
    ) => {
      state.switches = state.switches.map((s) => {
        if (
          s.id === action.payload.switchId &&
          s.deviceId === action.payload.deviceId
        ) {
          return {
            ...s,
            state: action.payload.state,
          };
        } else return s;
      });
    },
    cleanStore: (state) => {
      state.id = initialState.id;
      state.user = initialState.user;
      state.members = initialState.members;
      state.devices = initialState.devices;
      state.switches = initialState.switches;
    },
  },
  extraReducers: (builder) => {
    // Fetch user data
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      const { domeId, userName, userUid } = action.payload;
      const devices = extractDevicesFromDbPayload(action.payload.dbPayload);
      const members = extractMembersFromDbPayload(action.payload.dbPayload);
      const switches = extractSwitchesFromDbPayload(action.payload.dbPayload);

      state.id = domeId;
      state.user.name = userName;
      state.user.uid = userUid;
      state.user.isAdmin =
        members.find((m: DomeMember) => m.id === state.user.uid) !== undefined;

      state.devices = devices;
      state.members = members;
      state.switches = switches;
    });

    // Update username
    builder.addCase(updateUserName.fulfilled, (state, action) => {
      state.user.name = action.payload?.name;
    });

    // Update device name
    builder.addCase(updateDeviceName.fulfilled, (state, action) => {
      state.devices = state.devices.map((d) => {
        if (d.id !== action.payload.deviceId) return d;
        return { ...d, name: action.payload.name };
      });
    });

    // Update switch name
    builder.addCase(updateSwitchName.fulfilled, (state, action) => {
      const { switchId, deviceId, name } = action.payload;
      state.switches = state.switches.map((s) => {
        if (s.id !== switchId || s.deviceId !== deviceId) return s;
        return { ...s, name };
      });
    });
    // update switch room type
    builder.addCase(updateSwitchRoom.fulfilled, (state, action) => {
      state.switches = state.switches.map((s) => {
        const { deviceId, switchId, room } = action.payload;
        if (s.deviceId !== deviceId || s.id !== switchId) return s;
        return { ...s, room };
      });
    });
  },
});

export const { updateSwitchState, cleanStore } = domeSlice.actions;

export default domeSlice.reducer;
