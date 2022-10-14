import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuthentication } from "../hooks/useAuthentication";
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth();

export default function HomeScreen() {
  const { user } = useAuthentication();

  return (
    <View>
      <Text>Welcome {user?.email}!</Text>
      <TouchableOpacity onPress={() => signOut(auth)}>
        <Text>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}
