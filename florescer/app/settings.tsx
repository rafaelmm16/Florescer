import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, ScrollView, Image, TextInput, Platform } from 'react-native';
import { Text, Switch } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../components/ThemeContext';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import GlassBackground from '../components/GlassBackground';
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
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const profileData = { name, email, bio, imageUri };
      const { syncedWithMongo } = await saveUserProfile(profileData);
      setIsEditing(false);
      if (syncedWithMongo) {
        Alert.alert('Sucesso', 'Perfil atualizado e sincronizado com o MongoDB Atlas! 🍃');
      } else {
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso! 🌱');
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  };

  const activeFocusBorder = isDark ? '#38BDF8' : '#0F172A';
  const buttonBg = isDark ? '#38BDF8' : '#0F172A';
  const buttonTextColor = isDark ? '#090D14' : '#FFFFFF';

  return (
    <GlassBackground>
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Perfil"
          subtitle="Preferências & Conta"
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
                  styles.avatarRing,
                  {
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#E2E8F0',
                    backgroundColor: isDark ? '#111622' : '#F1F5F9',
                  },
                ]}
              >
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.avatarImage} />
                ) : (
                  <Ionicons
                    name="person"
                    size={40}
                    color={theme.colors.onSurfaceVariant}
                  />
                )}

                {isEditing && (
                  <View
                    style={[
                      styles.cameraBadge,
                      {
                        backgroundColor: buttonBg,
                        borderColor: isDark ? '#111622' : '#FFFFFF',
                      },
                    ]}
                  >
                    <Ionicons name="camera" size={14} color={buttonTextColor} />
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
            <View
              style={[
                styles.dbStatusPill,
                {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                },
              ]}
            >
              <View
                style={[
                  styles.dbStatusDot,
                  { backgroundColor: dbStatus.connected ? '#10B981' : '#F59E0B' },
                ]}
              />
              <Text style={[styles.dbStatusText, { color: theme.colors.onSurfaceVariant }]}>
                {dbStatus.connected
                  ? 'Sincronizado com MongoDB Atlas'
                  : 'Armazenamento Local'}
              </Text>
            </View>
          </View>

          {/* Dark Mode Card */}
          <GlassCard borderRadius={18} style={styles.card}>
            <View style={styles.cardPadding}>
              <View style={styles.optionRow}>
                <View style={styles.optionLeft}>
                  <View
                    style={[
                      styles.optionIconBox,
                      {
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F8FAFC',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                      },
                    ]}
                  >
                    <Ionicons
                      name={isDark ? 'moon-outline' : 'sunny-outline'}
                      size={20}
                      color={theme.colors.onSurface}
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
                  color={activeFocusBorder}
                />
              </View>
            </View>
          </GlassCard>

          {/* Personal Information Card */}
          <GlassCard borderRadius={18} style={styles.card}>
            <View style={styles.cardPadding}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}>
                Informações Pessoais
              </Text>

              {/* Name Input */}
              <Text style={[styles.inputLabel, { color: theme.colors.onSurfaceVariant }]}>Nome</Text>
              <View
                style={[
                  styles.inputBox,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
                    borderColor: isEditing
                      ? activeFocusBorder
                      : isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : '#E2E8F0',
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
                  styles.inputBox,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
                    borderColor: isEditing
                      ? activeFocusBorder
                      : isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : '#E2E8F0',
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
                Bio / Frase de Foco
              </Text>
              <View
                style={[
                  styles.inputBox,
                  styles.bioInputBox,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
                    borderColor: isEditing
                      ? activeFocusBorder
                      : isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : '#E2E8F0',
                  },
                ]}
              >
                <TextInput
                  value={bio}
                  onChangeText={setBio}
                  editable={isEditing}
                  placeholder="Uma frase para inspirar sua constância..."
                  placeholderTextColor={theme.colors.placeholder}
                  multiline
                  numberOfLines={2}
                  style={[styles.inputField, styles.bioInputField, { color: theme.colors.onSurface }]}
                />
              </View>
            </View>
          </GlassCard>

          {/* Action Button */}
          <TouchableOpacity
            style={[
              styles.actionBtn,
              { backgroundColor: buttonBg },
            ]}
            onPress={isEditing ? handleSaveChanges : () => setIsEditing(true)}
            activeOpacity={0.85}
          >
            <Ionicons
              name={isEditing ? 'checkmark' : 'pencil'}
              size={18}
              color={buttonTextColor}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.actionBtnText, { color: buttonTextColor }]}>
              {isEditing ? 'Salvar Alterações' : 'Editar Perfil'}
            </Text>
          </TouchableOpacity>

          {/* Re-open Setup Profile Screen */}
          <TouchableOpacity
            onPress={() => router.push('/setup-profile')}
            activeOpacity={0.7}
            style={styles.reopenSetupBtn}
          >
            <Text style={[styles.reopenSetupText, { color: theme.colors.onSurfaceVariant }]}>
              Recalibrar Perfil Inicial 🌱
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
    paddingTop: 4,
    paddingBottom: 110,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarTouchable: {
    position: 'relative',
  },
  avatarRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 86,
    height: 86,
    borderRadius: 43,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 12,
    letterSpacing: -0.2,
  },
  userBio: {
    fontSize: 13,
    marginTop: 3,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    marginBottom: 14,
  },
  cardPadding: {
    padding: 18,
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
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  optionSubtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputBox: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 46,
    justifyContent: 'center',
  },
  bioInputBox: {
    height: 72,
    paddingVertical: 8,
    alignItems: 'flex-start',
  },
  inputField: {
    fontSize: 14,
    width: '100%',
    ...Platform.select({
      web: { outlineStyle: 'none' } as any,
    }),
  },
  bioInputField: {
    textAlignVertical: 'top',
    height: '100%',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 15,
    marginTop: 4,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  dbStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 10,
    gap: 6,
  },
  dbStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dbStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  reopenSetupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    paddingVertical: 8,
  },
  reopenSetupText: {
    fontSize: 12,
    fontWeight: '600',
  },
});