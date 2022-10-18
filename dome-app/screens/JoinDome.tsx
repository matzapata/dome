import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import { BarCodeScanner, BarCodeScannedCallback } from "expo-barcode-scanner";
import { Header } from "../components/Headers";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch } from "../redux/store";
import { joinDome } from "../redux/slices/domeThunk";
import { StackNavigationProp } from "@react-navigation/stack";
import { UserStackParamList } from "../navigation/userStack";

type JoinDomeScreenProp = StackNavigationProp<UserStackParamList, "Home">;

export default function JoinDome() {
  const navigation = useNavigation<JoinDomeScreenProp>();
  const dispatch = useAppDispatch();
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
    return (
      <View className="flex items-center justify-center flex-1">
        <Text>Requesting for camera permission...</Text>
      </View>
    );
  } else if (hasPermission === false) {
    return (
      <View className="flex items-center justify-center flex-1">
        <Text>No access to camera</Text>
      </View>
    );
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
          ownerName={data.split("-")[1]}
          onConfirmation={async () => {
            setScanned(false);
            try {
              await dispatch(joinDome({ domeId: data.split("-")[0] })).unwrap();
              Alert.alert("Successfully joined dome");
              navigation.navigate("Home");
            } catch (e) {
              Alert.alert("Error joining dome", "Please try again");
            }
          }}
          onCancel={() => setScanned(false)}
        />
      </View>
    );
}

function ConfirmationModal({
  isVisible,
  ownerName,
  onConfirmation,
  onCancel,
}: {
  isVisible: boolean;
  ownerName: string;
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
            You&apos;ll control all {ownerName} devices.
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
