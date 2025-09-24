// florescer/app/_layout.tsx

import { Stack, usePathname } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { ThemeProvider } from '../components/ThemeContext';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../components/AuthContext';
// 1. Importações necessárias
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// 2. Impedir que a tela de splash desapareça automaticamente
SplashScreen.preventAutoHideAsync();

function MainLayout() {
  const pathname = usePathname();

  const hideNavbarOnRoutes = ['/new', '/routine/[id]'];
  // Corrigido para corresponder ao caminho de edição
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
  // 3. Carregar as fontes
  const [fontsLoaded, fontError] = useFonts({
    'Lato-Regular': require('../assets/fonts/Lato-Regular.ttf'),
    'Lato-Bold': require('../assets/fonts/Lato-Bold.ttf'),
  });

  useEffect(() => {
    // 4. Esconder a tela de splash quando as fontes carregarem (ou der erro)
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // 5. Não renderizar nada até que as fontes estejam prontas
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});