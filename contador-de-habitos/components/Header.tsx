import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import colors from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
}

export default function Header({ title, showBack = false, onBack, right }: HeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.headerWrapper}>
      {showBack ? (
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={colors.primary} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 40 }} />
      )}
      <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
      <View style={{ width: 40, alignItems: 'flex-end', justifyContent: 'center' }}>
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(35, 33, 54, 0.98)',
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 12 : 36,
    paddingBottom: 18,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    width: '100%',
    minHeight: 70,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    position: 'relative',
  },
  headerTitle: {
    flex: 1,
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Heavy' : 'sans-serif-condensed',
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});