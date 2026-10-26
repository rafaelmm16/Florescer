import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { triggerLightHaptic } from '../utils/haptics';

export default function NewRoutineButton() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    triggerLightHaptic();
    router.push('/new');
  };

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.90,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const buttonBg = isDark ? '#38BDF8' : '#0F172A';
  const iconColor = isDark ? '#090D14' : '#FFFFFF';

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
      style={styles.floatingContainer}
      accessibilityLabel="Criar nova rotina"
    >
      <Animated.View
        style={[
          styles.buttonBody,
          {
            backgroundColor: buttonBg,
            transform: [{ scale: scaleValue }],
          },
        ]}
      >
        <Ionicons name="add" size={26} color={iconColor} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    right: 20,
    bottom: Platform.OS === 'ios' ? 104 : 96,
    zIndex: 90,
  },
  buttonBody: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.20,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)',
      } as any,
    }),
  },
});