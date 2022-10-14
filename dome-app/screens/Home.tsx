import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function Home() {
  return (
    <View className="flex-1 mt bg-red-500 items-center justify-center">
      <Text>Home</Text>
      <StatusBar style="auto" />
    </View>
  );
}

