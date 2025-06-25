import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from './ThemeContext'; // 1. Importar o hook

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
}

export default function Header({ title, showBack = false, onBack, right }: HeaderProps) {
  const router = useRouter();
  const { theme } = useTheme(); // 2. Obter o tema atual

  return (
    // 3. Aplicar a cor de fundo do tema
    <View style={[styles.headerWrapper, { backgroundColor: theme.colors.surface }]}>
      {showBack ? (
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
           {/* 4. Aplicar a cor do ícone do tema */}
          <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
      {/* 5. Aplicar a cor do texto do tema */}
      <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]} numberOfLines={1}>
        {title}
      </Text>
      <View style={[styles.placeholder, styles.rightContainer]}>
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 50,
    paddingBottom: 16,
    height: Platform.OS === 'android' ? 56 + (StatusBar.currentHeight ?? 0) : 88,
    elevation: 2, // Sombra sutil para o header
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '400',
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  rightContainer: {
    alignItems: 'flex-end', 
    justifyContent: 'center'
  }
});