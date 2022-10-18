import React from "react";
import "./config/firebase";
import RootNavigation from "./navigation";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { RootSiblingParent } from "react-native-root-siblings";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <Provider store={store}>
      <RootSiblingParent>
        <RootNavigation />
        <StatusBar hidden={false} style="dark" />
      </RootSiblingParent>
    </Provider>
  );
}
