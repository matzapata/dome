import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserStackParamList } from "../navigation/userStack";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAppSelector } from "../redux/store";
import SwitchCard from "../components/SwitchCard";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-root-toast";
import Screen from "../components/Screen";

type HomeScreenProp = StackNavigationProp<UserStackParamList, "Home">;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenProp>();
  const devices = useAppSelector((state) => state.dome.devices);
  const switches = useAppSelector((state) => state.dome.switches);
  const username = useAppSelector((state) => state.dome.user.name);
  const isAdmin = useAppSelector((state) => state.dome.user.isAdmin);
  const domeId = useAppSelector((state) => state.dome.id);

  return (
    <Screen>
      <ScrollView className="bg-white">
        <View className="p-6 bg-[#0F0F0F]">
          <Text className="text-2xl font-bold text-white">
            Hi {username} 👋
          </Text>
          <Text className="text-white">Welcome to your dome</Text>

          <View className="flex flex-row mt-4 space-x-6">
            <TouchableOpacity
              className="bg-[#27292D] flex-1 rounded-full py-3"
              onPress={() => navigation.navigate("Settings")}
            >
              <Text className="text-center text-white">Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-[#27292D] flex-1 rounded-full py-3"
              onPress={() => {
                if (!isAdmin && domeId !== "") {
                  Toast.show("Only admin can add devices");
                } else navigation.navigate("AddDevice");
              }}
            >
              <Text className="text-center text-white">Add device</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="p-6">
          {devices.map((d) => (
            <View key={d.id} className="mb-2">
              <Text className="mb-2 text-xs font-medium text-gray-500 uppercase">
                {d.name}
              </Text>
              {switches
                .filter((s) => s.deviceId === d.id)
                .map((s) => (
                  <SwitchCard domeSwitch={s} key={s.id} />
                ))}
            </View>
          ))}
        </View>

        {devices.length === 0 && (
          <View className="p-6">
            <Text className="text-xl font-bold text-center">
              You haven&apos;t add any smart device to this dome yet.
            </Text>
            <Text className="mx-4 mt-2 text-center">
              If someone else connected the devices already, join them
            </Text>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
