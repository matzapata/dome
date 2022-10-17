import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { BarCodeScanner, BarCodeScannedCallback } from "expo-barcode-scanner";
import { Header } from "../components/Headers";

export default function JoinDome() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned: BarCodeScannedCallback = ({ data }) => {
    setScanned(true);
    setData(data);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  } else if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  } else
    return (
      <View className="flex flex-col justify-start flex-1">
        <Header title="Join a dome" />

        <BarCodeScanner
          className="-z-10"
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFill}
        />
        <ConfirmationModal
          isVisible={scanned}
          onConfirmation={() => console.log("Confirmed")}
          onCancel={() => setScanned(false)}
        />
      </View>
    );
}

function ConfirmationModal({
  isVisible,
  onConfirmation,
  onCancel,
}: {
  isVisible: boolean;
  onConfirmation: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        onCancel();
      }}
    >
      <View
        className="flex justify-center h-full"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <View className="p-6 m-4 bg-white rounded-2xl">
          <Text className="text-xl font-bold">Join dome</Text>

          <View className="py-4">
            <Text className="text-base font-medium">Matias Zapata</Text>
            <Text className="text-sm text-gray-500">matuzapata@gmail.com</Text>
          </View>

          <View className="flex flex-row">
            <TouchableOpacity className="flex-1" onPress={() => onCancel()}>
              <Text className="mt-4 text-base font-medium text-center text-blue-500">
                CANCEL
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1"
              onPress={() => onConfirmation()}
            >
              <Text className="mt-4 text-base font-medium text-center text-blue-500">
                JOIN
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
