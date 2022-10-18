import React from "react";
import { View, Text } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { Header } from "../components/Headers";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { UserStackParamList } from "../navigation/userStack";
import Screen from "../components/Screen";

// const devices: any[] = [];
const devices: any[] = ["Dome xx12", "Dome aabc"];

type AddDeviceScreenProp = StackNavigationProp<UserStackParamList, "AddDevice">;

export default function AddDevice() {
  const navigation = useNavigation<AddDeviceScreenProp>();

  return (
    <Screen>
      <View className="bg-white">
        <Header title="Add a device" />
        <View className="px-6 py-5">
          <Text>
            1. Reset the device and keep the button pressed to enter setup mode
          </Text>
        </View>
        <View className="h-1 bg-gray-200" />
        <View className="px-6 py-5">
          <Text>
            2. Connect your phone to the wifi network created by the device.
            Then press continue
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("SetupDeviceWifiNetwork")}
            className="py-4 mt-6 mb-2 bg-black rounded-md"
          >
            <Text className="font-medium text-center text-white">Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}
