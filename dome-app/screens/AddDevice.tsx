import React from "react";
import { View, Text } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { Header } from "../components/Headers";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// const devices: any[] = [];
const devices: any[] = ["Dome xx12", "Dome aabc"];

export default function AddDevice() {
  return (
    <View className="bg-white">
      <Header title="Add a device" />
      <View className="px-6 py-5">
        <Text>
          Reset the device and keep the button pressed to enter setup mode
        </Text>
      </View>
      <View className="h-1 bg-gray-200" />
      <View>
        <Text className="px-6 py-3 text-xs text-gray-500">
          AVAILABLE DEVICES
        </Text>
        {devices.length === 0 && (
          <Text className="p-6 text-base text-gray-700">Searching...</Text>
        )}
        <FlatList
          data={devices}
          renderItem={({ item }) => (
            <TouchableOpacity className="flex flex-row px-6 py-4 space-x-4">
              <MaterialCommunityIcons
                name="lightbulb-on"
                size={20}
                color="#A0AEC0"
              />
              <Text className="text-base">{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}
