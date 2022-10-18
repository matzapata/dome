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
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import Screen from "../../components/Screen";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/slices/dome";

type SignUpScreenProp = StackNavigationProp<AuthStackParamList, "SignUp">;

export default function SignUp() {
  const auth = getAuth();
  const db = getDatabase();
  const dispatch = useDispatch();
  const navigation = useNavigation<SignUpScreenProp>();
  const [state, setState] = useState<{
    email: string;
    password: string;
    name: string;
    error: string;
  }>({
    email: "",
    password: "",
    name: "",
    error: "",
  });

  async function signUpUser() {
    if (state.email === "" || state.password === "" || state.name === "") {
      Alert.alert("Sign up error", "All fields are mandatory.");
      setState({
        ...state,
        error: "All fields are mandatory.",
      });
      return;
    }

    try {
      dispatch(setLoading(true));
      const user = await createUserWithEmailAndPassword(
        auth,
        state.email,
        state.password
      );
      await set(ref(db, `users/${user.user.uid}`), {
        name: state.name,
        dome: "",
      });
    } catch (error: any) {
      Alert.alert("Sign up error", error.code);
    } finally {
      dispatch(setLoading(true));
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView>
        <View className="flex flex-col h-full ">
          <View className="w-full px-4 pt-20 pb-4">
            <Text className="text-3xl font-extrabold">Sign up</Text>
            <Text className="text-gray-500">to your dome</Text>
          </View>

          <View className="px-4 mt-8">
            <TextInput
              className="px-4 py-3 mb-4 bg-gray-200 rounded-md"
              placeholder="Name"
              onChangeText={(text) => setState({ ...state, name: text })}
            />
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
              className="py-4 mt-6 mb-2 bg-black rounded-md"
              onPress={signUpUser}
            >
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
      </KeyboardAvoidingView>
    </Screen>
  );
}
