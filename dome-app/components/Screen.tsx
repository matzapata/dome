import React from "react";
import { View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { useAppSelector } from "../redux/store";

export default function Screen({ children }: any) {
  const loading = useAppSelector((state) => state.dome.loading);
  return (
    <View style={{ height: "100%" }}>
      <Spinner visible={loading} />
      {children}
    </View>
  );
}
