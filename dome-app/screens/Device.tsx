import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Header } from "../components/Headers";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { UserStackParamList } from "../navigation/userStack";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { DomeSwitch } from "../redux/slices/dome";
import Prompt from "../components/Prompt";
import ToggleSwitch from "toggle-switch-react-native";
import { updateDeviceName } from "../redux/slices/domeThunk";

type DeviceScreenProp = StackNavigationProp<UserStackParamList, "Device">;
type DeviceScreenRouteProp = RouteProp<UserStackParamList, "Device">;

function MinimalisticSwitchCard({ domeSwitch }: { domeSwitch: DomeSwitch }) {
  const navigation = useNavigation<DeviceScreenProp>();
  const [isEnabled, setIsEnabled] = useState(domeSwitch.state);

  return (
    <View className="flex flex-row items-center justify-between px-6 py-2">
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("DeviceSwitch", {
            id: domeSwitch.id,
            deviceId: domeSwitch.deviceId,
          })
        }
      >
        <Text className="text-base">{domeSwitch.name}</Text>
      </TouchableOpacity>
      <ToggleSwitch
        isOn={isEnabled}
        onColor="black"
        offColor="#CBD5E0"
        onToggle={(isOn) => setIsEnabled(isOn)}
      />
    </View>
  );
}

export default function DeviceScreen() {
  const dispatch = useAppDispatch();
  const route = useRoute<DeviceScreenRouteProp>();
  const { id } = route.params;
  const devices = useAppSelector((state) => state.dome.devices);
  const device = devices.find((d) => d.id === id);
  const [promptName, setPromptName] = useState(false);

  return (
    <View className="bg-white">
      <Prompt
        title="Rename device"
        defaultValue={device?.name}
        visible={promptName}
        onSubmit={(val) => {
          dispatch(updateDeviceName({ deviceId: id, name: val }));
          setPromptName(false);
        }}
        onCancel={() => setPromptName(false)}
      />

      <Header title={device?.name || ""} />

      <TouchableOpacity
        className="px-6 py-4"
        onPress={() => setPromptName(true)}
      >
        <Text className="text-base font-medium">Name of the device</Text>
        <Text className="text-sm text-gray-500">{device?.name || ""}</Text>
      </TouchableOpacity>

      <View className="py-2 border-t border-b border-gray-200">
        {device?.switches.map((d) => (
          <MinimalisticSwitchCard key={d.id} domeSwitch={d} />
        ))}
      </View>

      <TouchableOpacity
        className="px-6 py-4"
        onPress={() => console.log("Prompt delete device confirmation")}
      >
        <Text className="text-base font-medium text-red-700">
          Delete device
        </Text>
      </TouchableOpacity>
    </View>
  );
}
