import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, ScrollView, Image, TextInput, Platform } from 'react-native';
import { Text, Switch } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../components/ThemeContext';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import GlassBackground from '../components/GlassBackground';
import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';
import {
  saveUserProfile,
  fetchProfileFromDatabase,
  checkDatabaseHealth,
  USER_PROFILE_KEY,
} from '../services/database';

export default function SettingsScreen() {
  const router = useRouter();
  const { toggleTheme, isDark, theme } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; cluster?: string }>({
    connected: false,
  });

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

        // Try to fetch latest from MongoDB Atlas
        const remote = await fetchProfileFromDatabase();
        if (remote) {
          if (remote.name) setName(remote.name);
          if (remote.email) setEmail(remote.email);
          if (remote.bio) setBio(remote.bio);
          if (remote.imageUri) setImageUri(remote.imageUri);
        }
      } catch (e) {
        console.error('Failed to load profile data.', e);
      }
    };
    loadProfile();
    checkDatabaseHealth().then(setDbStatus);
  }, []);

  const handlePickImage = async () => {
    if (!isEditing) return;
    const result = await ImagePicker.launchImageLibraryAsync({
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
      const { syncedWithMongo } = await saveUserProfile(profileData);
      setIsEditing(false);
      if (syncedWithMongo) {
        Alert.alert('Sucesso', 'Seu perfil foi atualizado e sincronizado com o MongoDB Atlas! 🍃');
      } else {
        Alert.alert('Sucesso', 'Seu perfil floresceu com as novas mudanças! 🌱');
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  };

  return (
    <GlassBackground>
      <SafeAreaView style={styles.safeArea}>
      <Header
        title="Perfil"
        subtitle="Configurações & Conta"
        showBack
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            onPress={handlePickImage}
            disabled={!isEditing}
            activeOpacity={0.8}
            style={styles.avatarTouchable}
          >
            <View
              style={[
                styles.avatarGlowRing,
                {
                  borderColor: isDark ? 'rgba(52, 211, 153, 0.45)' : 'rgba(16, 185, 129, 0.4)',
                  backgroundColor: isDark ? 'rgba(22, 32, 50, 0.75)' : 'rgba(255, 255, 255, 0.82)',
                  shadowColor: theme.colors.primary,
                },
              ]}
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.avatarImage} />
              ) : (
                <View
                  style={[
                    styles.avatarPlaceholder,
                    {
                      backgroundColor: isDark
                        ? 'rgba(16, 185, 129, 0.18)'
                        : 'rgba(16, 185, 129, 0.12)',
                    },
                  ]}
                >
                  <Ionicons name="leaf" size={54} color={theme.colors.primary} />
                </View>
              )}

              {isEditing && (
                <View
                  style={[
                    styles.cameraBadge,
                    {
                      backgroundColor: theme.colors.primary,
                      borderColor: '#FFFFFF',
                    },
                  ]}
                >
                  <Ionicons name="camera" size={18} color="#FFFFFF" />
                </View>
              )}
            </View>
          </TouchableOpacity>

          <Text style={[styles.userName, { color: theme.colors.onSurface }]}>
            {name || 'Seu Nome'}
          </Text>
          {bio ? (
            <Text style={[styles.userBio, { color: theme.colors.onSurfaceVariant }]}>
              {bio}
            </Text>
          ) : null}

          {/* MongoDB Atlas Sync Pill */}
          <LiquidGlassView
            effect="clear"
            colorScheme={isDark ? 'dark' : 'light'}
            tintColor={isDark ? 'rgba(0, 242, 254, 0.12)' : 'rgba(6, 182, 212, 0.10)'}
            style={[
              styles.dbStatusPill,
              {
                borderColor: dbStatus.connected
                  ? 'rgba(0, 242, 254, 0.35)'
                  : 'rgba(245, 158, 11, 0.35)',
              },
              !isLiquidGlassSupported && {
                backgroundColor: isDark
                  ? 'rgba(10, 29, 46, 0.78)'
                  : 'rgba(255, 255, 255, 0.82)',
              },
            ]}
          >
            <View
              style={[
                styles.dbStatusDot,
                { backgroundColor: dbStatus.connected ? '#00F2FE' : '#F59E0B' },
              ]}
            />
            <Text style={[styles.dbStatusText, { color: theme.colors.onSurfaceVariant }]}>
              {dbStatus.connected
                ? 'Sincronizado com MongoDB Atlas 🍃'
                : 'Armazenamento Local Ativo'}
            </Text>
          </LiquidGlassView>
        </View>

        {/* Dark Mode Card */}
        <GlassCard borderRadius={20} style={styles.card}>
          <View style={styles.cardPadding}>
            <View style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <View
                  style={[
                    styles.optionIconBox,
                    {
                      backgroundColor: isDark
                        ? 'rgba(167, 139, 250, 0.22)'
                        : 'rgba(139, 92, 246, 0.14)',
                      borderColor: isDark
                        ? 'rgba(167, 139, 250, 0.35)'
                        : 'rgba(139, 92, 246, 0.25)',
                    },
                  ]}
                >
                  <Ionicons
                    name={isDark ? 'moon' : 'sunny'}
                    size={22}
                    color={isDark ? '#C4B5FD' : '#7C3AED'}
                  />
                </View>
                <View>
                  <Text style={[styles.optionTitle, { color: theme.colors.onSurface }]}>
                    Modo Escuro
                  </Text>
                  <Text style={[styles.optionSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                    {isDark ? 'Tema Escuro Ativado' : 'Tema Claro Ativado'}
                  </Text>
                </View>
              </View>

              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                color={theme.colors.primary}
              />
            </View>
          </View>
        </GlassCard>

        {/* Personal Information Card */}
        <GlassCard borderRadius={20} style={styles.card}>
          <View style={styles.cardPadding}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="person-outline" size={18} color={theme.colors.primary} style={{ marginRight: 6 }} />
              <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
                Informações Pessoais
              </Text>
            </View>

            {/* Name Input */}
            <Text style={[styles.inputLabel, { color: theme.colors.onSurfaceVariant }]}>Nome</Text>
            <View
              style={[
                styles.glassInputBox,
                {
                  backgroundColor: isDark ? 'rgba(10, 16, 28, 0.65)' : 'rgba(255, 255, 255, 0.72)',
                  borderColor: isEditing ? theme.colors.primary : isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(226, 232, 240, 0.85)',
                },
              ]}
            >
              <TextInput
                value={name}
                onChangeText={setName}
                editable={isEditing}
                placeholder="Seu nome completo"
                placeholderTextColor={theme.colors.placeholder}
                style={[styles.inputField, { color: theme.colors.onSurface }]}
              />
            </View>

            {/* Email Input */}
            <Text style={[styles.inputLabel, { color: theme.colors.onSurfaceVariant, marginTop: 14 }]}>
              E-mail
            </Text>
            <View
              style={[
                styles.glassInputBox,
                {
                  backgroundColor: isDark ? 'rgba(10, 16, 28, 0.65)' : 'rgba(255, 255, 255, 0.72)',
                  borderColor: isEditing ? theme.colors.primary : isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(226, 232, 240, 0.85)',
                },
              ]}
            >
              <TextInput
                value={email}
                onChangeText={setEmail}
                editable={isEditing}
                placeholder="seuemail@exemplo.com"
                placeholderTextColor={theme.colors.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[styles.inputField, { color: theme.colors.onSurface }]}
              />
            </View>

            {/* Bio Input */}
            <Text style={[styles.inputLabel, { color: theme.colors.onSurfaceVariant, marginTop: 14 }]}>
              Bio / Lembrete Inspirador
            </Text>
            <View
              style={[
                styles.glassInputBox,
                styles.bioInputBox,
                {
                  backgroundColor: isDark ? 'rgba(10, 16, 28, 0.65)' : 'rgba(255, 255, 255, 0.72)',
                  borderColor: isEditing ? theme.colors.primary : isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(226, 232, 240, 0.85)',
                },
              ]}
            >
              <TextInput
                value={bio}
                onChangeText={setBio}
                editable={isEditing}
                placeholder="Uma frase para cultivar sua melhor versão..."
                placeholderTextColor={theme.colors.placeholder}
                multiline
                numberOfLines={3}
                style={[styles.inputField, styles.bioInputField, { color: theme.colors.onSurface }]}
              />
            </View>
          </View>
        </GlassCard>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.actionBtnContainer}
          onPress={isEditing ? handleSaveChanges : () => setIsEditing(true)}
          activeOpacity={0.88}
        >
          <LinearGradient
            colors={['#00F2FE', '#06B6D4', '#0891B2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionBtnGradient}
          >
            {/* Liquid specular highlight */}
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.45)', 'rgba(255, 255, 255, 0.1)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 0.8 }}
              style={styles.btnShine}
              pointerEvents="none"
            />
            <Ionicons
              name={isEditing ? 'checkmark-circle-outline' : 'pencil-outline'}
              size={20}
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.actionBtnText}>
              {isEditing ? 'Salvar Alterações' : 'Editar Perfil'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Re-open Setup Profile Screen */}
        <TouchableOpacity
          onPress={() => router.push('/setup-profile')}
          activeOpacity={0.8}
          style={styles.reopenSetupBtn}
        >
          <Ionicons name="sparkles-outline" size={15} color={theme.colors.primary} style={{ marginRight: 6 }} />
          <Text style={[styles.reopenSetupText, { color: theme.colors.primary }]}>
            Ver Tela de Configuração Inicial 🌱
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  </GlassBackground>
);
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarTouchable: {
    position: 'relative',
  },
  avatarGlowRing: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  avatarImage: {
    width: 116,
    height: 116,
    borderRadius: 58,
  },
  avatarPlaceholder: {
    width: 116,
    height: 116,
    borderRadius: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 14,
    letterSpacing: -0.3,
  },
  userBio: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  card: {
    marginBottom: 18,
  },
  cardPadding: {
    padding: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  optionSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  glassInputBox: {
    borderRadius: 14,
    borderWidth: 1.2,
    paddingHorizontal: 14,
    height: 50,
    justifyContent: 'center',
  },
  bioInputBox: {
    height: 80,
    paddingVertical: 10,
    alignItems: 'flex-start',
  },
  inputField: {
    fontSize: 15,
    width: '100%',
    ...Platform.select({
      web: { outlineStyle: 'none' } as any,
    }),
  },
  bioInputField: {
    textAlignVertical: 'top',
    height: '100%',
  },
  actionBtnContainer: {
    marginTop: 6,
    borderRadius: 20,
    elevation: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  actionBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    borderWidth: 1.2,
    overflow: 'hidden',
    position: 'relative',
  },
  btnShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 18,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  dbStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 12,
    gap: 6,
  },
  dbStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  dbStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  reopenSetupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
  },
  reopenSetupText: {
    fontSize: 13,
    fontWeight: '700',
  },
});