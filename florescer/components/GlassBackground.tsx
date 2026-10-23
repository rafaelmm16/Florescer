import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { useTheme } from './ThemeContext';

interface GlassBackgroundProps {
  children: React.ReactNode;
}

export default function GlassBackground({ children }: GlassBackgroundProps) {
  const { theme, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Apple-style Optical Liquid Pools (Vibrant chromatic substrate for refraction) */}
      <Svg width="100%" height="100%" pointerEvents="none" style={styles.svgBackground}>
        <Defs>
          {/* Top-Right Vibrant Electric Turquoise Aura */}
          <RadialGradient id="liquidPool1" cx="82%" cy="14%" rx="72%" ry="55%">
            <Stop
              offset="0%"
              stopColor={isDark ? '#00F2FE' : '#06B6D4'}
              stopOpacity={isDark ? 0.38 : 0.24}
            />
            <Stop
              offset="50%"
              stopColor={isDark ? '#0891B2' : '#22D3EE'}
              stopOpacity={isDark ? 0.18 : 0.10}
            />
            <Stop
              offset="100%"
              stopColor={isDark ? '#00F2FE' : '#06B6D4'}
              stopOpacity={0}
            />
          </RadialGradient>

          {/* Center-Right Oceanic Deep Cyan Glow */}
          <RadialGradient id="liquidPool2" cx="92%" cy="52%" rx="60%" ry="48%">
            <Stop
              offset="0%"
              stopColor={isDark ? '#0284C7' : '#38BDF8'}
              stopOpacity={isDark ? 0.28 : 0.16}
            />
            <Stop
              offset="55%"
              stopColor={isDark ? '#0369A1' : '#7DD3FC'}
              stopOpacity={isDark ? 0.12 : 0.06}
            />
            <Stop
              offset="100%"
              stopColor={isDark ? '#0284C7' : '#38BDF8'}
              stopOpacity={0}
            />
          </RadialGradient>

          {/* Center-Left Luminous Aquamarine / Seafoam */}
          <RadialGradient id="liquidPool3" cx="10%" cy="40%" rx="68%" ry="52%">
            <Stop
              offset="0%"
              stopColor={isDark ? '#2DD4BF' : '#14B8A6'}
              stopOpacity={isDark ? 0.32 : 0.20}
            />
            <Stop
              offset="50%"
              stopColor={isDark ? '#0D9488' : '#5EEAD4'}
              stopOpacity={isDark ? 0.14 : 0.08}
            />
            <Stop
              offset="100%"
              stopColor={isDark ? '#2DD4BF' : '#14B8A6'}
              stopOpacity={0}
            />
          </RadialGradient>

          {/* Bottom-Center Deep Oceanic Teal Refraction */}
          <RadialGradient id="liquidPool4" cx="50%" cy="90%" rx="72%" ry="50%">
            <Stop
              offset="0%"
              stopColor={isDark ? '#0891B2' : '#0EA5E9'}
              stopOpacity={isDark ? 0.26 : 0.15}
            />
            <Stop
              offset="60%"
              stopColor={isDark ? '#0F766E' : '#38BDF8'}
              stopOpacity={isDark ? 0.10 : 0.05}
            />
            <Stop
              offset="100%"
              stopColor={isDark ? '#0891B2' : '#0EA5E9'}
              stopOpacity={0}
            />
          </RadialGradient>
        </Defs>

        <Rect width="100%" height="100%" fill="url(#liquidPool1)" />
        <Rect width="100%" height="100%" fill="url(#liquidPool2)" />
        <Rect width="100%" height="100%" fill="url(#liquidPool3)" />
        <Rect width="100%" height="100%" fill="url(#liquidPool4)" />
      </Svg>

      {/* Content wrapper */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  svgBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

