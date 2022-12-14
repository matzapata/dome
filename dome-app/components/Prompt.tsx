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
  secureTextEntry,
}: {
  title: string;
  placeholder?: string;
  defaultValue?: string;
  visible: boolean;
  onCancel: () => void;
  onSubmit: (value: string) => void;
  secureTextEntry?: boolean;
}) {
  const [state, setState] = React.useState(defaultValue ? defaultValue : "");

  if (!visible) return null;
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      className={
        "absolute flex flex-1 justify-end left-0 top-0 w-screen h-screen z-50"
      }
    >
      <View className="m-2 mb-8 space-y-4 bg-white rounded-xl">
        <Text className="p-6 text-lg font-bold text-gray-900">{title}</Text>
        <TextInput
          autoFocus
          placeholder={placeholder}
          value={state}
          secureTextEntry={secureTextEntry}
          onChangeText={(text) => setState(text)}
          className="mx-6 border-b-2 border-blue-500"
        />
        <View className="flex flex-row">
          <TouchableOpacity className="flex-1 py-6" onPress={() => onCancel()}>
            <Text className="text-sm font-medium text-center text-blue-500 uppercase border-r border-gray-200">
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 py-6"
            onPress={() => onSubmit(state)}
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
