import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { TextInput, Button, Text } from 'react-native-paper';
import { useTheme } from '../components/ThemeContext';
import { useAuth } from '../components/AuthContext'; // Importar useAuth

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const router = useRouter();
    const { theme } = useTheme();
    const { login } = useAuth(); // Usar a função de login do contexto

    const handleLogin = async () => {
        if (username.trim()) {
            await login(); // Chamar a função de login
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.form, { backgroundColor: theme.colors.surface }]}>
                <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.onSurface }]}>Entrar</Text>

                <TextInput
                    label="Nome de usuário"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                    left={<TextInput.Icon icon={() => <Ionicons name="person-outline" size={20} color={theme.colors.onSurfaceVariant} />} />}
                    mode="outlined"
                    autoCapitalize="none"
                />

                <Button
                    mode="contained"
                    onPress={handleLogin}
                    disabled={!username.trim()}
                    style={styles.button}
                >
                    Entrar
                </Button>

                <Text variant="bodyMedium" style={styles.or}>Ou entre com</Text>

                <View style={styles.socialRow}>
                    <Button mode="outlined" style={styles.socialBtn} icon={() => <FontAwesome name="google" size={20} color="#EA4335" />}>
                        Google
                    </Button>
                    <Button mode="outlined" style={styles.socialBtn} icon={() => <FontAwesome name="apple" size={20} color={theme.colors.onSurface} />}>
                        Apple
                    </Button>
                </View>

                <Button
                    mode="elevated"
                    onPress={() => router.replace('/')}
                    style={styles.guestBtn}
                    icon="person"
                >
                    Entrar como usuário
                </Button>

                <Text style={styles.signup}>
                    Não tem uma conta? <Text style={styles.signupLink}>Cadastre-se</Text>
                </Text>
            </View>
        </SafeAreaView>
    );
}

// Estilos permanecem os mesmos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    form: {
        padding: 30,
        borderRadius: 28,
        width: 340,
        alignItems: 'center',
        elevation: 4,
    },
    title: {
        marginBottom: 24,
    },
    input: {
        width: '100%',
        marginBottom: 18,
    },
    button: {
        width: '100%',
        marginVertical: 16,
        paddingVertical: 4,
    },
    or: {
        marginVertical: 16,
    },
    socialRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    socialBtn: {
        flex: 1,
        marginHorizontal: 4,
    },
    guestBtn: {
        width: '100%',
        marginVertical: 10,
    },
    signup: {
        textAlign: 'center',
        fontSize: 14,
        marginTop: 20,
    },
    signupLink: {
        color: '#6C63FF',
        fontWeight: 'bold',
    },
});