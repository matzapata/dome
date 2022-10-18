import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { AuthStackParamList } from "../../navigation/authStack";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Screen from "../../components/Screen";
import { useAppDispatch } from "../../redux/store";
import { setLoading } from "../../redux/slices/dome";

type SignInScreenProp = StackNavigationProp<AuthStackParamList, "SignIn">;

export default function SignIn() {
  const auth = getAuth();
  const dispatch = useAppDispatch();
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
      dispatch(setLoading(true));
      await signInWithEmailAndPassword(auth, state.email, state.password);
    } catch (error: any) {
      Alert.alert("Sign in error", error.code);
    } finally {
      dispatch(setLoading(false));
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView>
        <View className="flex flex-col h-full ">
          <View className="w-full px-4 pt-20 pb-4">
            <Text className="text-3xl font-extrabold">Welcome</Text>
            <Text className="text-gray-500">to your dome</Text>
          </View>

          <View className="px-4 mt-8">
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
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
