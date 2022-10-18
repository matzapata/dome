import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getUserData,
  logOut,
  signIn,
  signUp,
  updateDeviceName,
  updateSwitchName,
  updateSwitchRoomType,
  updateUserName,
} from "./domeThunk";

export interface DomeMember {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface DomeSwitch {
  id: string; // pinout
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
  user: {
    uid: string | undefined | null;
    name: string;
    isAdmin: boolean;
  };
  domeId: string | null;
  members: DomeMember[];
  devices: DomeDevice[];
}

const initialState: DomeState = {
  user: { uid: null, name: "", isAdmin: false },
  domeId: null,
  members: [],
  devices: [],
};

export const domeSlice = createSlice({
  name: "dome",
  initialState,
  reducers: {
    updateSwitchState: (
      state,
      action: PayloadAction<{
        deviceId: string;
        switchId: string;
        state: boolean;
      }>
    ) => {
      state.devices = state.devices.map((d) => {
        if (d.id !== action.payload.deviceId) return d;
        return {
          ...d,
          switches: d.switches.map((s) => {
            if (s.id !== action.payload.switchId) return s;
            return {
              ...s,
              state: action.payload.state,
            };
          }),
        };
      });
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.user.uid = action.payload.uid;
      state.user.name = action.payload.name;
    });
    builder.addCase(signUp.rejected, (state) => {
      state.user.uid = "";
      state.user.name = "";
    });

    // Signin
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.user.uid = action.payload.uid;
    });
    builder.addCase(signIn.rejected, (state) => {
      state.user.uid = "";
    });

    // Logout
    builder.addCase(logOut.fulfilled, (state) => {
      state.user = initialState.user;
      state.domeId = initialState.domeId;
      state.members = initialState.members;
      state.devices = initialState.devices;
    });

    // Get user data
    builder.addCase(getUserData.fulfilled, (state, action) => {
      const members: DomeMember[] = Object.keys(action.payload.members).map(
        (memberId) => ({
          id: memberId,
          email: action.payload.members[memberId].email,
          name: action.payload.members[memberId].name,
          isAdmin: action.payload.members[memberId].isAdmin,
        })
      );
      const devices: DomeDevice[] = Object.keys(action.payload.devices).map(
        (deviceId) => {
          const device = action.payload.devices[deviceId];
          return {
            id: deviceId,
            name: device.name,
            switches: Object.keys(device.switches).map((switchId) => {
              return {
                id: switchId,
                name: device.switches[switchId].name,
                deviceId: deviceId,
                roomType: device.switches[switchId].roomType,
                state: device.switches_pinout_states[switchId],
              };
            }),
          };
        }
      );

      state.domeId = action.payload.dome;
      state.user.name = action.payload.name;
      state.user.uid = action.payload.userUid;
      state.devices = devices;
      state.members = members;
      state.user.isAdmin =
        members.find((m) => m.id === state.user.uid) !== undefined;
    });

    // Update username
    builder.addCase(updateUserName.fulfilled, (state, action) => {
      state.user.name = action.payload?.name;
    });

    // Update device name
    builder.addCase(updateDeviceName.fulfilled, (state, action) => {
      state.devices = state.devices.map((d) => {
        if (d.id === action.payload.deviceId) {
          return {
            ...d,
            name: action.payload.name,
          };
        } else return d;
      });
    });

    // Update switch name
    builder.addCase(updateSwitchName.fulfilled, (state, action) => {
      state.devices = state.devices.map((d) => {
        if (d.id !== action.payload.deviceId) return d;

        const switches = d.switches.map((s) => {
          if (s.id !== action.payload.switchId) return s;
          return {
            ...s,
            name: action.payload.name,
          };
        });
        return {
          ...d,
          switches,
        };
      });
    });

    // update switch room type
    builder.addCase(updateSwitchRoomType.fulfilled, (state, action) => {
      state.devices = state.devices.map((d) => {
        if (d.id !== action.payload.deviceId) return d;

        const switches = d.switches.map((s) => {
          if (s.id !== action.payload.switchId) return s;
          return {
            ...s,
            roomType: action.payload.roomType,
          };
        });
        return {
          ...d,
          switches,
        };
      });
    });
  },
});

export const { updateSwitchState } = domeSlice.actions;

export default domeSlice.reducer;
