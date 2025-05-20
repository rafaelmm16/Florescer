import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Link, usePathname } from 'expo-router';
import colors from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <View style={styles.navbar}>
      <Link href="/" asChild>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons
            name={pathname === '/' ? 'home' : 'home-outline'}
            size={24}
            color={pathname === '/' ? colors.primary : colors.text}
          />
          <Text style={[styles.navText, pathname === '/' && styles.active]}>Início</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/profile" asChild>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons
            name={pathname === '/profile' ? 'person' : 'person-outline'}
            size={24}
            color={pathname === '/profile' ? colors.primary : colors.text}
          />
          <Text style={[styles.navText, pathname === '/profile' && styles.active]}>Perfil</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/settings" asChild>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons
            name={pathname === '/settings' ? 'settings' : 'settings-outline'}
            size={24}
            color={pathname === '/settings' ? colors.primary : colors.text}
          />
          <Text style={[styles.navText, pathname === '/settings' && styles.active]}>Configurações</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  active: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});