import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 mt bg-red-500 items-center justify-center">
      <Text>Open up App.tsx to start woraking on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

