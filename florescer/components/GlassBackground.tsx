import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useTheme } from './ThemeContext';

interface GlassBackgroundProps {
  children: React.ReactNode;
}

export default function GlassBackground({ children }: GlassBackgroundProps) {
  const { theme, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Ambient subtle top glow for depth without visual noise */}
      <View
        pointerEvents="none"
        style={[
          styles.ambientGlow,
          {
            backgroundColor: isDark
              ? 'rgba(56, 189, 248, 0.04)'
              : 'rgba(15, 23, 42, 0.02)',
          },
        ]}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  ambientGlow: {
    position: 'absolute',
    top: -120,
    left: '10%',
    right: '10%',
    height: 280,
    borderRadius: 140,
    ...Platform.select({
      web: {
        filter: 'blur(90px)',
      } as any,
    }),
  },
  content: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
