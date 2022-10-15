import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export function Header({ title }: { title: string }) {
  const navigate = useNavigation();
  return (
    <View>
      <View className="flex flex-row px-4 py-5">
        <TouchableOpacity onPress={() => navigate.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="ml-5 text-lg font-bold text-gray-900">{title}</Text>
      </View>
      <View className="h-1 bg-gray-200" />
    </View>
  );
}

export function HeaderWithConfirmation({
  title,
  onConfirmation,
}: {
  title: string;
  onConfirmation: () => void;
}) {
  const navigate = useNavigation();
  return (
    <View>
      <View className="flex flex-row items-center justify-between px-4 py-5">
        <View className="flex flex-row">
          <TouchableOpacity onPress={() => navigate.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text className="ml-5 text-lg font-bold text-gray-900">{title}</Text>
        </View>
        <TouchableOpacity onPress={() => onConfirmation()}>
          <Ionicons name="checkmark" size={24} color="#0f172a" />
        </TouchableOpacity>
      </View>
      <View className="h-1 bg-gray-200" />
    </View>
  );
}
