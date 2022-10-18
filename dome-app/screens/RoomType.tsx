import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";

import { Header } from "../components/Headers";
import { UserStackParamList } from "../navigation/userStack";
import { updateSwitchRoomType } from "../redux/slices/domeThunk";
import { useAppDispatch } from "../redux/store";

const rooms = ["Bedroom", "Kitchen", "None"];

type RoomTypeScreenProp = StackNavigationProp<UserStackParamList, "RoomType">;
type RoomTypeScreenRouteProp = RouteProp<UserStackParamList, "RoomType">;

export default function RoomType() {
  const dispatch = useAppDispatch();
  const route = useRoute<RoomTypeScreenRouteProp>();
  const { switchId, deviceId } = route.params;
  const navigation = useNavigation<RoomTypeScreenProp>();

  const setRoom = (room: string) => {
    dispatch(updateSwitchRoomType({ switchId, deviceId, roomType: room }));
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
