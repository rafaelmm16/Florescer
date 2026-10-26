import 'react-native-gesture-handler';
import {
  Stack,
  usePathname,
  useRouter,
  ThemeProvider as NavigationThemeProvider,
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavDefaultTheme,
} from 'expo-router';
import { View, StyleSheet, Platform, TouchableOpacity, Text, AppState, AppStateStatus } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from '../components/ThemeContext';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../components/AuthContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { isProfileConfigured } from '../services/database';
import { isBiometricLockEnabled, promptBiometricAuth } from '../utils/biometrics';

SplashScreen.preventAutoHideAsync();

function MainLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { isDark, theme } = useTheme();

  const [isLocked, setIsLocked] = useState(false);

  const hideNavbarOnRoutes = ['/new', '/routine/[id]', '/setup-profile'];
  const isEditRoute = /^\/routine\/\w+$/.test(pathname);
  const showNavbar = !hideNavbarOnRoutes.includes(pathname) && !isEditRoute;

  // Biometric lock verification on launch and resume
  useEffect(() => {
    let isMounted = true;
    async function checkSecurity() {
      try {
        const lockEnabled = await isBiometricLockEnabled();
        if (lockEnabled) {
          if (isMounted) setIsLocked(true);
          const success = await promptBiometricAuth('Autentique-se para abrir o Florescer');
          if (isMounted) {
            setIsLocked(!success);
          }
        }
      } catch {
        if (isMounted) setIsLocked(false);
      }
    }
    checkSecurity();

    const sub = AppState.addEventListener('change', async (state: AppStateStatus) => {
      if (state === 'background' || state === 'inactive') {
        const lockEnabled = await isBiometricLockEnabled();
        if (lockEnabled && isMounted) {
          setIsLocked(true);
        }
      }
    });

    return () => {
      isMounted = false;
      sub.remove();
    };
  }, []);

  const handleUnlock = async () => {
    const success = await promptBiometricAuth('Autentique-se para abrir o Florescer');
    if (success) {
      setIsLocked(false);
    }
  };

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

  if (isLocked) {
    return (
      <View style={[styles.lockContainer, { backgroundColor: currentBg }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={styles.lockContent}>
          <View
            style={[
              styles.lockIconBox,
              {
                backgroundColor: isDark ? 'rgba(56, 189, 248, 0.1)' : '#F0F9FF',
                borderColor: isDark ? 'rgba(56, 189, 248, 0.25)' : '#BAE6FD',
              },
            ]}
          >
            <Ionicons
              name="finger-print"
              size={48}
              color={isDark ? '#38BDF8' : '#0284C7'}
            />
          </View>
          <Text style={[styles.lockTitle, { color: theme.colors.onSurface }]}>
            Florescer Seguro
          </Text>
          <Text style={[styles.lockSubtitle, { color: theme.colors.onSurfaceVariant }]}>
            Autenticação biométrica ativada para proteger sua rotina diária e privacidade.
          </Text>

          <TouchableOpacity
            style={[
              styles.unlockBtn,
              { backgroundColor: isDark ? '#38BDF8' : '#0F172A' },
            ]}
            onPress={handleUnlock}
            activeOpacity={0.85}
          >
            <Ionicons
              name="shield-checkmark"
              size={18}
              color={isDark ? '#090D14' : '#FFFFFF'}
              style={{ marginRight: 8 }}
            />
            <Text
              style={[
                styles.unlockBtnText,
                { color: isDark ? '#090D14' : '#FFFFFF' },
              ]}
            >
              Desbloquear com Biometria
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
  lockContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  lockContent: {
    alignItems: 'center',
    maxWidth: 340,
    width: '100%',
  },
  lockIconBox: {
    width: 88,
    height: 88,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  lockTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 8,
    textAlign: 'center',
  },
  lockSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 32,
  },
  unlockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 14,
    width: '100%',
  },
  unlockBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
});