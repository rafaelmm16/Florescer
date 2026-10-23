import 'react-native-gesture-handler';
import {
  Stack,
  usePathname,
  useRouter,
  ThemeProvider as NavigationThemeProvider,
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavDefaultTheme,
} from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ThemeProvider, useTheme } from '../components/ThemeContext';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../components/AuthContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { isProfileConfigured } from '../services/database';

SplashScreen.preventAutoHideAsync();

function MainLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { isDark, theme } = useTheme();

  const hideNavbarOnRoutes = ['/new', '/routine/[id]', '/setup-profile'];
  const isEditRoute = /^\/routine\/\w+$/.test(pathname);
  const showNavbar = !hideNavbarOnRoutes.includes(pathname) && !isEditRoute;

  // First-time opening profile setup check
  useEffect(() => {
    let isMounted = true;
    async function checkOnboarding() {
      try {
        const configured = await isProfileConfigured();
        if (!configured && isMounted && pathname !== '/setup-profile') {
          router.replace('/setup-profile');
        }
      } catch (e) {
        console.warn('Error checking onboarding status:', e);
      }
    }
    checkOnboarding();
    return () => {
      isMounted = false;
    };
  }, [pathname]);

  const currentBg = isDark ? '#090E17' : '#F8FAFC';

  // Synchronize browser body/html background on Web
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.body.style.backgroundColor = currentBg;
      document.documentElement.style.backgroundColor = currentBg;
    }
  }, [currentBg]);

  const navTheme = {
    ...(isDark ? NavDarkTheme : NavDefaultTheme),
    colors: {
      ...(isDark ? NavDarkTheme.colors : NavDefaultTheme.colors),
      background: currentBg,
      card: theme.colors.surface,
      text: theme.colors.onSurface,
      border: theme.colors.outline,
      primary: theme.colors.primary,
    },
  };

  return (
    <NavigationThemeProvider value={navTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={[styles.container, { backgroundColor: currentBg }]}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: currentBg },
            animation: 'fade',
          }}
        />
        {showNavbar && <Navbar />}
      </View>
    </NavigationThemeProvider>
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