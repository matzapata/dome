import React from "react";
import { View, Text, Modal } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { Header } from "../components/Headers";

import { StackNavigationProp } from "@react-navigation/stack";
import { UserStackParamList } from "../navigation/userStack";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Prompt from "../components/Prompt";
import Screen from "../components/Screen";

// const networks: any[] = [];
const networks: any[] = ["Fibertel 123", "6B011B"];

type SetupDeviceWifiNetworkScreenProp = StackNavigationProp<
  UserStackParamList,
  "SetupDeviceWifiNetwork"
>;

export default function SetupDeviceWifiNetwork() {
  const [ssid, setSsid] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [promptPassword, setPromptPassword] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);

  return (
    <Screen>
      <View className="bg-white">
        <Header title="Setup wifi connection" />

        <View className="h-1 bg-gray-200" />

        <Text className="px-6 py-3 text-xs text-gray-500">
          AVAILABLE NETWORKS
        </Text>
        {networks.length === 0 && (
          <Text className="p-6 text-base text-gray-700">Searching...</Text>
        )}
        <Prompt
          title="Network password"
          visible={promptPassword}
          secureTextEntry={true}
          onCancel={() => setPromptPassword(false)}
          onSubmit={(val) => {
            setPassword(val);
            setPromptPassword(false);
            setSuccess(true);
          }}
        />

        <FlatList
          data={networks}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="flex flex-row px-6 py-4 space-x-4"
              onPress={() => {
                setSsid(item);
                setPromptPassword(true);
              }}
            >
              <Ionicons name="wifi" size={20} color="#A0AEC0" />
              <Text className="text-base">{item}</Text>
            </TouchableOpacity>
          )}
        />
        {success && <SuccessOverlay />}
        {error && <ErrorOverlay />}
      </View>
    </Screen>
  );
}

function SuccessOverlay() {
  const navigation = useNavigation<SetupDeviceWifiNetworkScreenProp>();
  return (
    <View
      className="absolute top-0 left-0 flex justify-end w-screen h-screen"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <View className="m-2 space-y-4 bg-white rounded-2xl">
        <Text className="p-6 text-lg font-bold text-center text-gray-900">
          Success
        </Text>
        <View className="flex flex-row justify-center my-4">
          <Ionicons name="checkmark-circle" size={60} color="#38A169" />
        </View>
        <Text className="px-6 text-base leading-5 text-center text-gray-800">
          Please reset the device and set up it&apos;s name and location.
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SetupDevice")}>
          <Text className="p-6 text-sm font-medium text-center text-blue-500 uppercase">
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ErrorOverlay() {
  const navigation = useNavigation<SetupDeviceWifiNetworkScreenProp>();
  return (
    <View
      className="absolute top-0 left-0 flex justify-end w-screen h-screen"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <View className="m-2 space-y-4 bg-white rounded-2xl">
        <Text className="p-6 text-lg font-bold text-center text-gray-900">
          Error
        </Text>
        <View className="flex flex-row justify-center my-4">
          <Ionicons name="close-circle" size={50} color="#E53E3E" />
        </View>
        <Text className="px-6 text-base leading-5 text-center text-gray-800">
          Please try again
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text className="p-6 text-sm font-medium text-center text-blue-500 uppercase">
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
