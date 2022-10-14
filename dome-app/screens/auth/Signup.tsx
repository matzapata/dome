import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { Text, View, TextInput, TouchableOpacity, Image } from "react-native";
import { AuthStackParamList } from "../../navigation/authStack";

type SignUpScreenProp = StackNavigationProp<AuthStackParamList, "SignUp">;

export default function SignUp() {
  const navigation = useNavigation<SignUpScreenProp>();

  return (
    <View>
      <View className="flex flex-col justify-between h-full ">
        <View>
          <View className="w-full px-4 my-24">
            <Text className="text-3xl font-extrabold">Sign up</Text>
            <Text className="text-gray-500">to your dome</Text>
          </View>

          <View className="px-4">
            <TextInput
              className="px-4 py-3 mb-4 bg-gray-200 rounded-md"
              placeholder="Name"
            />
            <TextInput
              className="px-4 py-3 mb-4 bg-gray-200 rounded-md"
              placeholder="Email"
            />
            <TextInput
              secureTextEntry={true}
              className="px-4 py-3 mb-2 bg-gray-200 rounded-md"
              placeholder="Password"
            />

            <TouchableOpacity className="py-4 mt-6 mb-2 bg-black rounded-md">
              <Text className="font-medium text-center text-white">
                Continue
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
              <Text className="text-center">
                Already have an account?{" "}
                <Text className="font-bold">Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="p-4">
          <View className="flex-row items-center">
            <View className="flex-1 h-[1px] bg-gray-400" />
            <View>
              <Text className="text-center w-[100px] text-gray-500">
                or signup with
              </Text>
            </View>
            <View className="flex-1 h-[1px] bg-gray-400" />
          </View>
          <TouchableOpacity className="flex flex-row items-center justify-center p-3 mt-4 border border-gray-400 rounded-md">
            <Image
              className="w-4 h-4 mr-2"
              source={require("../../assets/google-icon.png")}
            />
            <Text className="font-semibold text-gray-600">Google</Text>
          </TouchableOpacity>
        </View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
