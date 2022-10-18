import React from "react";
import "./config/firebase";
import RootNavigation from "./navigation";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { RootSiblingParent } from "react-native-root-siblings";

export default function App() {
  return (
    <Provider store={store}>
      <RootSiblingParent>
        <RootNavigation />
      </RootSiblingParent>
    </Provider>
  );
}
