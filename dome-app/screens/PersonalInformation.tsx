import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TextInput, View } from "react-native";
import { HeaderWithConfirmation } from "../components/Headers";
import { updateUserName } from "../redux/slices/domeThunk";
import { useAppDispatch, useAppSelector } from "../redux/store";

export default function PersonalInformationScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const username = useAppSelector((state) => state.dome.user.name);
  const [state, setState] = React.useState({
    username,
  });

  return (
    <View className="bg-white">
      <HeaderWithConfirmation
        title="Personal information"
        onConfirmation={async () => {
          await dispatch(updateUserName({ name: state.username }));
          navigation.goBack();
        }}
      />

      <View className="p-6">
        <TextInput
          placeholder="Name"
          value={state.username}
          onChangeText={(text) => setState({ ...state, username: text })}
          className="py-2 border-b border-gray-300"
        />
        <Text className="mt-2 text-gray-500">
          The name of the device must be unique and has a maximum size of 8
          characters
        </Text>
      </View>
    </View>
  );
}
