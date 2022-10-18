import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";

import { Header } from "../components/Headers";
import Screen from "../components/Screen";
import { UserStackParamList } from "../navigation/userStack";
import { updateSwitchRoom } from "../redux/slices/domeThunk";
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
    dispatch(updateSwitchRoom({ switchId, deviceId, room: room }));
    navigation.goBack();
  };

  return (
    <Screen>
      <View className="bg-white">
        <Header title="Room" />

        <FlatList
          data={rooms}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="px-6 py-4"
              onPress={() => setRoom(item)}
            >
              <Text className="text-base">{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Screen>
  );
}
