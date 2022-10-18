import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import ToggleSwitch from "toggle-switch-react-native";
import { DomeSwitch, updateSwitchState } from "../redux/slices/dome";
import { setSwitchStatus } from "../redux/slices/domeThunk";
import { useAppDispatch, useAppSelector } from "../redux/store";

const db = getDatabase();

export const Switch = ({ devSwitch }: { devSwitch?: DomeSwitch }) => {
  if (devSwitch === undefined) return null;

  const dispatch = useAppDispatch();
  const [val, setVal] = useState(!!devSwitch.state);
  const domeId = useAppSelector((state) => state.dome.domeId);

  useEffect(() => {
    const switchRef = ref(
      db,
      `domes/${domeId}/devices/${devSwitch.deviceId}/switches_pinout_states/${devSwitch.id}`
    );
    const unsubscribe = onValue(switchRef, (snapshot) => {
      console.log("snapshot", snapshot);
      setVal(!!snapshot);
      dispatch(
        updateSwitchState({
          deviceId: devSwitch.deviceId,
          switchId: devSwitch.id,
          state: !!snapshot,
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
        // setVal(isOn);
        dispatch(
          setSwitchStatus({
            deviceId: devSwitch.deviceId,
            switchId: devSwitch.id,
            state: isOn,
          })
        );
      }}
    />
  );
};
