import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  deleteMember,
  fetchUserData,
  joinDome,
  makeAdmin,
  removeAdmin,
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
    email: string;
    isAdmin: boolean;
  };
  members: DomeMember[];
  devices: DomeDevice[];
  switches: DomeSwitch[];
  loading: boolean;
}

const initialState: DomeState = {
  id: null,
  user: {
    uid: null,
    name: "",
    email: "",
    isAdmin: false,
  },
  members: [],
  devices: [],
  switches: [],
  loading: false,
};

export const domeSlice = createSlice({
  name: "dome",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
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
    builder.addCase(fetchUserData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      const { domeId, userName, userUid, email } = action.payload;
      const devices = extractDevicesFromDbPayload(action.payload.dbPayload);
      const members = extractMembersFromDbPayload(action.payload.dbPayload);
      const switches = extractSwitchesFromDbPayload(action.payload.dbPayload);

      state.id = domeId;
      state.user.uid = userUid;
      state.user.name = userName;
      state.user.email = email ? email : "";
      state.user.isAdmin =
        members.find((m: DomeMember) => m.id === state.user.uid) !== undefined;

      state.devices = devices;
      state.members = members;
      state.switches = switches;
      state.loading = false;
    });

    // Join dome
    builder.addCase(joinDome.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(joinDome.fulfilled, (state, action) => {
      const { domeId } = action.payload;
      const devices = extractDevicesFromDbPayload(action.payload.dbPayload);
      const members = extractMembersFromDbPayload(action.payload.dbPayload);
      const switches = extractSwitchesFromDbPayload(action.payload.dbPayload);

      state.id = domeId;
      state.user.isAdmin =
        members.find((m: DomeMember) => m.id === state.user.uid) !== undefined;

      state.devices = devices;
      state.members = members;
      state.switches = switches;
      state.loading = false;
    });

    // Update username
    builder.addCase(updateUserName.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateUserName.fulfilled, (state, action) => {
      state.user.name = action.payload?.name;
      state.loading = false;
    });

    // Update device name
    builder.addCase(updateDeviceName.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateDeviceName.fulfilled, (state, action) => {
      state.loading = false;
      state.devices = state.devices.map((d) => {
        if (d.id !== action.payload.deviceId) return d;
        return { ...d, name: action.payload.name };
      });
    });

    // Update switch name
    builder.addCase(updateSwitchName.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateSwitchName.fulfilled, (state, action) => {
      const { switchId, deviceId, name } = action.payload;
      state.loading = false;
      state.switches = state.switches.map((s) => {
        if (s.id !== switchId || s.deviceId !== deviceId) return s;
        return { ...s, name };
      });
    });
    // update switch room type
    builder.addCase(updateSwitchRoom.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateSwitchRoom.fulfilled, (state, action) => {
      state.loading = false;
      state.switches = state.switches.map((s) => {
        const { deviceId, switchId, room } = action.payload;
        if (s.deviceId !== deviceId || s.id !== switchId) return s;
        return { ...s, room };
      });
    });

    // Add admin permissions
    builder.addCase(makeAdmin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(makeAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.members = state.members.map((m) => {
        if (m.id !== action.payload.uid) return m;
        return { ...m, isAdmin: true };
      });
    });

    // Remove admin permissions
    builder.addCase(removeAdmin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.members = state.members.map((m) => {
        if (m.id !== action.payload.uid) return m;
        return { ...m, isAdmin: false };
      });
    });

    // Delete member
    builder.addCase(deleteMember.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteMember.fulfilled, (state, action) => {
      state.loading = false;
      state.members = state.members.filter((m) => m.id !== action.payload.uid);
    });
  },
});

export const { updateSwitchState, cleanStore, setLoading } = domeSlice.actions;

export default domeSlice.reducer;
