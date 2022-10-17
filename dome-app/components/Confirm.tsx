import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function Confirm({
  title,
  message,
  visible,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!visible) return null;
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      className={
        "absolute flex flex-1 justify-center left-0 top-0 w-screen h-screen z-50"
      }
    >
      <View className="m-2 mb-8 space-y-4 bg-white rounded-xl">
        <Text className="p-6 text-lg font-bold text-gray-900">{title}</Text>

        <Text className="px-6">{message}</Text>

        <View className="flex flex-row">
          <TouchableOpacity className="flex-1 py-6" onPress={() => onCancel()}>
            <Text className="text-sm font-medium text-center text-blue-500 uppercase border-r border-gray-200">
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 py-6" onPress={() => onConfirm()}>
            <Text className="text-sm font-medium text-center text-blue-500 uppercase">
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
