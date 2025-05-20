import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import colors from '../constants/colors';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const router = useRouter();

    // Aqui você pode buscar o nome do usuário do AsyncStorage/contexto
    const username = "Usuário Exemplo";

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Perfil" showBack onBack={() => router.back()} />
            <View style={styles.content}>
                <Text style={styles.label}>Nome:</Text>
                <Text style={styles.value}>{username}</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#181825',
    },
    content: {
        marginTop: 32,
        alignItems: 'center',
    },
    label: {
        color: colors.textSecondary,
        fontSize: 18,
        marginBottom: 8,
    },
    value: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 32,
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