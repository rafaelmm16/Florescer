import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
            activeOpacity={0.7}
            style={[
              styles.backButton,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
              },
            ]}
            accessibilityLabel="Voltar"
          >
            <Ionicons name="chevron-back" size={20} color={theme.colors.onSurface} />
          </TouchableOpacity>
        )}

        <View style={styles.titleContainer}>
          {subtitle && (
            <Text
              style={[
                styles.subtitleText,
                { color: theme.colors.onSurfaceVariant },
              ]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 12 : 12,
    paddingBottom: 14,
    zIndex: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholderRight: {
    width: 38,
  },
});