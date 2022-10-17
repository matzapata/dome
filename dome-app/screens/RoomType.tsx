import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";

import { Header } from "../components/Headers";
import { UserStackParamList } from "../navigation/userStack";

const rooms = ["Bedroom", "Kitchen", "None"];

type RoomTypeScreenProp = StackNavigationProp<UserStackParamList, "RoomType">;

export default function RoomType() {
  const navigation = useNavigation<RoomTypeScreenProp>();

  const setRoom = (room: string) => {
    console.log(room);
    navigation.goBack();
  };

  return (
    <View className="bg-white">
      <Header title="Room type" />

      <FlatList
        data={rooms}
        renderItem={({ item }) => (
          <TouchableOpacity className="px-6 py-4" onPress={() => setRoom(item)}>
            <Text className="text-base">{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
