import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { UserStackParamList } from "../navigation/userStack";
import { useAppDispatch, useAppSelector } from "../redux/store";
import Prompt from "../components/Prompt";
import Ionicons from "@expo/vector-icons/Ionicons";
import { updateSwitchName } from "../redux/slices/domeThunk";
import { Switch } from "../components/DeviceSwitch";

type DeviceSwitchScreenProp = StackNavigationProp<
  UserStackParamList,
  "DeviceSwitch"
>;
type DeviceScreenRouteProp = RouteProp<UserStackParamList, "DeviceSwitch">;

export default function DeviceSwitchScreen() {
  const navigation = useNavigation<DeviceSwitchScreenProp>();
  const route = useRoute<DeviceScreenRouteProp>();
  const { id, deviceId } = route.params;
  const devices = useAppSelector((state) => state.dome.devices);
  const device = devices.find((d) => d.id === deviceId);
  const devSwitch = device?.switches.find((s) => s.id === id);
  const [promptName, setPromptName] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <View className="bg-white">
      <Prompt
        title="Change switch name"
        defaultValue={devSwitch?.name}
        visible={promptName}
        onSubmit={(val) => {
          setPromptName(false);
          dispatch(
            updateSwitchName({ deviceId: deviceId, switchId: id, name: val })
          );
        }}
        onCancel={() => setPromptName(false)}
      />

      {/* Header */}
      <View>
        <View className="flex flex-row px-4 py-5">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text className="ml-5 text-lg font-bold text-gray-900">
            {devSwitch?.name}
          </Text>
        </View>
        <View className="flex flex-row justify-between px-6 pb-2">
          {devSwitch?.state ? (
            <Text className="text-sm text-gray-600 uppercase">active</Text>
          ) : (
            <Text className="text-sm text-gray-600 uppercase">inactive</Text>
          )}
          <Switch devSwitch={devSwitch} />
        </View>
        <View className="h-1 bg-gray-200" />
      </View>

      <TouchableOpacity
        className="px-6 py-4"
        onPress={() => setPromptName(true)}
      >
        <Text className="text-base font-medium">Name of the switch</Text>
        <Text className="text-sm text-gray-500">{devSwitch?.name || ""}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="px-6 py-4"
        onPress={() =>
          navigation.navigate("RoomType", {
            deviceId,
            switchId: id,
          })
        }
      >
        <Text className="text-base font-medium">Room type</Text>
        <Text className="text-sm text-gray-500">
          {devSwitch?.roomType || ""}
        </Text>
      </TouchableOpacity>

      <View className="px-6 py-4">
        <Text className="text-base font-medium">Device</Text>
        <Text className="text-sm text-gray-500">{device?.name || ""}</Text>
      </View>
    </View>
  );
}
