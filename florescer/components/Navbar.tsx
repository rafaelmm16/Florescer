import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from './ThemeContext';

interface NavButtonProps {
  href: string;
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  isActive: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ href, iconName, label, isActive }) => {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.92,
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

  const activeColor = isDark ? '#38BDF8' : '#0F172A';
  const inactiveColor = isDark ? '#64748B' : '#94A3B8';

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.button,
          isActive && [
            styles.activeButton,
            {
              backgroundColor: isDark
                ? 'rgba(56, 189, 248, 0.12)'
                : 'rgba(15, 23, 42, 0.06)',
            },
          ],
        ]}
        activeOpacity={0.8}
        accessibilityLabel={label}
      >
        <Ionicons
          name={isActive ? iconName : (`${iconName}-outline` as any)}
          size={21}
          color={isActive ? activeColor : inactiveColor}
        />
        <Text
          style={[
            styles.buttonLabel,
            {
              color: isActive ? activeColor : inactiveColor,
              fontWeight: isActive ? '700' : '500',
            },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function Navbar() {
  const pathname = usePathname();
  const { theme, isDark } = useTheme();

  const navItems = [
    { href: '/', icon: 'home' as const, label: 'Hábitos' },
    { href: '/completed', icon: 'trophy' as const, label: 'Conquistas' },
    { href: '/settings', icon: 'person' as const, label: 'Perfil' },
  ];

  return (
    <View style={styles.navbarWrapper} pointerEvents="box-none">
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDark ? 'rgba(17, 22, 34, 0.92)' : 'rgba(255, 255, 255, 0.94)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
          },
        ]}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <NavButton
              key={item.href}
              href={item.href}
              iconName={item.icon}
              label={item.label}
              isActive={isActive}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbarWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '88%',
    maxWidth: 360,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    paddingHorizontal: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
      web: {
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
      } as any,
    }),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  activeButton: {
    // Subtle background provided dynamically
  },
  buttonLabel: {
    fontSize: 13,
  },
});