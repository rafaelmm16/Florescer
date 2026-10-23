import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';
import { useTheme } from './ThemeContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
}

export default function Header({ title, subtitle, showBack = false, onBack, right }: HeaderProps) {
  const router = useRouter();
  const { theme, isDark } = useTheme();

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.topRow}>
        {showBack && (
          <TouchableOpacity
            onPress={onBack || (() => router.back())}
            activeOpacity={0.8}
            accessibilityLabel="Voltar"
          >
            <LiquidGlassView
              interactive
              effect="clear"
              colorScheme={isDark ? 'dark' : 'light'}
              style={[
                styles.backButton,
                !isLiquidGlassSupported && (isDark ? styles.fallbackDark : styles.fallbackLight),
              ]}
            >
              <Ionicons name="chevron-back" size={20} color={theme.colors.onSurface} />
            </LiquidGlassView>
          </TouchableOpacity>
        )}

        <View style={styles.titleContainer}>
          {subtitle && (
            <LiquidGlassView
              effect="clear"
              colorScheme={isDark ? 'dark' : 'light'}
              tintColor={isDark ? 'rgba(0, 242, 254, 0.18)' : 'rgba(6, 182, 212, 0.12)'}
              style={[
                styles.subtitleBadge,
                !isLiquidGlassSupported && (isDark ? styles.badgeFallbackDark : styles.badgeFallbackLight),
              ]}
            >
              <Text style={styles.leafIcon}>🌱</Text>
              <Text
                style={[
                  styles.subtitleText,
                  { color: theme.colors.primary },
                ]}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            </LiquidGlassView>
          )}

          <Text
            style={[
              styles.headerTitle,
              { color: theme.colors.onSurface },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>

        {right ? (
          <View style={styles.rightContainer}>{right}</View>
        ) : showBack ? (
          <View style={styles.placeholderRight} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 16 : 14,
    paddingBottom: 16,
    zIndex: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.20)',
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  subtitleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.30)',
  },
  leafIcon: {
    fontSize: 12,
    marginRight: 5,
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  placeholderRight: {
    width: 42,
  },
  fallbackDark: {
    backgroundColor: 'rgba(10, 29, 46, 0.70)',
    borderColor: 'rgba(0, 242, 254, 0.25)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      } as any,
    }),
  },
  fallbackLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.80)',
    borderColor: 'rgba(255, 255, 255, 0.90)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      } as any,
    }),
  },
  badgeFallbackDark: {
    backgroundColor: 'rgba(0, 242, 254, 0.14)',
  },
  badgeFallbackLight: {
    backgroundColor: 'rgba(6, 182, 212, 0.10)',
  },
});