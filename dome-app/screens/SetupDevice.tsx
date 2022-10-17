import React from "react";
import { Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { UserStackParamList } from "../navigation/userStack";
import { StackNavigationProp } from "@react-navigation/stack";

type SetupDeviceScreenProp = StackNavigationProp<
  UserStackParamList,
  "SetupDevice"
>;

export default function SetupDevice() {
  const navigation = useNavigation<SetupDeviceScreenProp>();

  React.useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        if (e.data.action.type === "GO_BACK") e.preventDefault();
      }),
    [navigation]
  );

  return (
    <View className="bg-white">
      <View>
        <View className="flex flex-row items-center justify-between px-4 py-5">
          <View className="flex flex-row">
            <Text className="text-lg font-bold text-gray-900">
              Setup device
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Ionicons name="checkmark" size={24} color="#0f172a" />
          </TouchableOpacity>
        </View>
        <View className="h-1 bg-gray-200" />
      </View>

      <View className="p-6">
        <TextInput
          placeholder="Name"
          className="py-2 border-b border-gray-300"
        />
        <Text className="mt-2 text-gray-500">
          The name of the device must be unique and has a maximum size of 8
          characters
        </Text>
      </View>

      <View className="h-1 bg-gray-200" />

      <View className="p-6">
        <TextInput
          placeholder="Switch 1 name"
          className="py-2 border-b border-gray-300"
        />
        <TextInput
          placeholder="Switch 2 name"
          className="py-2 border-b border-gray-300"
        />
        <TextInput
          placeholder="Switch 3 name"
          className="py-2 border-b border-gray-300"
        />
        <TextInput
          placeholder="Switch 4 name"
          className="py-2 border-b border-gray-300"
        />
      </View>
    </View>
  );
}
