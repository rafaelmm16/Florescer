import { Stack, useRouter, usePathname } from 'expo-router';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { ThemeProvider, useTheme } from '../components/ThemeContext';
import Navbar from '../components/Navbar';
import { AuthProvider, useAuth } from '../components/AuthContext';

function MainLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    // Se o carregamento terminou, verificamos o estado de login
    if (!isLoading) {
      if (isLoggedIn) {
        // Se o usuário está logado e tenta acessar o login, redireciona para a home
        if (pathname === '/login') {
          router.replace('/');
        }
      } else {
        // Se o usuário NÃO está logado, redireciona para o login (a menos que já esteja lá)
        if (pathname !== '/login') {
          router.replace('/login');
        }
      }
    }
  }, [isLoggedIn, isLoading, pathname]); // Dependências corretas

  // Mostra um indicador de carregamento enquanto o estado de login é verificado
  if (isLoading) {
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