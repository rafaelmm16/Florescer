import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Switch, Avatar, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../components/ThemeContext';
import Header from '../components/Header';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const USER_PROFILE_KEY = 'userProfile';

export default function SettingsScreen() {
    const router = useRouter();
    const { toggleTheme, isDark, theme } = useTheme();

    const [isEditing, setIsEditing] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const savedProfile = await AsyncStorage.getItem(USER_PROFILE_KEY);
                if (savedProfile) {
                    const data = JSON.parse(savedProfile);
                    setName(data.name || '');
                    setEmail(data.email || '');
                    setBio(data.bio || '');
                    setImageUri(data.imageUri || null);
                }
            } catch (e) {
                console.error("Failed to load profile data.", e);
            }
        };
        loadProfile();
    }, []);

    const handlePickImage = async () => {
        if (!isEditing) return;
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSaveChanges = async () => {
        try {
            const profileData = { name, email, bio, imageUri };
            await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profileData));
            setIsEditing(false);
            Alert.alert("Sucesso", "Seu perfil floresceu com as novas mudanças! 🌱");
        } catch (e) {
            Alert.alert("Erro", "Não foi possível salvar as alterações.");
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Header title="Perfil" subtitle="Suas configurações" showBack onBack={() => router.back()} />
            
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.avatarSection}>
                    <TouchableOpacity onPress={handlePickImage} disabled={!isEditing} activeOpacity={0.8}>
                        {imageUri ? (
                            <Avatar.Image size={130} source={{ uri: imageUri }} style={styles.avatarShadow} />
                        ) : (
                            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.surfaceVariant }]}>
                                <Avatar.Icon size={130} icon="leaf" color={theme.colors.primary} style={{backgroundColor: 'transparent'}} />
                            </View>
                        )}
                        {isEditing && (
                            <View style={[styles.editBadge, {backgroundColor: theme.colors.primary}]}>
                                <Avatar.Icon size={36} icon="camera" color={theme.colors.onPrimary} style={{backgroundColor: 'transparent'}}/>
                            </View>
                        )}
                    </TouchableOpacity>
                    {!isEditing && name ? (
                        <Text style={[styles.userName, { color: theme.colors.onSurface }]}>{name}</Text>
                    ) : null}
                </View>

                <View style={[styles.card, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.shadow }]}>
                    <View style={styles.optionRow}>
                        <View>
                            <Text style={[styles.optionTitle, { color: theme.colors.onSurface }]}>Modo Escuro</Text>
                            <Text style={[styles.optionSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                                {isDark ? "Ativado" : "Desativado"}
                            </Text>
                        </View>
                        <Switch 
                            value={isDark} 
                            onValueChange={toggleTheme} 
                            color={theme.colors.primary} 
                        />
                    </View>
                </View>

                <View style={[styles.card, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.shadow }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Informações Pessoais</Text>
                    
                    <TextInput
                        label="Nome"
                        value={name}
                        onChangeText={setName}
                        editable={isEditing}
                        mode="flat"
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        style={[styles.input, { backgroundColor: isEditing ? theme.colors.surfaceVariant : 'transparent' }]}
                        textColor={theme.colors.onSurface}
                    />
                    <View style={[styles.divider, { backgroundColor: theme.colors.surfaceVariant }]} />
                    
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        editable={isEditing}
                        mode="flat"
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={[styles.input, { backgroundColor: isEditing ? theme.colors.surfaceVariant : 'transparent' }]}
                        textColor={theme.colors.onSurface}
                    />
                    <View style={[styles.divider, { backgroundColor: theme.colors.surfaceVariant }]} />
                    
                    <TextInput
                        label="Bio"
                        value={bio}
                        onChangeText={setBio}
                        editable={isEditing}
                        mode="flat"
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        multiline
                        numberOfLines={3}
                        style={[styles.input, { backgroundColor: isEditing ? theme.colors.surfaceVariant : 'transparent' }]}
                        textColor={theme.colors.onSurface}
                    />
                </View>

                <TouchableOpacity 
                    style={styles.saveButtonContainer}
                    onPress={isEditing ? handleSaveChanges : () => setIsEditing(true)}
                    activeOpacity={0.9}
                >
                    <LinearGradient 
                        colors={[theme.colors.primary, theme.colors.primaryContainer]} 
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={styles.saveButton}
                    >
                        <Text style={[styles.saveButtonText, { color: theme.colors.onPrimary }]}>
                            {isEditing ? "Salvar Alterações" : "Editar Perfil"}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 24,
        paddingBottom: 40,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarShadow: {
        elevation: 8,
    },
    avatarPlaceholder: {
        width: 130,
        height: 130,
        borderRadius: 65,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderRadius: 20,
        padding: 4,
        elevation: 4,
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        marginTop: 16,
    },
    card: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        elevation: 4,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    optionSubtitle: {
        fontSize: 14,
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    input: {
        fontSize: 16,
        paddingHorizontal: 0,
        borderRadius: 8,
    },
    divider: {
        height: 1,
        width: '100%',
        marginVertical: 8,
    },
    saveButtonContainer: {
        marginTop: 8,
        borderRadius: 16,
        elevation: 6,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    saveButton: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: '700',
    }
});