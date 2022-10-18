import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/Home";
import SettingsScreen from "../screens/Settings";
import PersonalInformationScreen from "../screens/PersonalInformation";
import MembersScreen from "../screens/Members";
import DeviceScreen from "../screens/Device";
import DeviceSwitchScreen from "../screens/DeviceSwitch";
import RoomType from "../screens/Room";
import AddDevice from "../screens/AddDevice";
import SetupDeviceWifiNetwork from "../screens/SetupDeviceWifiNetwork";
import SetupDevice from "../screens/SetupDevice";

export type UserStackParamList = {
  Home: undefined;
  Settings: undefined;
  PersonalInformation: undefined;
  Members: undefined;
  Device: { deviceId: string };
  DeviceSwitch: { deviceId: string; switchId: string };
  JoinDome: undefined;
  RoomType: { deviceId: string; switchId: string };
  AddDevice: undefined;
  SetupDeviceWifiNetwork: undefined;
  SetupDevice: undefined;
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
          name="Members"
          component={MembersScreen}
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
        <Stack.Screen
          name="AddDevice"
          component={AddDevice}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SetupDeviceWifiNetwork"
          component={SetupDeviceWifiNetwork}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SetupDevice"
          component={SetupDevice}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
