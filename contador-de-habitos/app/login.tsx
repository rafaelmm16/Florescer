import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';
import colors from '../constants/colors';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const router = useRouter();

    const handleLogin = () => {
        if (username.trim()) {
            // Aqui você pode salvar o usuário em AsyncStorage ou contexto
            router.replace('/');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.title}>Entrar</Text>
                <View style={styles.inputForm}>
                    <Ionicons name="person-outline" size={20} color="#888" />
                    <TextInput
                        style={styles.input}
                        placeholder="Nome de usuário"
                        placeholderTextColor={colors.placeholder}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                </View>
                <TouchableOpacity
                    style={[styles.button, !username.trim() && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={!username.trim()}
                >
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
                <Text style={styles.or}>Ou entre com</Text>
                <View style={styles.socialRow}>
                    <TouchableOpacity style={styles.socialBtn}>
                        <FontAwesome name="google" size={20} color="#EA4335" />
                        <Text style={styles.socialText}>Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialBtn}>
                        <FontAwesome name="apple" size={20} color="#000" />
                        <Text style={styles.socialText}>Apple</Text>
                    </TouchableOpacity>
                </View>
                {/* Botão para entrar como usuário */}
                <TouchableOpacity
                    style={styles.guestBtn}
                    onPress={() => router.replace('/')}
                >
                    <Ionicons name="person" size={20} color="#fff" />
                    <Text style={styles.guestText}>Entrar como usuário</Text>
                </TouchableOpacity>
                <Text style={styles.signup}>
                    Não tem uma conta? <Text style={styles.signupLink}>Cadastre-se</Text>
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#181825',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    form: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 20,
        width: 340,
        elevation: 8,
        alignItems: 'center',
        boxShadow: Platform.OS === 'web' ? '0 4px 16px rgba(0,0,0,0.12)' : undefined,
    },
    title: {
        fontSize: 28,
        color: '#151717',
        fontWeight: 'bold',
        marginBottom: 24,
    },
    inputForm: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#ecedec',
        borderRadius: 10,
        height: 50,
        paddingLeft: 10,
        marginBottom: 18,
        width: '100%',
        backgroundColor: '#f8f8f8',
    },
    input: {
        marginLeft: 10,
        borderRadius: 10,
        borderWidth: 0,
        width: '85%',
        height: '100%',
        color: '#151717',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#151717',
        borderRadius: 10,
        height: 50,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 16,
    },
    buttonDisabled: {
        backgroundColor: '#bdbdbd',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 17,
    },
    or: {
        color: '#888',
        fontSize: 14,
        marginVertical: 8,
    },
    socialRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 10,
    },
    socialBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ededef',
        backgroundColor: '#fff',
        borderRadius: 10,
        height: 50,
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 2,
        gap: 8,
    },
    socialText: {
        fontWeight: '500',
        color: '#151717',
        fontSize: 15,
        marginLeft: 6,
    },
    guestBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2d79f3',
        borderRadius: 10,
        height: 50,
        width: '100%',
        justifyContent: 'center',
        marginVertical: 10,
    },
    guestText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 17,
        marginLeft: 8,
    },
    signup: {
        textAlign: 'center',
        color: '#151717',
        fontSize: 14,
        marginTop: 10,
    },
    signupLink: {
        color: '#2d79f3',
        fontWeight: 'bold',
    },
});