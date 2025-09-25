import React, { useRef, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';

// A custom animated TouchableOpacity for the button press effect
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Reusable NavButton component
const NavButton = ({ href, iconName, isActive }: { href: string, iconName: any, isActive: boolean }) => {
  const { theme } = useTheme();
  const translateY = useRef(new Animated.Value(0)).current;

  const iconColor = isActive ? theme.colors.primary : theme.colors.onSurfaceVariant;

  // Simple debounce implementation
  const debounce = (func: Function, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const handlePressIn = useCallback(
    debounce(() => {
      translateY.stopAnimation(() => {
        Animated.timing(translateY, {
          toValue: -3,
          duration: 150,
          useNativeDriver: false,
        }).start();
      });
    }, 50), // 50ms debounce
    []
  );

  const handlePressOut = useCallback(
    debounce(() => {
      translateY.stopAnimation(() => {
        Animated.spring(translateY, {
          toValue: 0,
          friction: 5,
          tension: 40,
          useNativeDriver: false,
        }).start();
      });
    }, 50), // 50ms debounce
    []
  );

  return (
    <Link href={href as any} asChild>
      <AnimatedTouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.button, { transform: [{ translateY }] }]}
      >
        <Ionicons
          name={isActive ? iconName : `${iconName}-outline`}
          size={25}
          color={iconColor}
        />
      </AnimatedTouchableOpacity>
    </Link>
  );
};


export default function Navbar() {
  const pathname = usePathname();
  const { theme } = useTheme();

  const navItems = [
    { href: '/', icon: 'home' },
    { href: '/completed', icon: 'checkmark-done' },
    { href: '/settings', icon: 'settings' },
  ];

  return (
    <View style={styles.navbarWrapper}>
      <View style={[styles.buttonContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
        {navItems.map((item) => (
          <NavButton
            key={item.href}
            href={item.href}
            iconName={item.icon}
            isActive={pathname === item.href}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 20, // Safe area for home indicator
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '80%',
    maxWidth: 300,
    height: 70,
    borderRadius: 5, // As per your CSS example
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20, // Makes it circular
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});