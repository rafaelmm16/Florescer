import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';
import {
  LiquidGlassView,
  isLiquidGlassSupported,
  type LiquidGlassViewProps,
} from '@callstack/liquid-glass';
import { useTheme } from './ThemeContext';

export interface LiquidBubbleProps {
  children?: React.ReactNode;
  size?: number;
  style?: StyleProp<ViewStyle>;
  colorTheme?: 'turquoise' | 'cyan' | 'violet' | 'neutral' | 'smoked' | 'emerald';
  interactive?: boolean;
  effect?: LiquidGlassViewProps['effect'];
  intensity?: number; // backwards compatibility
}

export default function LiquidBubble({
  children,
  size = 52,
  style,
  colorTheme = 'turquoise',
  interactive = true,
  effect = 'clear',
}: LiquidBubbleProps) {
  const { theme, isDark } = useTheme();

  const radius = size / 2;

  const getTintColor = () => {
    switch (colorTheme) {
      case 'turquoise':
        return isDark ? 'rgba(0, 242, 254, 0.35)' : 'rgba(6, 182, 212, 0.25)';
      case 'cyan':
        return isDark ? 'rgba(14, 165, 233, 0.35)' : 'rgba(56, 189, 248, 0.25)';
      case 'violet':
        return isDark ? 'rgba(168, 85, 247, 0.35)' : 'rgba(192, 132, 252, 0.25)';
      case 'smoked':
        return isDark ? 'rgba(30, 41, 59, 0.40)' : 'rgba(226, 232, 240, 0.40)';
      case 'neutral':
        return isDark ? 'rgba(15, 23, 42, 0.35)' : 'rgba(255, 255, 255, 0.35)';
      case 'emerald':
      default:
        return isDark ? 'rgba(45, 212, 191, 0.35)' : 'rgba(16, 185, 129, 0.25)';
    }
  };

  return (
    <LiquidGlassView
      interactive={interactive}
      effect={effect}
      colorScheme={isDark ? 'dark' : 'light'}
      tintColor={getTintColor()}
      style={[
        styles.bubbleContainer,
        {
          width: size,
          height: size,
          borderRadius: radius,
          shadowColor: isDark ? '#00F2FE' : theme.colors.shadow,
        },
        !isLiquidGlassSupported && (isDark ? styles.fallbackDark : styles.fallbackLight),
        style,
      ]}
    >
      <View style={styles.centerContent}>{children}</View>
    </LiquidGlassView>
  );
}

const styles = StyleSheet.create({
  bubbleContainer: {
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 14,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
  },
  fallbackDark: {
    backgroundColor: 'rgba(6, 182, 212, 0.28)',
    borderColor: 'rgba(0, 242, 254, 0.45)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px) saturate(190%)',
        WebkitBackdropFilter: 'blur(20px) saturate(190%)',
        boxShadow:
          '0 6px 20px rgba(0, 0, 0, 0.45), inset 0 1.5px 2px rgba(255, 255, 255, 0.40)',
      } as any,
    }),
  },
  fallbackLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.95)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        boxShadow:
          '0 6px 20px rgba(8, 47, 73, 0.12), inset 0 1.5px 2px rgba(255, 255, 255, 0.90)',
      } as any,
    }),
  },
});
