import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import {
  LiquidGlassView,
  LiquidGlassContainerView,
  isLiquidGlassSupported,
} from '@callstack/liquid-glass';
import { useTheme } from './ThemeContext';
import LiquidBubble from './LiquidBubble';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface NavButtonProps {
  href: string;
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  isActive: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ href, iconName, label, isActive }) => {
  const router = useRouter();
  const { isDark } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (!isActive) {
      router.push(href as any);
    }
  };

  return (
    <AnimatedTouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={StyleSheet.flatten([styles.button, { transform: [{ scale }] }])}
      activeOpacity={0.85}
      accessibilityLabel={label}
    >
      {isActive ? (
        <LiquidBubble size={46} colorTheme="turquoise" interactive>
          <Ionicons name={iconName} size={22} color="#FFFFFF" />
        </LiquidBubble>
      ) : (
        <View style={styles.inactiveIconWrapper}>
          <Ionicons
            name={(`${iconName}-outline` as any)}
            size={22}
            color={isDark ? 'rgba(147, 197, 253, 0.75)' : 'rgba(14, 116, 144, 0.75)'}
          />
        </View>
      )}
    </AnimatedTouchableOpacity>
  );
};

export default function Navbar() {
  const pathname = usePathname();
  const { theme, isDark } = useTheme();

  const navItems = [
    { href: '/', icon: 'home' as const, label: 'Início' },
    { href: '/completed', icon: 'trophy' as const, label: 'Concluídos' },
    { href: '/settings', icon: 'person' as const, label: 'Perfil' },
  ];

  return (
    <View style={styles.navbarWrapper} pointerEvents="box-none">
      <LiquidGlassContainerView spacing={16}>
        <LiquidGlassView
          effect="regular"
          colorScheme={isDark ? 'dark' : 'light'}
          style={[
            styles.container,
            {
              shadowColor: isDark ? '#00F2FE' : theme.colors.shadow,
            },
            !isLiquidGlassSupported && (isDark ? styles.fallbackDark : styles.fallbackLight),
          ]}
        >
          <View style={styles.buttonsRow}>
            {navItems.map((item) => (
              <NavButton
                key={item.href}
                href={item.href}
                iconName={item.icon}
                label={item.label}
                isActive={pathname === item.href}
              />
            ))}
          </View>
        </LiquidGlassView>
      </LiquidGlassContainerView>
    </View>
  );
}

const styles = StyleSheet.create({
  navbarWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 18,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  container: {
    width: '84%',
    maxWidth: 340,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    elevation: 12,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    height: '100%',
  },
  button: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveIconWrapper: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackDark: {
    backgroundColor: 'rgba(7, 21, 33, 0.78)',
    borderColor: 'rgba(0, 242, 254, 0.30)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(28px) saturate(200%)',
        WebkitBackdropFilter: 'blur(28px) saturate(200%)',
        boxShadow:
          '0 8px 32px rgba(0, 0, 0, 0.45), inset 0 1px 1.5px rgba(255, 255, 255, 0.35)',
      } as any,
    }),
  },
  fallbackLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderColor: 'rgba(255, 255, 255, 0.90)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        boxShadow:
          '0 8px 32px rgba(8, 47, 73, 0.10), inset 0 1px 1.5px rgba(255, 255, 255, 0.85)',
      } as any,
    }),
  },
});