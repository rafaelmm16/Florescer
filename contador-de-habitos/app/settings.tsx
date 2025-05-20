import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import colors from '../constants/colors';
import { useRouter } from 'expo-router';
import { useTheme } from '../components/ThemeContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#181825' : '#fff' }]}>
      <Header title="Configurações" showBack onBack={() => router.back()} />
      <View style={styles.content}>
        <Text style={[styles.label, { color: isDark ? '#fff' : '#222' }]}>
          Tema: {isDark ? 'Dark' : 'Light'}
        </Text>
        <TouchableOpacity style={styles.button} onPress={toggleTheme}>
          <Text style={styles.buttonText}>
            Trocar para tema {isDark ? 'claro' : 'escuro'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    marginTop: 32,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});