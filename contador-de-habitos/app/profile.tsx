import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Image } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import Header from '../components/Header';
import { useRouter } from 'expo-router';
import { useTheme } from '../components/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
    const router = useRouter();
    const { theme } = useTheme();

    const [name, setName] = useState("Usuário Exemplo");
    const [age, setAge] = useState("28");
    const [email, setEmail] = useState("usuario@exemplo.com");
    const [photo, setPhoto] = useState("https://randomuser.me/api/portraits/men/1.jpg");

    useEffect(() => {
      // ... (lógica de carregamento inalterada)
    }, []);

    useEffect(() => { AsyncStorage.setItem('profile_name', name); }, [name]);
    useEffect(() => { AsyncStorage.setItem('profile_age', age); }, [age]);
    useEffect(() => { AsyncStorage.setItem('profile_email', email); }, [email]);
    useEffect(() => { AsyncStorage.setItem('profile_photo', photo); }, [photo]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Header title="Perfil" showBack onBack={() => router.back()} />
            <View style={styles.content}>
                <Image source={{ uri: photo }} style={styles.avatar} />
                <TextInput
                    label="Nome"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                    mode="outlined"
                />
                <TextInput
                    label="Idade"
                    value={age}
                    onChangeText={setAge}
                    style={styles.input}
                    mode="outlined"
                    keyboardType="numeric"
                />
                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    label="URL da Foto"
                    value={photo}
                    onChangeText={setPhoto}
                    style={styles.input}
                    mode="outlined"
                    autoCapitalize="none"
                />
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
        paddingHorizontal: 20,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 24,
    },
    input: {
        width: '100%',
        marginBottom: 16,
    },
});