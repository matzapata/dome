import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { AuthStackParamList } from "../../navigation/authStack";
import Ionicons from "@expo/vector-icons/Ionicons";

type ForgotPasswordScreenProp = StackNavigationProp<
  AuthStackParamList,
  "ForgotPassword"
>;

export default function ForgotPassword() {
  const navigation = useNavigation<ForgotPasswordScreenProp>();

  return (
    <View>
      <View>
        <View className="w-full px-4 my-24">
          <Text className="text-3xl font-extrabold">Forgot password</Text>
          <Text className="text-gray-500">to your dome</Text>
        </View>

        <View className="px-4">
          <TextInput
            className="px-4 py-3 mb-4 bg-gray-200 rounded-md"
            placeholder="Email"
          />

          <TouchableOpacity className="py-4 mb-2 bg-black rounded-md">
            <Text className="font-medium text-center text-white">
              Reset password
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex flex-row items-center justify-center mt-4"
            onPress={() => navigation.navigate("SignIn")}
          >
            <Ionicons name="arrow-back" size={20} color="#4A5568" />
            <Text className="ml-2 font-medium text-center text-gray-600">
              Back to login
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
