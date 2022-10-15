import React from "react";
import "./config/firebase";
import RootNavigation from "./navigation";
import { store } from "./redux/store";
import { Provider } from "react-redux";

export default function App() {
  return (
    <Provider store={store}>
      <RootNavigation />
    </Provider>
  );
}
