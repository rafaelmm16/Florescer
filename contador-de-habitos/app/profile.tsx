import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Header from '../components/Header';
import colors from '../constants/colors';
import { useRouter } from 'expo-router';
import { useTheme } from '../components/ThemeContext';

export default function ProfileScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Aqui você pode buscar o nome do usuário do AsyncStorage/contexto
    const username = "Usuário Exemplo";

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#181825' : '#fff' }]}>
            <Header title="Perfil" showBack onBack={() => router.back()} />
            <View style={styles.content}>
                <Text style={[styles.label, { color: isDark ? '#fff' : colors.textSecondary }]}>Nome:</Text>
                <Text style={[styles.value, { color: isDark ? '#fff' : '#222' }]}>{username}</Text>
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
        marginBottom: 8,
    },
    value: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 32,
    },
});