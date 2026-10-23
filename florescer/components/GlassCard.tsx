import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';
import {
  LiquidGlassView,
  isLiquidGlassSupported,
  type LiquidGlassViewProps,
} from '@callstack/liquid-glass';
import { useTheme } from './ThemeContext';

export interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  variant?: 'card' | 'capsule' | 'bubble';
  interactive?: boolean;
  effect?: LiquidGlassViewProps['effect'];
  tintColor?: string;
  layered?: boolean; // backwards compatibility
  highlight?: boolean; // backwards compatibility
  chromatic?: boolean; // backwards compatibility
}

export default function GlassCard({
  children,
  style,
  borderRadius = 22,
  variant = 'card',
  interactive = false,
  effect = 'regular',
  tintColor,
}: GlassCardProps) {
  const { theme, isDark } = useTheme();

  const computedRadius =
    variant === 'capsule' ? 36 : variant === 'bubble' ? 999 : borderRadius;

  return (
    <LiquidGlassView
      interactive={interactive}
      effect={effect}
      colorScheme={isDark ? 'dark' : 'light'}
      tintColor={tintColor}
      style={[
        styles.baseCard,
        {
          borderRadius: computedRadius,
          shadowColor: isDark ? '#00F2FE' : theme.colors.shadow,
        },
        !isLiquidGlassSupported && (isDark ? styles.fallbackDark : styles.fallbackLight),
        style,
      ]}
    >
      <View style={[styles.innerContent, { borderRadius: computedRadius }]}>
        {children}
      </View>
    </LiquidGlassView>
  );
}

const styles = StyleSheet.create({
  baseCard: {
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    elevation: 6,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
  },
  innerContent: {
    position: 'relative',
    width: '100%',
  },
  fallbackDark: {
    backgroundColor: 'rgba(10, 29, 46, 0.68)',
    borderColor: 'rgba(0, 242, 254, 0.25)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(28px) saturate(200%)',
        WebkitBackdropFilter: 'blur(28px) saturate(200%)',
        boxShadow:
          '0 8px 32px 0 rgba(0, 0, 0, 0.40), inset 0 1px 1px 0 rgba(255, 255, 255, 0.20)',
      } as any,
    }),
  },
  fallbackLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderColor: 'rgba(255, 255, 255, 0.85)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        boxShadow:
          '0 8px 32px 0 rgba(8, 47, 73, 0.08), inset 0 1px 1px 0 rgba(255, 255, 255, 0.80)',
      } as any,
    }),
  },
});
