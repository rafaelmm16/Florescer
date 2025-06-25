import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext'; // 1. Importar o hook

export default function Navbar() {
  const pathname = usePathname();
  const { theme } = useTheme(); // 2. Obter o tema atual

  const navItems = [
    { href: '/', icon: 'home', text: 'Início' },
    { href: '/completed', icon: 'checkmark-done', text: 'Concluídos' },
    { href: '/trash', icon: 'trash', text: 'Lixeira' },
    { href: '/profile', icon: 'person', text: 'Perfil' },
    { href: '/settings', icon: 'settings', text: 'Ajustes' },
  ];

  return (
    // 3. Aplicar as cores de fundo e borda do tema
    <View style={[styles.navbar, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outline }]}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        
        // 4. Determinar as cores com base no tema e no estado (ativo/inativo)
        const iconColor = isActive ? theme.colors.onSecondaryContainer : theme.colors.onSurfaceVariant;
        const textColor = isActive ? theme.colors.onSurface : theme.colors.onSurfaceVariant;
        const iconContainerStyle = isActive
          ? [styles.iconContainer, { backgroundColor: theme.colors.secondaryContainer }]
          : styles.iconContainer;

        return (
          <Link href={item.href} asChild key={item.href}>
            <TouchableOpacity style={styles.navItem}>
              <View style={iconContainerStyle}>
                <Ionicons
                  name={isActive ? item.icon : `${item.icon}-outline`}
                  size={24}
                  color={iconColor}
                />
              </View>
              <Text style={[styles.navText, { color: textColor, fontWeight: isActive ? 'bold' : 'normal' }]}>
                {item.text}
              </Text>
            </TouchableOpacity>
          </Link>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: 5,
    borderTopWidth: 1,
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
  iconContainer: {
    width: 64,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  navText: {
    fontSize: 12,
    marginTop: 2,
  },
});