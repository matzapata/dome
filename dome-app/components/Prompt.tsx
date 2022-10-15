import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function Prompt({
  title,
  placeholder,
  defaultValue,
  visible,
  onCancel,
  onSubmit,
}: {
  title: string;
  placeholder?: string;
  defaultValue?: string;
  visible: boolean;
  onCancel: () => void;
  onSubmit: (value: string) => void;
}) {
  if (!visible) return null;
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      className={
        "absolute flex flex-1  justify-end left-0 top-0 w-screen h-screen z-50"
      }
    >
      <View className="p-5 m-2 mb-8 bg-white rounded-xl">
        <Text className="mb-4 text-lg font-bold">{title}</Text>
        <TextInput
          autoFocus
          placeholder={placeholder}
          defaultValue={defaultValue}
          className="py-2 border-b-2 border-blue-500"
        />
        <View className="flex flex-row mt-4">
          <TouchableOpacity className="flex-1 py-2" onPress={() => onCancel()}>
            <Text className="text-sm font-medium text-center text-blue-500 uppercase border-r border-gray-200">
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 py-2"
            onPress={() => onSubmit("val")}
          >
            <Text className="text-sm font-medium text-center text-blue-500 uppercase">
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
