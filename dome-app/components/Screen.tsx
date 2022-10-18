import React from "react";
import { View, StatusBar, Platform } from "react-native";

export default function Screen({ children }: any) {
  return (
    <View
      style={{
        height: "100%",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      {children}
    </View>
  );
}
