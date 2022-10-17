import React from "react";
import { FlatList, Text, TouchableOpacity, View, Modal } from "react-native";
import { Header } from "../components/Headers";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppSelector } from "../redux/store";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { UserStackParamList } from "../navigation/userStack";
import QRCode from "react-native-qrcode-svg";

type PeopleScreenProp = StackNavigationProp<UserStackParamList, "People">;

export default function PeopleScreen() {
  const navigation = useNavigation<PeopleScreenProp>();
  const people = useAppSelector((state) => state.dome.people);
  const [shareDomeModalVisible, setShareDomeModalVisible] =
    React.useState(false);

  return (
    <View className="bg-white">
      <Header title="People" />

      {people.length === 0 ? (
        <View className="px-6 py-5 border-b border-gray-200">
          <Text className="text-lg font-semibold text-center text-gray-900">
            You haven&apos;t add any pearson to this dome
          </Text>
          <Text className="text-center text-gray-800">
            Anyone with access to your dome is in full control of your devices.
            To remove access you&apos;ll have to reset your dome.
          </Text>
        </View>
      ) : (
        <FlatList
          className="border-b border-gray-200"
          data={people}
          renderItem={({ item }) => (
            <View className="px-6 py-4">
              <Text className="text-base font-medium">{item.name}</Text>
              <Text className="text-sm text-gray-500">{item.email}</Text>
            </View>
          )}
          keyExtractor={(p) => p.id}
        />
      )}

      <TouchableOpacity
        className="flex flex-row items-center px-6 py-4"
        onPress={() => setShareDomeModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="#3182CE" />
        <Text className="ml-4 font-medium text-blue-500">Add people</Text>
      </TouchableOpacity>
      <ShareDomeModal
        isVisible={shareDomeModalVisible}
        setIsVisible={setShareDomeModalVisible}
      />
    </View>
  );
}

function ShareDomeModal({
  isVisible,
  setIsVisible,
}: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        setIsVisible(false);
      }}
    >
      <View
        className="flex justify-end h-full"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <View className="p-6 m-4 bg-white rounded-2xl">
          <Text className="text-xl font-bold text-center">
            Share access to dome
          </Text>
          <View className="flex flex-row justify-center my-4">
            <QRCode
              value={"dome_id:user_id"}
              size={200}
              color="black"
              backgroundColor="white"
            />
          </View>
          <Text className="text-base leading-5 text-center text-gray-800">
            Anyone who scans this code will have access to your devices
          </Text>
          <TouchableOpacity onPress={() => setIsVisible(false)}>
            <Text className="mt-4 text-base font-medium text-center text-blue-500">
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
