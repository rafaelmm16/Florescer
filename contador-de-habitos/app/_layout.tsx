import { Stack } from 'expo-router';
import { ThemeProvider } from '../components/ThemeContext';
import Navbar from '../components/Navbar';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
        <Navbar />
      </View>
    </ThemeProvider>
  );
}