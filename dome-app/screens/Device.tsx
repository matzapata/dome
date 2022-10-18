import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Header } from "../components/Headers";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { UserStackParamList } from "../navigation/userStack";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { DomeDevice, DomeSwitch } from "../redux/slices/dome";
import Prompt from "../components/Prompt";
import { updateDeviceName } from "../redux/slices/domeThunk";
import { Switch } from "../components/DeviceSwitch";
import Toast from "react-native-root-toast";
import Screen from "../components/Screen";

type DeviceScreenProp = StackNavigationProp<UserStackParamList, "Device">;
type DeviceScreenRouteProp = RouteProp<UserStackParamList, "Device">;

function MinimalisticSwitchCard({ domeSwitch }: { domeSwitch: DomeSwitch }) {
  const navigation = useNavigation<DeviceScreenProp>();

  return (
    <View className="flex flex-row items-center justify-between px-6 py-2">
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("DeviceSwitch", {
            switchId: domeSwitch.id,
            deviceId: domeSwitch.deviceId,
          })
        }
      >
        <Text className="text-base">{domeSwitch.name}</Text>
      </TouchableOpacity>
      <Switch deviceId={domeSwitch.deviceId} switchId={domeSwitch.id} />
    </View>
  );
}

export default function DeviceScreen() {
  const dispatch = useAppDispatch();
  const route = useRoute<DeviceScreenRouteProp>();
  const devices = useAppSelector((state) => state.dome.devices);
  const switches = useAppSelector((state) => state.dome.switches);
  const isAdmin = useAppSelector((state) => state.dome.user.isAdmin);
  const [promptName, setPromptName] = useState(false);

  const { deviceId } = route.params;
  const device = devices.find((d) => d.id === deviceId) as DomeDevice;

  return (
    <Screen>
      <View className="bg-white">
        <Prompt
          title="Rename device"
          defaultValue={device.name}
          visible={promptName}
          onSubmit={(name) => {
            dispatch(updateDeviceName({ deviceId, name }));
            setPromptName(false);
          }}
          onCancel={() => setPromptName(false)}
        />

        <Header title={device.name} />

        <TouchableOpacity
          className="px-6 py-4"
          onPress={() => {
            if (!isAdmin) {
              Toast.show("Only admin can edit device name ");
            } else setPromptName(true);
          }}
        >
          <Text className="text-base font-medium">Name of the device</Text>
          <Text className="text-sm text-gray-500">{device.name}</Text>
        </TouchableOpacity>

        <View className="py-2 border-t border-b border-gray-200">
          {switches
            .filter((s) => s.deviceId === deviceId)
            .map((d) => (
              <MinimalisticSwitchCard key={d.id} domeSwitch={d} />
            ))}
        </View>

        <TouchableOpacity
          className="px-6 py-4"
          onPress={() => {
            if (!isAdmin) {
              Toast.show("Only admin can delete device");
            }
          }}
        >
          <Text className="text-base font-medium text-red-700">
            Delete device
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}
