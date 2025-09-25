import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Text, FAB, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../components/ThemeContext';
import Header from '../components/Header';

const USER_PROFILE_KEY = 'userProfile';

export default function ProfileScreen() {
    const router = useRouter();
    const { theme } = useTheme();

    const [isEditing, setIsEditing] = useState(false);

    // Estados para os dados do perfil, incluindo a imagem
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const savedProfile = await AsyncStorage.getItem(USER_PROFILE_KEY);
                if (savedProfile) {
                    const { name, email, bio, imageUri } = JSON.parse(savedProfile);
                    setName(name);
                    setEmail(email);
                    setBio(bio);
                    setImageUri(imageUri);
                }
            } catch (e) {
                console.error("Failed to load profile data.", e);
            }
        };

        loadProfile();
    }, []);

    // Função para escolher uma imagem da galeria
    const handlePickImage = async () => {
        // Só permite escolher imagem se estiver no modo de edição
        if (!isEditing) return;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], // Força a imagem a ser quadrada
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSaveChanges = async () => {
        try {
            // Inclui a URI da imagem nos dados a serem salvos
            const profileData = { name, email, bio, imageUri };
            await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profileData));
            setIsEditing(false);
            Alert.alert("Sucesso", "Perfil atualizado!");
        } catch (e) {
            console.error("Failed to save profile data.", e);
            Alert.alert("Erro", "Não foi possível salvar as alterações.");
        }
    };

    const handleFabPress = () => {
        if (isEditing) {
            handleSaveChanges();
        } else {
            setIsEditing(true);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Header title="Meu Perfil" showBack onBack={() => router.back()} />
            
            <View style={styles.content}>
                {/* Container para a imagem de perfil */}
                <View style={styles.avatarContainer}>
                    <TouchableOpacity onPress={handlePickImage} disabled={!isEditing}>
                        {/* Se tiver uma imagem, mostra. Senão, mostra um ícone genérico. */}
                        {imageUri ? (
                            <Avatar.Image size={120} source={{ uri: imageUri }} />
                        ) : (
                            <Avatar.Icon size={120} icon="account" />
                        )}
                        {/* Mostra um ícone de "câmera" sobre a imagem no modo de edição */}
                        {isEditing && (
                            <View style={[styles.editIcon, {backgroundColor: theme.colors.primary}]}>
                                <Avatar.Icon size={30} icon="camera" color={theme.colors.onPrimary} style={{backgroundColor: 'transparent'}}/>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <TextInput
                    label="Nome"
                    value={name}
                    onChangeText={setName}
                    editable={isEditing}
                    mode="outlined"
                    activeOutlineColor={theme.colors.primary}
                    style={[styles.input, isEditing && { backgroundColor: theme.colors.surfaceVariant }]}
                />
                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    editable={isEditing}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    activeOutlineColor={theme.colors.primary}
                    style={[styles.input, isEditing && { backgroundColor: theme.colors.surfaceVariant }]}
                />
                <TextInput
                    label="Bio"
                    value={bio}
                    onChangeText={setBio}
                    editable={isEditing}
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    activeOutlineColor={theme.colors.primary}
                    style={[styles.input, isEditing && { backgroundColor: theme.colors.surfaceVariant }]}
                />
            </View>

            <FAB
                style={styles.fab}
                icon={isEditing ? "check" : "pencil"}
                onPress={handleFabPress}
                label={isEditing ? "Salvar" : "Editar"}
                color={theme.colors.onPrimary}
                theme={{ colors: { primaryContainer: theme.colors.primary } }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderRadius: 15,
        padding: 2,
    },
    input: {
        marginBottom: 15,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 80,
    },
});