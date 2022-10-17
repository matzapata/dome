import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/Home";
import SettingsScreen from "../screens/Settings";
import PersonalInformationScreen from "../screens/PersonalInformation";
import PeopleScreen from "../screens/People";
import DeviceScreen from "../screens/Device";
import DeviceSwitchScreen from "../screens/DeviceSwitch";
import JoinDome from "../screens/JoinDome";
import RoomType from "../screens/RoomType";

export type UserStackParamList = {
  Home: undefined;
  Settings: undefined;
  PersonalInformation: undefined;
  People: undefined;
  Device: { id: string };
  DeviceSwitch: { deviceId: string; id: string };
  JoinDome: undefined;
  RoomType: undefined;
};

const Stack = createStackNavigator();

export default function UserStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PersonalInformation"
          component={PersonalInformationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="People"
          component={PeopleScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Device"
          component={DeviceScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DeviceSwitch"
          component={DeviceSwitchScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RoomType"
          component={RoomType}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
