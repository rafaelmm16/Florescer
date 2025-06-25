import { Stack, usePathname, useRouter } from 'expo-router';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemeProvider, useTheme } from '../components/ThemeContext';
import Navbar from '../components/Navbar';

function MainLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const hasLoggedIn = await AsyncStorage.getItem('hasLoggedIn');
        if (hasLoggedIn === 'true') {
          // Se já logou antes, vai para a tela inicial
          router.replace('/');
        } else {
          // Se não, vai para a tela de login
          router.replace('/login');
        }
      } catch (e) {
        console.error("Failed to check login status", e);
        // Em caso de erro, manda para o login por segurança
        router.replace('/login');
      } finally {
        // Marca que a verificação terminou e a UI pode ser renderizada
        setIsReady(true);
      }
    };

    checkLoginStatus();
  }, []);

  // Enquanto a verificação acontece, mostramos um loading
  // para evitar um "flash" da tela errada.
  if (!isReady) {
    return (
      <View style={[styles.container, { justifyContent: 'center', backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Defina as rotas onde a Navbar NÃO deve aparecer
  const hideNavbarOnRoutes = ['/login', '/new', '/habit/[id]'];
  const showNavbar = !hideNavbarOnRoutes.includes(pathname);

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }} />
      {showNavbar && <Navbar />}
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <MainLayout />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});