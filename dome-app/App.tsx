import React from "react";
import "./config/firebase";
import RootNavigation from "./navigation";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { RootSiblingParent } from "react-native-root-siblings";
import { StatusBar } from "react-native";

export default function App() {
  return (
    <Provider store={store}>
      <RootSiblingParent>
        <RootNavigation />
        <StatusBar
          hidden={false}
          barStyle="light-content"
          backgroundColor="#0F0F0F"
        />
      </RootSiblingParent>
    </Provider>
  );
}
