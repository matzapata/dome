import React from "react";
import { View, ActivityIndicator } from "react-native";

export default function Loading() {
  return (
    <View className="flex items-center justify-center flex-1">
      <ActivityIndicator size="large" color="#6646ee" />
    </View>
  );
}
