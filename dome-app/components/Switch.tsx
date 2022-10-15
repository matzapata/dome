import React, { useState } from "react";

import { Text, View, TouchableOpacity } from "react-native";

export const Switch = ({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (val: boolean) => void;
}) => {
  const [val, setVal] = useState(value);

  return (
    <View>
      <View
        style={{
          height: 44,
          width: 215,
          backgroundColor: "white",
          borderWidth: 1,
          flexDirection: "row",
          justifyContent: "center",
          padding: 2,
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setVal(false);
            onValueChange(false);
          }}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View className="w-4 h-4 bg-red-500"></View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setVal(true);
            onValueChange(true);
          }}
          style={{
            flex: 1,

            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View className="w-4 h-4 bg-red-500"></View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
