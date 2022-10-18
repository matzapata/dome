import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Header } from "../components/Headers";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { UserStackParamList } from "../navigation/userStack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppSelector } from "../redux/store";
import Confirm from "../components/Confirm";
import { getAuth, signOut } from "firebase/auth";

type SettingsScreenProp = StackNavigationProp<UserStackParamList, "Settings">;

export default function SettingsScreen() {
  const auth = getAuth();
  const navigation = useNavigation<SettingsScreenProp>();
  const devices = useAppSelector((state) => state.dome.devices);
  const [confirmResetModal, setConfirmResetModal] = React.useState(false);

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
        onPress={() => navigation.navigate("Members")}
      >
        <Text className="text-base font-medium">Members</Text>
        <Text className="text-sm text-gray-500">
          Add or remove members from your dome
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="px-6 py-4"
        onPress={() => navigation.navigate("JoinDome")}
      >
        <Text className="text-base font-medium">Join a dome</Text>
        <Text className="text-sm text-gray-500">
          Join a dome to control it&apos;s devices
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="px-6 py-4"
        onPress={() => setConfirmResetModal(true)}
      >
        <Text className="text-base font-medium">Reset dome</Text>
        <Text className="text-sm text-gray-500">
          Revoke permissions and remove devices
        </Text>
      </TouchableOpacity>
      <Confirm
        title="Reset dome"
        message="If you reset your dome, you and everybody at your dome will lose access to the devices. "
        visible={confirmResetModal}
        onCancel={() => setConfirmResetModal(false)}
        onConfirm={() => {
          setConfirmResetModal(false);
          console.log("RESET DOME");
        }}
      />

      <View className="h-1 bg-gray-200" />

      <View className="px-6">
        <Text className="my-2 text-xs text-gray-500">AVAILABLE DEVICES</Text>
        <FlatList
          data={devices}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Device", { deviceId: item.id })
              }
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
        <TouchableOpacity
          className="flex flex-row items-center py-4"
          onPress={() => navigation.navigate("AddDevice")}
        >
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
