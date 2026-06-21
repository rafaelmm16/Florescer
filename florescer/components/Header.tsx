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
  const { theme } = useTheme();

  return (
    <View style={[styles.headerWrapper, { backgroundColor: theme.colors.background }]}>
      <View style={styles.topRow}>
        {showBack && (
          <TouchableOpacity onPress={onBack || (() => router.back())} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={theme.colors.onSurface} />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          {subtitle && (
            <Text style={[styles.subtitle, { color: theme.colors.primary }]}>
              {subtitle}
            </Text>
          )}
          <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <View style={styles.rightContainer}>
          {right}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 20 : 60,
    paddingBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  backButton: {
    paddingRight: 16,
    paddingVertical: 8,
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  }
});