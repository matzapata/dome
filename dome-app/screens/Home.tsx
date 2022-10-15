import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserStackParamList } from "../navigation/userStack";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAppSelector } from "../redux/store";
import SwitchCard from "../components/SwitchCard";

type HomeScreenProp = StackNavigationProp<UserStackParamList, "Home">;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenProp>();
  const devices = useAppSelector((state) => state.dome.devices);

  return (
    <View>
      <View className="p-6 bg-black">
        <Text className="text-2xl font-bold text-white">Hi Matias 👋</Text>
        <Text className="text-white">Welcome to your dome</Text>

        <View className="flex flex-row mt-4 space-x-6">
          <TouchableOpacity
            className="bg-[#27292D] flex-1 rounded-full py-3"
            onPress={() => navigation.navigate("Settings")}
          >
            <Text className="text-center text-white">Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-[#27292D] flex-1 rounded-full py-3">
            <Text className="text-center text-white">Add device</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={devices}
        renderItem={({ item }) => (
          <View className="p-6">
            <Text className="mb-2 text-xs text-gray-500 uppercase">
              {item.name}
            </Text>
            <FlatList
              data={item.switches}
              renderItem={({ item }) => <SwitchCard domeSwitch={item} />}
              keyExtractor={(s) => s.id}
            />
          </View>
        )}
        keyExtractor={(d) => d.id}
      />

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
    </View>
  );
}
