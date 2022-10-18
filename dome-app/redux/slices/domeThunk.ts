import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { get, getDatabase, ref, set, update } from "firebase/database";
import { DomeState } from "./dome";

const auth = getAuth();
const db = getDatabase();

export const signUp = createAsyncThunk(
  "domeThunk/signUp",
  async (
    payload: {
      email: string;
      password: string;
      name: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        payload.email,
        payload.password
      );
      await set(ref(db, "users/" + user.user.uid), {
        name: payload.name,
        dome: "",
      });
      return { uid: user.user.uid, name: payload.name };
    } catch (e: any) {
      return rejectWithValue(e.code);
    }
  }
);

export const signIn = createAsyncThunk(
  "domeThunk/signIn",
  async (
    payload: {
      email: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      await signInWithEmailAndPassword(auth, payload.email, payload.password);
      return { uid: auth.currentUser?.uid };
    } catch (e: any) {
      return rejectWithValue(e.code);
    }
  }
);

export const logOut = createAsyncThunk("domeThunk/signOut", async () => {
  await signOut(auth);
});

export const getUserData = createAsyncThunk(
  "domeThunk/getUserData",
  async (payload: { uid: string }) => {
    const user = await get(ref(db, "users/" + payload.uid));
    if (!user.exists()) throw new Error("Non existent user");

    const { name, dome } = user.val();
    if (dome === "") return { userUid: payload.uid, name };

    const domeData = await get(ref(db, "domes/" + dome));
    if (!domeData.exists()) throw new Error("Non existent dome");
    const { devices, members } = domeData.val();
    return { userUid: payload.uid, dome, name, devices, members };
  }
);

export const updateUserName = createAsyncThunk(
  "domeThunk/updateUserName",
  async (payload: { name: string }) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("No authenticated user");

    await update(ref(db, "users/" + userId), {
      name: payload.name,
    });

    return { name: payload.name };
  }
);

export const updateDeviceName = createAsyncThunk(
  "domeThunk/updateDeviceName",
  async (payload: { deviceId: string; name: string }, { getState }) => {
    const state = getState() as { dome: DomeState };

    const userId = state.dome.user.uid;
    const domeId = state.dome.domeId;
    if (!userId) throw new Error("Missing user id");
    if (!domeId) throw new Error("Missing dome id");

    await update(ref(db, `domes/${domeId}/devices/${payload.deviceId}`), {
      name: payload.name,
    });

    return { deviceId: payload.deviceId, name: payload.name };
  }
);

export const updateSwitchName = createAsyncThunk(
  "domeThunk/updateSwitchName",
  async (
    payload: { deviceId: string; switchId: string; name: string },
    { getState }
  ) => {
    const state = getState() as { dome: DomeState };

    const userId = state.dome.user.uid;
    const domeId = state.dome.domeId;
    if (!userId) throw new Error("Missing user id");
    if (!domeId) throw new Error("Missing dome id");

    await update(
      ref(
        db,
        `domes/${domeId}/devices/${payload.deviceId}/switches/${payload.switchId}`
      ),
      {
        name: payload.name,
      }
    );

    return {
      deviceId: payload.deviceId,
      switchId: payload.switchId,
      name: payload.name,
    };
  }
);

export const updateSwitchRoomType = createAsyncThunk(
  "domeThunk/updateSwitchRoomType",
  async (
    payload: { deviceId: string; switchId: string; roomType: string },
    { getState }
  ) => {
    const state = getState() as { dome: DomeState };

    const userId = state.dome.user.uid;
    const domeId = state.dome.domeId;
    if (!userId) throw new Error("Missing user id");
    if (!domeId) throw new Error("Missing dome id");

    await update(
      ref(
        db,
        `domes/${domeId}/devices/${payload.deviceId}/switches/${payload.switchId}`
      ),
      {
        roomType: payload.roomType,
      }
    );

    return {
      deviceId: payload.deviceId,
      switchId: payload.switchId,
      roomType: payload.roomType,
    };
  }
);

export const setSwitchStatus = createAsyncThunk(
  "domeThunk/setSwitchStatus",
  async (
    payload: { deviceId: string; switchId: string; state: boolean },
    { getState }
  ) => {
    const state = getState() as { dome: DomeState };
    const domeId = state.dome.domeId;
    if (domeId === null) throw new Error("Dome id is null");

    await update(
      ref(
        db,
        `domes/${domeId}/devices/${payload.deviceId}/switches_pinout_states`
      ),
      {
        [payload.switchId]: payload.state ? 1 : 0,
      }
    );

    return { ...payload };
  }
);
