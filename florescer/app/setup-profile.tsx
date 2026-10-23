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
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../components/ThemeContext';
import GlassCard from '../components/GlassCard';
import GlassBackground from '../components/GlassBackground';
import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';
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
    // Check MongoDB Atlas status
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

      if (!result.canceled && result.assets && result.assets[0]) {
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
          `Bem-vindo ao Florescer, ${name.trim()}! Seu perfil foi salvo com sucesso no seu dispositivo.`
        );
      }

      // Navigate to Home screen
      router.replace('/');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o perfil. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

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
            <LiquidGlassView
              effect="clear"
              colorScheme={isDark ? 'dark' : 'light'}
              tintColor={isDark ? 'rgba(0, 242, 254, 0.16)' : 'rgba(6, 182, 212, 0.12)'}
              style={[
                styles.badge,
                {
                  borderColor: isDark ? 'rgba(0, 242, 254, 0.35)' : 'rgba(6, 182, 212, 0.25)',
                },
                !isLiquidGlassSupported && {
                  backgroundColor: isDark ? 'rgba(0, 242, 254, 0.16)' : 'rgba(6, 182, 212, 0.12)',
                },
              ]}
            >
              <Text style={[styles.badgeText, { color: theme.colors.primary }]}>
                BEM-VINDO AO FLORESCER 🌱
              </Text>
            </LiquidGlassView>

            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Vamos cultivar o seu perfil
            </Text>

            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Configure sua identidade para começar sua jornada de hábitos. Sem necessidade de criar senhas!
            </Text>
          </View>

          {/* Avatar Card (Layered Frosted Glass) */}
          <GlassCard borderRadius={24} layered={true} style={styles.card}>
            <View style={styles.avatarCardContent}>
              <TouchableOpacity
                onPress={handlePickImage}
                activeOpacity={0.85}
                style={styles.avatarTouchable}
                accessibilityLabel="Escolher foto de perfil"
              >
                <View
                  style={[
                    styles.avatarGlowRing,
                    {
                      borderColor: isDark ? 'rgba(52, 211, 153, 0.50)' : 'rgba(16, 185, 129, 0.45)',
                      backgroundColor: isDark ? 'rgba(22, 32, 50, 0.85)' : 'rgba(255, 255, 255, 0.90)',
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
                            ? 'rgba(16, 185, 129, 0.20)'
                            : 'rgba(16, 185, 129, 0.12)',
                        },
                      ]}
                    >
                      <Text style={styles.avatarEmoji}>{selectedEmoji}</Text>
                    </View>
                  )}

                  <View style={[styles.cameraBadge, { backgroundColor: theme.colors.primary }]}>
                    <Ionicons name="camera" size={16} color="#FFFFFF" />
                  </View>
                </View>
              </TouchableOpacity>

              <Text style={[styles.avatarHint, { color: theme.colors.onSurfaceVariant }]}>
                Toque no círculo para escolher uma foto da galeria ou selecione um ícone abaixo:
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
                      activeOpacity={0.8}
                      style={[
                        styles.presetChip,
                        {
                          backgroundColor: isSelected
                            ? isDark
                              ? 'rgba(16, 185, 129, 0.28)'
                              : 'rgba(16, 185, 129, 0.18)'
                            : isDark
                            ? 'rgba(255, 255, 255, 0.06)'
                            : 'rgba(255, 255, 255, 0.70)',
                          borderColor: isSelected
                            ? theme.colors.primary
                            : isDark
                            ? 'rgba(255, 255, 255, 0.10)'
                            : 'rgba(226, 232, 240, 0.8)',
                        },
                      ]}
                    >
                      <Text style={styles.presetEmoji}>{preset.emoji}</Text>
                      <Text
                        style={[
                          styles.presetLabel,
                          {
                            color: isSelected ? theme.colors.primary : theme.colors.onSurfaceVariant,
                            fontWeight: isSelected ? '800' : '600',
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
          <GlassCard borderRadius={24} style={styles.card}>
            <View style={styles.formCardContent}>
              {/* Name Field */}
              <View style={styles.fieldWrapper}>
                <View style={styles.fieldLabelRow}>
                  <Text style={[styles.fieldLabel, { color: theme.colors.onSurface }]}>
                    Seu Nome *
                  </Text>
                  <Text style={[styles.fieldRequired, { color: theme.colors.primary }]}>
                    Obrigatório
                  </Text>
                </View>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: isDark
                        ? 'rgba(10, 16, 28, 0.70)'
                        : 'rgba(255, 255, 255, 0.75)',
                      borderColor: nameFocused
                        ? theme.colors.primary
                        : isDark
                        ? 'rgba(255, 255, 255, 0.12)'
                        : 'rgba(226, 232, 240, 0.90)',
                    },
                  ]}
                >
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={nameFocused ? theme.colors.primary : theme.colors.placeholder}
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
                      backgroundColor: isDark
                        ? 'rgba(10, 16, 28, 0.70)'
                        : 'rgba(255, 255, 255, 0.75)',
                      borderColor: emailFocused
                        ? theme.colors.primary
                        : isDark
                        ? 'rgba(255, 255, 255, 0.12)'
                        : 'rgba(226, 232, 240, 0.90)',
                    },
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={emailFocused ? theme.colors.primary : theme.colors.placeholder}
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

              {/* Bio / Daily Inspiration */}
              <View style={styles.fieldWrapper}>
                <View style={styles.fieldLabelRow}>
                  <Text style={[styles.fieldLabel, { color: theme.colors.onSurface }]}>
                    Lembrete Inspirador / Bio
                  </Text>
                  <Text style={[styles.fieldOptional, { color: theme.colors.onSurfaceVariant }]}>
                    Opcional
                  </Text>
                </View>
                <View
                  style={[
                    styles.bioInputContainer,
                    {
                      backgroundColor: isDark
                        ? 'rgba(10, 16, 28, 0.70)'
                        : 'rgba(255, 255, 255, 0.75)',
                      borderColor: bioFocused
                        ? theme.colors.primary
                        : isDark
                        ? 'rgba(255, 255, 255, 0.12)'
                        : 'rgba(226, 232, 240, 0.90)',
                    },
                  ]}
                >
                  <TextInput
                    value={bio}
                    onChangeText={setBio}
                    placeholder="Uma frase ou lembrete para cultivar sua melhor versão todos os dias..."
                    placeholderTextColor={theme.colors.placeholder}
                    style={[styles.bioInput, { color: theme.colors.onSurface }]}
                    onFocus={() => setBioFocused(true)}
                    onBlur={() => setBioFocused(false)}
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>
            </View>
          </GlassCard>

          {/* Database Connection Pill */}
          <View style={styles.dbStatusWrapper}>
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
                  ? 'Conectado ao MongoDB Atlas (Cluster 1) 🍃'
                  : 'Sincronização em nuvem ativa / Local-First'}
              </Text>
            </LiquidGlassView>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            onPress={handleSaveAndStart}
            disabled={isSaving}
            activeOpacity={0.88}
            style={styles.submitBtnWrapper}
          >
            <LinearGradient
              colors={
                isDark
                  ? ['#00F2FE', '#06B6D4', '#0891B2']
                  : ['#22D3EE', '#06B6D4', '#0891B2']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.submitBtnGradient}
            >
              {/* Specular sheen on top */}
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.45)', 'rgba(255, 255, 255, 0.1)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.btnSheen}
                pointerEvents="none"
              />

              {isSaving ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={styles.submitBtnText}>Começar a Florescer</Text>
                  <Ionicons name="sparkles" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
                </>
              )}
            </LinearGradient>
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
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    marginBottom: 16,
  },
  avatarCardContent: {
    alignItems: 'center',
    padding: 22,
  },
  avatarTouchable: {
    position: 'relative',
    marginBottom: 14,
  },
  avatarGlowRing: {
    width: 114,
    height: 114,
    borderRadius: 57,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
  },
  avatarImage: {
    width: 106,
    height: 106,
    borderRadius: 53,
  },
  avatarPlaceholder: {
    width: 106,
    height: 106,
    borderRadius: 53,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 50,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  avatarHint: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 14,
    paddingHorizontal: 10,
    lineHeight: 16,
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
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
  },
  presetEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  presetLabel: {
    fontSize: 12,
  },
  formCardContent: {
    padding: 20,
    gap: 16,
  },
  fieldWrapper: {
    gap: 6,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldRequired: {
    fontSize: 11,
    fontWeight: '700',
  },
  fieldOptional: {
    fontSize: 11,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.2,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
    ...Platform.select({
      web: { outlineStyle: 'none' } as any,
    }),
  },
  bioInputContainer: {
    borderRadius: 16,
    borderWidth: 1.2,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 84,
  },
  bioInput: {
    fontSize: 14,
    lineHeight: 20,
    textAlignVertical: 'top',
    ...Platform.select({
      web: { outlineStyle: 'none' } as any,
    }),
  },
  dbStatusWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dbStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  dbStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dbStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  submitBtnWrapper: {
    borderRadius: 22,
    elevation: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowColor: '#10B981',
  },
  submitBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.40)',
    overflow: 'hidden',
    position: 'relative',
  },
  btnSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 22,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
