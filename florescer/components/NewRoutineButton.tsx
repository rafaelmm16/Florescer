import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import LiquidBubble from './LiquidBubble';

export default function NewRoutineButton() {
  const router = useRouter();
  const { theme } = useTheme();
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    router.push('/new');
  };

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.88,
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
          styles.fabWrapper,
          {
            transform: [{ scale: scaleValue }],
            shadowColor: theme.colors.primary,
          },
        ]}
      >
        {/* Luminous Vibrant Turquoise Spherical Liquid Glass Bubble */}
        <LiquidBubble size={62} colorTheme="turquoise">
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </LiquidBubble>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    right: 22,
    bottom: Platform.OS === 'ios' ? 104 : 96,
    zIndex: 90,
  },
  fabWrapper: {
    width: 62,
    height: 62,
    borderRadius: 31,
    elevation: 12,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.50,
    shadowRadius: 22,
  },
});