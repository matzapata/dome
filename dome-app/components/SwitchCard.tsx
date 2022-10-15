import React, { useState } from "react";
import { Switch, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { DomeSwitch } from "../redux/slices/dome";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SwitchCard({ domeSwitch }: { domeSwitch: DomeSwitch }) {
  const [isEnabled, setIsEnabled] = useState(domeSwitch.state);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View
      className={`${
        isEnabled
          ? "bg-[#AFD4F7] border-[#80c1ff]"
          : " border-gray-300 bg-gray-200"
      } flex flex-row items-center border justify-between px-3 py-3  rounded-md`}
    >
      <TouchableOpacity className="flex flex-row items-center">
        <View className="px-2 mr-2">
          <MaterialCommunityIcons
            name="lightbulb-on"
            size={20}
            color={isEnabled ? "#2D3748" : "#8E9296"}
          />
        </View>
        <Text
          className={`${
            isEnabled ? "text-gray-700" : "text-[#64686C]"
          } text-base`}
        >
          {domeSwitch.name}
        </Text>
      </TouchableOpacity>
      <Switch
        trackColor={{ false: "#767577", true: "#2D3748" }}
        thumbColor={isEnabled ? "#FFFFFF" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
}
