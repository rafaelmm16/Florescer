import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TextInput } from 'react-native';
import Header from '../components/Header';
import colors from '../constants/colors';
import { useRouter } from 'expo-router';
import { useTheme } from '../components/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Estados editáveis
    const [name, setName] = useState("Usuário Exemplo");
    const [age, setAge] = useState("28");
    const [email, setEmail] = useState("usuario@exemplo.com");
    const [photo, setPhoto] = useState("https://randomuser.me/api/portraits/men/1.jpg");

    // Carrega dados salvos ao abrir a tela
    useEffect(() => {
        (async () => {
            const savedName = await AsyncStorage.getItem('profile_name');
            const savedAge = await AsyncStorage.getItem('profile_age');
            const savedEmail = await AsyncStorage.getItem('profile_email');
            const savedPhoto = await AsyncStorage.getItem('profile_photo');
            if (savedName) setName(savedName);
            if (savedAge) setAge(savedAge);
            if (savedEmail) setEmail(savedEmail);
            if (savedPhoto) setPhoto(savedPhoto);
        })();
    }, []);

    // Salva automaticamente ao editar
    useEffect(() => { AsyncStorage.setItem('profile_name', name); }, [name]);
    useEffect(() => { AsyncStorage.setItem('profile_age', age); }, [age]);
    useEffect(() => { AsyncStorage.setItem('profile_email', email); }, [email]);
    useEffect(() => { AsyncStorage.setItem('profile_photo', photo); }, [photo]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#181825' : '#fff' }]}>
            <Header title="Perfil" showBack onBack={() => router.back()} />
            <View style={styles.content}>
                <Image source={{ uri: photo }} style={styles.avatar} />
                <TextInput
                    style={[styles.name, styles.input, { color: isDark ? '#fff' : '#222', borderColor: isDark ? '#444' : '#ccc' }]}
                    value={name}
                    onChangeText={setName}
                    placeholder="Nome"
                    placeholderTextColor={isDark ? '#aaa' : '#888'}
                />
                <TextInput
                    style={[styles.info, styles.input, { color: isDark ? '#fff' : colors.textSecondary, borderColor: isDark ? '#444' : '#ccc' }]}
                    value={age}
                    onChangeText={setAge}
                    placeholder="Idade"
                    placeholderTextColor={isDark ? '#aaa' : '#888'}
                    keyboardType="numeric"
                />
                <TextInput
                    style={[styles.info, styles.input, { color: isDark ? '#fff' : colors.textSecondary, borderColor: isDark ? '#444' : '#ccc' }]}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    placeholderTextColor={isDark ? '#aaa' : '#888'}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={[styles.info, styles.input, { color: isDark ? '#fff' : colors.textSecondary, borderColor: isDark ? '#444' : '#ccc' }]}
                    value={photo}
                    onChangeText={setPhoto}
                    placeholder="URL da foto"
                    placeholderTextColor={isDark ? '#aaa' : '#888'}
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
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#ccc',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    info: {
        fontSize: 18,
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginBottom: 8,
        width: 250,
    },
});