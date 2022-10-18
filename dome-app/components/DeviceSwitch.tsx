import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import ToggleSwitch from "toggle-switch-react-native";
import { DomeSwitch, updateSwitchState } from "../redux/slices/dome";
import { setSwitchState } from "../redux/slices/domeThunk";
import { useAppDispatch, useAppSelector } from "../redux/store";

const db = getDatabase();

export const Switch = ({
  switchId,
  deviceId,
}: {
  switchId: string | number;
  deviceId: string;
}) => {
  const dispatch = useAppDispatch();
  const domeId = useAppSelector((state) => state.dome.id);
  const switches = useAppSelector((state) => state.dome.switches);
  const devSwitch = switches.find(
    (s) => s.id === switchId && s.deviceId === deviceId
  ) as DomeSwitch;

  useEffect(() => {
    const switchRef = ref(
      db,
      `domes/${domeId}/devices/${deviceId}/switches/${switchId}/state`
    );
    const unsubscribe = onValue(switchRef, (snapshot) => {
      console.log("snapshot", snapshot.val());
      dispatch(
        updateSwitchState({
          deviceId,
          switchId,
          state: snapshot.val(),
        })
      );
    });
    return () => unsubscribe();
  }, [domeId]);

  return (
    <ToggleSwitch
      isOn={devSwitch.state}
      onColor="black"
      offColor="#CBD5E0"
      onToggle={(isOn) => {
        dispatch(
          setSwitchState({
            deviceId,
            switchId,
            state: isOn,
          })
        );
      }}
    />
  );
};
