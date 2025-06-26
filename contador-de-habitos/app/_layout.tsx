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

  // Estado para controlar se a verificação de login foi concluída
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const hasLoggedIn = await AsyncStorage.getItem('hasLoggedIn');

        // Se o usuário está logado e está na tela de login, redireciona para a home
        if (hasLoggedIn === 'true') {
          if (pathname === '/login') {
            router.replace('/');
          }
        } 
        // Se o usuário NÃO está logado e NÃO está na tela de login, redireciona para o login
        else {
          if (pathname !== '/login') {
            router.replace('/login');
          }
        }
      } catch (e) {
        console.error("Falha ao verificar o status de login", e);
        // Em caso de erro, manda para o login por segurança
        if (pathname !== '/login') {
            router.replace('/login');
        }
      } finally {
        // Marca que a verificação terminou e a UI pode ser renderizada
        setIsReady(true);
      }
    };

    checkLoginStatus();
  }, [pathname]); // A dependência do `pathname` garante que a lógica roda na mudança de rota

  // Enquanto a verificação acontece, mostramos um loading
  // para evitar um "flash" da tela errada.
  if (!isReady) {
    return (
      <View style={[styles.container, { justifyContent: 'center', backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Define as rotas onde a Navbar NÃO deve aparecer
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