import React, { useState } from "react";
import { Switch, Text, TouchableOpacity, View } from "react-native";
import { Header } from "../components/Headers";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { UserStackParamList } from "../navigation/userStack";
import { useAppSelector } from "../redux/store";
import Prompt from "../components/Prompt";
import Ionicons from "@expo/vector-icons/Ionicons";
import ToggleSwitch from "toggle-switch-react-native";

type DeviceSwitchScreenProp = StackNavigationProp<
  UserStackParamList,
  "DeviceSwitch"
>;
type DeviceScreenRouteProp = RouteProp<UserStackParamList, "DeviceSwitch">;

export default function DeviceSwitchScreen() {
  const navigate = useNavigation<DeviceSwitchScreenProp>();
  const route = useRoute<DeviceScreenRouteProp>();
  const { id, deviceId } = route.params;
  const devices = useAppSelector((state) => state.dome.devices);
  const device = devices.find((d) => d.id === deviceId);
  const devSwitch = device?.switches.find((s) => s.id === id);
  const [promptName, setPromptName] = useState(false);

  return (
    <View>
      <Prompt
        title="Change switch name"
        defaultValue={device?.name}
        visible={promptName}
        onSubmit={(val) => {
          setPromptName(false);
          console.log(val);
        }}
        onCancel={() => setPromptName(false)}
      />

      {/* Header */}
      <View>
        <View className="flex flex-row px-4 py-5">
          <TouchableOpacity onPress={() => navigate.goBack()}>
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
          <ToggleSwitch
            isOn={!!devSwitch?.state}
            onColor="black"
            offColor="#CBD5E0"
            onToggle={(isOn) => console.log("toggle")}
          />
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
        onPress={() => setPromptName(true)}
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
