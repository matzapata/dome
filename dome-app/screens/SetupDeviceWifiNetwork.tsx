import React from "react";
import { View, Text } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { Header } from "../components/Headers";

import { StackNavigationProp } from "@react-navigation/stack";
import { UserStackParamList } from "../navigation/userStack";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Prompt from "../components/Prompt";

// const networks: any[] = [];
const networks: any[] = ["Fibertel 123", "6B011B"];

type SetupDeviceWifiNetworkScreenProp = StackNavigationProp<
  UserStackParamList,
  "Settings"
>;

export default function SetupDeviceWifiNetwork() {
  const navigation = useNavigation<SetupDeviceWifiNetworkScreenProp>();
  const [ssid, setSsid] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [promptPassword, setPromptPassword] = React.useState(false);

  return (
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
        onCancel={() => setPromptPassword(false)}
        onSubmit={(val) => {
          setPassword(val);
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
    </View>
  );
}
