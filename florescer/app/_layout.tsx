// florescer/app/_layout.tsx

import { Stack, usePathname } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { ThemeProvider } from '../components/ThemeContext';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../components/AuthContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

function MainLayout() {
  const pathname = usePathname();

  const hideNavbarOnRoutes = ['/new', '/routine/[id]'];
  const isEditRoute = /^\/routine\/\w+$/.test(pathname);
  const showNavbar = !hideNavbarOnRoutes.includes(pathname) && !isEditRoute;


  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }} />
      {showNavbar && <Navbar />}
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Lato-Regular': require('../assets/fonts/Lato-Regular.ttf'),
    'Lato-Bold': require('../assets/fonts/Lato-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <MainLayout />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});