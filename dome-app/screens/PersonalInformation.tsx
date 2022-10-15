import React from "react";
import { Text, TextInput, View } from "react-native";
import { HeaderWithConfirmation } from "../components/Headers";

export default function PersonalInformationScreen() {
  return (
    <View>
      <HeaderWithConfirmation
        title="Personal information"
        onConfirmation={() => console.log("Confirmed")}
      />

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
    </View>
  );
}
