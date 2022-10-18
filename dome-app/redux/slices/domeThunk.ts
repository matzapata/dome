import { createAsyncThunk } from "@reduxjs/toolkit";
import { get, getDatabase, ref, update } from "firebase/database";
import { DomeState } from "./dome";

const db = getDatabase();

export const fetchUserData = createAsyncThunk(
  "domeThunk/getUserData",
  async (payload: { uid: string }) => {
    const user = await get(ref(db, "users/" + payload.uid));
    if (!user.exists()) throw new Error("Non existent user");

    const { name, dome } = user.val();
    if (dome === "") return { userUid: payload.uid, userName: name };

    const domeData = await get(ref(db, `domes/${dome}`));
    if (!domeData.exists()) throw new Error("Non existent dome");
    const { devices, members } = domeData.val();
    return {
      userUid: payload.uid,
      domeId: dome,
      userName: name,
      dbPayload: { devices, members },
    };
  }
);

export const updateUserName = createAsyncThunk(
  "domeThunk/updateUserName",
  async (payload: { name: string }, { getState }) => {
    const state = getState() as { dome: DomeState };
    if (!state.dome.user.uid) throw new Error("No authenticated user");

    await update(ref(db, `users/${state.dome.user.uid}`), {
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
    const domeId = state.dome.id;
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
    const domeId = state.dome.id;
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

export const updateSwitchRoom = createAsyncThunk(
  "domeThunk/updateSwitchRoom",
  async (
    payload: { deviceId: string; switchId: string; room: string },
    { getState }
  ) => {
    const state = getState() as { dome: DomeState };
    const userId = state.dome.user.uid;
    const domeId = state.dome.id;
    if (!userId) throw new Error("Missing user id");
    if (!domeId) throw new Error("Missing dome id");

    await update(
      ref(
        db,
        `domes/${domeId}/devices/${payload.deviceId}/switches/${payload.switchId}`
      ),
      { roomType: payload.room }
    );

    return {
      deviceId: payload.deviceId,
      switchId: payload.switchId,
      room: payload.room,
    };
  }
);

export const setSwitchState = createAsyncThunk(
  "domeThunk/setSwitchState",
  async (
    payload: { deviceId: string; switchId: string | number; state: boolean },
    { getState }
  ) => {
    const state = getState() as { dome: DomeState };
    const domeId = state.dome.id;
    if (domeId === null) throw new Error("Dome id is null");

    await update(
      ref(
        db,
        `domes/${domeId}/devices/${payload.deviceId}/switches/${payload.switchId}`
      ),
      { state: payload.state }
    );

    return { ...payload };
  }
);

export const joinDome = createAsyncThunk(
  "domeThunk/joinDome",
  async ({ domeId }: { domeId: string }, { getState }) => {
    const {
      dome: { user },
    } = getState() as { dome: DomeState };
    if (user.uid === null) throw new Error("User is not authenticated");

    await update(ref(db, `users/${user.uid}`), { dome: domeId });
    await update(ref(db, `domes/${domeId}/members`), {
      [user.uid]: { name: user.name, email: user.email, isAdmin: false },
    });

    const domeData = await get(ref(db, `domes/${domeId}`));
    if (!domeData.exists()) throw new Error("Non existent dome");
    const { devices, members } = domeData.val();

    return { domeId, dbPayload: { devices, members } };
  }
);
