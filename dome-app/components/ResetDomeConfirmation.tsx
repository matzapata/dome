import { Alert } from "react-native";

export default function ResetDomeConfirmation() {
  const resetDome = () => {
    console.log("Reset dome");
  };

  return Alert.alert(
    "Are your sure?",
    "Are you sure you want to reset the dome? You'll have to configure all again",
    [{ text: "Yes", onPress: resetDome }, { text: "No" }]
  );
}
