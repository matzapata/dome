import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { BarCodeScanner, BarCodeScannedCallback } from "expo-barcode-scanner";
import { Header } from "../components/Headers";

export default function JoinDome() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(true);
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
        <View className="m-2 bg-white rounded-2xl">
          <Text className="p-6 text-lg font-medium text-gray-900">
            Join dome
          </Text>

          <Text className="px-6 ">
            You&apos;ll control all matuzapata@gmail.com devices but wont be
            capable of editing settings and adding new devices
          </Text>

          <View className="flex flex-row">
            <TouchableOpacity
              className="flex-1 py-6"
              onPress={() => onCancel()}
            >
              <Text className="text-sm font-medium text-center text-blue-500 uppercase border-r border-gray-200">
                CANCEL
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-6"
              onPress={() => onConfirmation()}
            >
              <Text className="text-sm font-medium text-center text-blue-500 uppercase">
                JOIN
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
