import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';
import { useTheme } from './ThemeContext';

export interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  variant?: 'card' | 'capsule' | 'bubble';
  interactive?: boolean;
  effect?: string;
  tintColor?: string;
  layered?: boolean;
  highlight?: boolean;
  chromatic?: boolean;
}

export default function GlassCard({
  children,
  style,
  borderRadius = 18,
  variant = 'card',
}: GlassCardProps) {
  const { theme, isDark } = useTheme();

  const computedRadius =
    variant === 'capsule' ? 32 : variant === 'bubble' ? 999 : borderRadius;

  return (
    <View
      style={[
        styles.baseCard,
        {
          borderRadius: computedRadius,
          backgroundColor: isDark ? '#111622' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
        },
        isDark ? styles.darkShadow : styles.lightShadow,
        style,
      ]}
    >
      <View style={[styles.innerContent, { borderRadius: computedRadius }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  baseCard: {
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
  },
  innerContent: {
    position: 'relative',
    width: '100%',
  },
  lightShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 1.5,
      },
      web: {
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)',
      } as any,
    }),
  },
  darkShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.35)',
      } as any,
    }),
  },
});
