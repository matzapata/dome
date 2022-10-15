import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { Header } from "../components/Headers";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { UserStackParamList } from "../navigation/userStack";
import ResetDomeConfirmation from "../components/ResetDomeConfirmation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppSelector } from "../redux/store";

type SettingsScreenProp = StackNavigationProp<UserStackParamList, "Settings">;
const auth = getAuth();

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenProp>();
  const devices = useAppSelector((state) => state.dome.devices);

  return (
    <View className="bg-white">
      <Header title="Settings" />

      <TouchableOpacity
        className="px-6 py-4"
        onPress={() => navigation.navigate("PersonalInformation")}
      >
        <Text className="text-base font-medium">Personal information</Text>
        <Text className="text-sm text-gray-500">Edit your personal data</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="px-6 py-4"
        onPress={() => navigation.navigate("People")}
      >
        <Text className="text-base font-medium">People</Text>
        <Text className="text-sm text-gray-500">
          Add or remove people from your dome
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="px-6 py-4" onPress={ResetDomeConfirmation}>
        <Text className="text-base font-medium">Reset dome</Text>
        <Text className="text-sm text-gray-500">
          Revoke permissions and remove devices
        </Text>
      </TouchableOpacity>

      <View className="h-1 bg-gray-200" />

      <View className="px-6">
        <Text className="my-2 text-xs text-gray-500">AVAILABLE DEVICES</Text>
        <FlatList
          data={devices}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Device", { id: item.id })}
              className="flex flex-row justify-between py-4"
            >
              <View className="flex flex-row items-center">
                <MaterialCommunityIcons
                  name="lightbulb-on"
                  size={20}
                  color="#718096"
                />
                <Text className="ml-4 text-base font-medium text-gray-600">
                  {item.name}
                </Text>
              </View>

              <Ionicons name="settings-outline" size={20} color="#718096" />
            </TouchableOpacity>
          )}
          keyExtractor={(d) => d.id}
        />
        <TouchableOpacity className="flex flex-row items-center py-4">
          <Ionicons name="add" size={24} color="#3182CE" />
          <Text className="ml-4 font-medium text-blue-500">Add device</Text>
        </TouchableOpacity>
      </View>

      <View className="h-1 bg-gray-200" />

      <TouchableOpacity className="px-6 py-4" onPress={() => signOut(auth)}>
        <Text className="text-base font-medium text-blue-500">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
