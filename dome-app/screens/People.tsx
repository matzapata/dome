import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Header } from "../components/Headers";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppSelector } from "../redux/store";

export default function PeopleScreen() {
  const people = useAppSelector((state) => state.dome.people);

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

      <TouchableOpacity className="flex flex-row items-center px-6 py-4">
        <Ionicons name="add" size={24} color="#3182CE" />
        <Text className="ml-4 font-medium text-blue-500">Add people</Text>
      </TouchableOpacity>
    </View>
  );
}
