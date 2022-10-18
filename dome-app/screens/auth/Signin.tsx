import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { AuthStackParamList } from "../../navigation/authStack";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

type SignInScreenProp = StackNavigationProp<AuthStackParamList, "SignIn">;

export default function SignIn() {
  const auth = getAuth();
  const navigation = useNavigation<SignInScreenProp>();
  const [state, setState] = useState<{
    email: string;
    password: string;
    error: string;
  }>({
    email: "",
    password: "",
    error: "",
  });

  async function onSubmit() {
    if (state.email === "" || state.password === "") {
      Alert.alert("Sign in error", "Email and password are mandatory.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, state.email, state.password);
    } catch (error: any) {
      Alert.alert("Sign in error", error.code);
    }
  }

  return (
    <KeyboardAvoidingView>
      <View className="flex flex-col justify-between h-full ">
        <View className="w-full px-4 pt-20 pb-4">
          <Text className="text-3xl font-extrabold">Welcome</Text>
          <Text className="text-gray-500">to your dome</Text>
        </View>

        <View className="px-4">
          <TextInput
            className="px-4 py-3 mb-4 bg-gray-200 rounded-md"
            placeholder="Email"
            onChangeText={(text) => setState({ ...state, email: text })}
          />
          <TextInput
            secureTextEntry={true}
            className="px-4 py-3 mb-2 bg-gray-200 rounded-md"
            placeholder="Password"
            onChangeText={(text) => setState({ ...state, password: text })}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text className="text-right">Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-4 mt-6 mb-2 bg-black rounded-md"
            onPress={onSubmit}
          >
            <Text className="font-medium text-center text-white">Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text className="text-center">
              Don&apos;t have an account?{" "}
              <Text className="font-bold">Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View className="p-4">
          <View className="flex-row items-center">
            <View className="flex-1 h-[1px] bg-gray-400" />
            <View>
              <Text className="text-center w-[100px] text-gray-500">
                or login with
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
    </KeyboardAvoidingView>
  );
}
