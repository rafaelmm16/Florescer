import React, { useRef, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const NavButton = ({ href, iconName, isActive }: { href: string, iconName: any, isActive: boolean }) => {
  const { theme } = useTheme();
  const translateY = useRef(new Animated.Value(0)).current;

  const iconColor = isActive ? theme.colors.primary : theme.colors.onSurfaceVariant;

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
          toValue: -4,
          duration: 150,
          useNativeDriver: true,
        }).start();
      });
    }, 50),
    []
  );

  const handlePressOut = useCallback(
    debounce(() => {
      translateY.stopAnimation(() => {
        Animated.spring(translateY, {
          toValue: 0,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }).start();
      });
    }, 50),
    []
  );

  return (
    <Link href={href as any} asChild>
      <AnimatedTouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={StyleSheet.flatten([styles.button, { transform: [{ translateY }] }])}
      >
        <Ionicons
          name={isActive ? iconName : `${iconName}-outline`}
          size={28}
          color={iconColor}
        />
        {isActive && (
          <View style={[styles.activeDot, { backgroundColor: theme.colors.primary }]} />
        )}
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
      <View style={[
        styles.buttonContainer, 
        { 
          backgroundColor: theme.colors.surface, 
          borderColor: theme.colors.surfaceVariant,
          shadowColor: theme.colors.shadow,
        }
      ]}>
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
    paddingBottom: 24, 
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '75%',
    maxWidth: 320,
    height: 72,
    borderRadius: 36, 
    elevation: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25, 
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    bottom: 2,
  }
});