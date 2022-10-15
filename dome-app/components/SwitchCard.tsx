import React, { useState } from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { DomeSwitch } from "../redux/slices/dome";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ToggleSwitch from "toggle-switch-react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { UserStackParamList } from "../navigation/userStack";

type HomeScreenProp = StackNavigationProp<UserStackParamList, "Home">;

export default function SwitchCard({ domeSwitch }: { domeSwitch: DomeSwitch }) {
  const [isEnabled, setIsEnabled] = useState(domeSwitch.state);
  const navigation = useNavigation<HomeScreenProp>();

  return (
    <View
      className={`${
        isEnabled
          ? "bg-[#AFD4F7] border-[#80c1ff]"
          : " border-gray-100 bg-[#F6F8FA]"
      } flex flex-row items-center border justify-between px-3 py-6 mb-2 rounded-md`}
    >
      <TouchableOpacity
        className="flex flex-row items-center"
        onPress={() =>
          navigation.navigate("DeviceSwitch", {
            id: domeSwitch.id,
            deviceId: domeSwitch.deviceId,
          })
        }
      >
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
          } text-base font-medium`}
        >
          {domeSwitch.name}
        </Text>
      </TouchableOpacity>
      <ToggleSwitch
        isOn={isEnabled}
        onColor="black"
        offColor="#CBD5E0"
        onToggle={(isOn) => setIsEnabled(isOn)}
      />
    </View>
  );
}
