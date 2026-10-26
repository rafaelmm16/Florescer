import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../components/ThemeContext';
import GlassCard from '../components/GlassCard';
import GlassBackground from '../components/GlassBackground';
import { saveUserProfile, checkDatabaseHealth } from '../services/database';

const BOTANICAL_PRESETS = [
  { icon: 'leaf', label: 'Broto', emoji: '🌱' },
  { icon: 'rose', label: 'Flor', emoji: '🌸' },
  { icon: 'sunny', label: 'Sol', emoji: '🌻' },
  { icon: 'water', label: 'Orvalho', emoji: '💧' },
  { icon: 'sparkles', label: 'Luz', emoji: '✨' },
];

export default function SetupProfileScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState('🌱');
  const [isSaving, setIsSaving] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [bioFocused, setBioFocused] = useState(false);
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; cluster?: string }>({
    connected: false,
  });

  useEffect(() => {
    checkDatabaseHealth().then(setDbStatus);
  }, []);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (e) {
      console.warn('Image picker error', e);
    }
  };

  const handleSaveAndStart = async () => {
    if (!name || name.trim() === '') {
      Alert.alert('Nome obrigatório', 'Por favor, digite como você gostaria de ser chamado.');
      return;
    }

    setIsSaving(true);
    try {
      const profileData = {
        name: name.trim(),
        email: email.trim(),
        bio: bio.trim(),
        imageUri,
      };

      const result = await saveUserProfile(profileData);

      if (result.syncedWithMongo) {
        Alert.alert(
          'Tudo Pronto! 🌱',
          `Bem-vindo ao Florescer, ${name.trim()}! Seu perfil foi configurado e sincronizado com o MongoDB Atlas.`
        );
      } else {
        Alert.alert(
          'Tudo Pronto! 🌱',
          `Bem-vindo ao Florescer, ${name.trim()}! Seu perfil foi salvo no seu dispositivo.`
        );
      }

      router.replace('/');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o perfil. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const activeFocusBorder = isDark ? '#38BDF8' : '#0F172A';
  const buttonBg = isDark ? '#38BDF8' : '#0F172A';
  const buttonTextColor = isDark ? '#090D14' : '#FFFFFF';

  return (
    <GlassBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Welcome Header */}
          <View style={styles.header}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: isDark ? 'rgba(56, 189, 248, 0.10)' : '#F1F5F9',
                  borderColor: isDark ? 'rgba(56, 189, 248, 0.20)' : '#E2E8F0',
                },
              ]}
            >
              <Text style={[styles.badgeText, { color: isDark ? '#38BDF8' : '#0F172A' }]}>
                BOAS-VINDAS AO FLORESCER 🌱
              </Text>
            </View>

            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Configure seu perfil
            </Text>

            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Defina como você deseja aparecer no aplicativo. Simples, rápido e local.
            </Text>
          </View>

          {/* Avatar Card */}
          <GlassCard borderRadius={18} style={styles.card}>
            <View style={styles.avatarCardContent}>
              <TouchableOpacity
                onPress={handlePickImage}
                activeOpacity={0.8}
                style={styles.avatarTouchable}
                accessibilityLabel="Escolher foto de perfil"
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
                    <Text style={styles.avatarEmoji}>{selectedEmoji}</Text>
                  )}

                  <View
                    style={[
                      styles.cameraBadge,
                      {
                        backgroundColor: buttonBg,
                        borderColor: isDark ? '#111622' : '#FFFFFF',
                      },
                    ]}
                  >
                    <Ionicons name="camera" size={13} color={buttonTextColor} />
                  </View>
                </View>
              </TouchableOpacity>

              <Text style={[styles.avatarHint, { color: theme.colors.onSurfaceVariant }]}>
                Toque para escolher da galeria ou selecione um ícone:
              </Text>

              {/* Preset Icon Chips */}
              <View style={styles.presetsRow}>
                {BOTANICAL_PRESETS.map((preset) => {
                  const isSelected = !imageUri && selectedEmoji === preset.emoji;
                  return (
                    <TouchableOpacity
                      key={preset.emoji}
                      onPress={() => {
                        setImageUri(null);
                        setSelectedEmoji(preset.emoji);
                      }}
                      activeOpacity={0.7}
                      style={[
                        styles.presetChip,
                        {
                          backgroundColor: isSelected
                            ? isDark
                              ? 'rgba(56, 189, 248, 0.12)'
                              : 'rgba(15, 23, 42, 0.06)'
                            : isDark
                            ? 'rgba(255, 255, 255, 0.04)'
                            : '#F8FAFC',
                          borderColor: isSelected
                            ? activeFocusBorder
                            : isDark
                            ? 'rgba(255, 255, 255, 0.08)'
                            : '#E2E8F0',
                        },
                      ]}
                    >
                      <Text style={styles.presetEmoji}>{preset.emoji}</Text>
                      <Text
                        style={[
                          styles.presetLabel,
                          {
                            color: isSelected ? theme.colors.onSurface : theme.colors.onSurfaceVariant,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {preset.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </GlassCard>

          {/* Form Fields Card */}
          <GlassCard borderRadius={18} style={styles.card}>
            <View style={styles.formCardContent}>
              {/* Name Field */}
              <View style={styles.fieldWrapper}>
                <View style={styles.fieldLabelRow}>
                  <Text style={[styles.fieldLabel, { color: theme.colors.onSurface }]}>
                    Seu Nome *
                  </Text>
                  <Text style={[styles.fieldRequired, { color: isDark ? '#38BDF8' : '#0F172A' }]}>
                    Obrigatório
                  </Text>
                </View>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
                      borderColor: nameFocused
                        ? activeFocusBorder
                        : isDark
                        ? 'rgba(255, 255, 255, 0.08)'
                        : '#E2E8F0',
                    },
                  ]}
                >
                  <Ionicons
                    name="person-outline"
                    size={18}
                    color={nameFocused ? activeFocusBorder : theme.colors.placeholder}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Como devemos te chamar? (ex: Rafael)"
                    placeholderTextColor={theme.colors.placeholder}
                    style={[styles.input, { color: theme.colors.onSurface }]}
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                </View>
              </View>

              {/* Email Field */}
              <View style={styles.fieldWrapper}>
                <View style={styles.fieldLabelRow}>
                  <Text style={[styles.fieldLabel, { color: theme.colors.onSurface }]}>
                    E-mail
                  </Text>
                  <Text style={[styles.fieldOptional, { color: theme.colors.onSurfaceVariant }]}>
                    Opcional
                  </Text>
                </View>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
                      borderColor: emailFocused
                        ? activeFocusBorder
                        : isDark
                        ? 'rgba(255, 255, 255, 0.08)'
                        : '#E2E8F0',
                    },
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color={emailFocused ? activeFocusBorder : theme.colors.placeholder}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="seuemail@exemplo.com"
                    placeholderTextColor={theme.colors.placeholder}
                    style={[styles.input, { color: theme.colors.onSurface }]}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                  />
                </View>
              </View>

              {/* Bio Field */}
              <View style={styles.fieldWrapper}>
                <View style={styles.fieldLabelRow}>
                  <Text style={[styles.fieldLabel, { color: theme.colors.onSurface }]}>
                    Frase de Inspiração
                  </Text>
                  <Text style={[styles.fieldOptional, { color: theme.colors.onSurfaceVariant }]}>
                    Opcional
                  </Text>
                </View>
                <View
                  style={[
                    styles.bioInputContainer,
                    {
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
                      borderColor: bioFocused
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
                    placeholder="Uma frase para cultivar sua constância diária..."
                    placeholderTextColor={theme.colors.placeholder}
                    style={[styles.bioInput, { color: theme.colors.onSurface }]}
                    onFocus={() => setBioFocused(true)}
                    onBlur={() => setBioFocused(false)}
                    multiline
                    numberOfLines={2}
                  />
                </View>
              </View>
            </View>
          </GlassCard>

          {/* Database Connection Pill */}
          <View style={styles.dbStatusWrapper}>
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
                  ? 'Conectado ao MongoDB Atlas'
                  : 'Modo Offline / Local-First'}
              </Text>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            onPress={handleSaveAndStart}
            disabled={isSaving}
            activeOpacity={0.85}
            style={[
              styles.submitBtn,
              { backgroundColor: buttonBg },
              isSaving && { opacity: 0.6 },
            ]}
          >
            {isSaving ? (
              <ActivityIndicator color={buttonTextColor} size="small" />
            ) : (
              <Text style={[styles.submitBtnText, { color: buttonTextColor }]}>
                Começar a Florescer 🌱
              </Text>
            )}
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
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    marginBottom: 14,
  },
  avatarCardContent: {
    alignItems: 'center',
    padding: 20,
  },
  avatarTouchable: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarRing: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 82,
    height: 82,
    borderRadius: 41,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarHint: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  presetEmoji: {
    fontSize: 13,
    marginRight: 4,
  },
  presetLabel: {
    fontSize: 12,
  },
  formCardContent: {
    padding: 18,
    gap: 14,
  },
  fieldWrapper: {
    gap: 5,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldRequired: {
    fontSize: 11,
    fontWeight: '600',
  },
  fieldOptional: {
    fontSize: 11,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: '100%',
    ...Platform.select({
      web: { outlineStyle: 'none' } as any,
    }),
  },
  bioInputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 68,
  },
  bioInput: {
    fontSize: 14,
    lineHeight: 18,
    textAlignVertical: 'top',
    ...Platform.select({
      web: { outlineStyle: 'none' } as any,
    }),
  },
  dbStatusWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dbStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
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
  submitBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      } as any,
    }),
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
