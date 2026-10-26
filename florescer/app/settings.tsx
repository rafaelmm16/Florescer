import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, ScrollView, Image, TextInput, Platform, Share, Modal } from 'react-native';
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
import { isSoundEnabled, setSoundEnabled, playZenChime } from '../utils/sound';
import {
  isBiometricsAvailable,
  isBiometricLockEnabled,
  setBiometricLockEnabled,
  promptBiometricAuth,
} from '../utils/biometrics';
import { exportAllData, importBackupData } from '../utils/backup';
import { useRoutineStore } from '../store/useRoutineStore';
import { triggerLightHaptic, triggerSuccessHaptic, triggerWarningHaptic } from '../utils/haptics';

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

  // Sound, Biometrics & Backup state
  const [soundActive, setSoundActive] = useState(true);
  const [biometricsActive, setBiometricsActive] = useState(false);
  const [biometricsSupported, setBiometricsSupported] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');

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

    // Load sound & biometrics status
    isSoundEnabled().then(setSoundActive);
    isBiometricLockEnabled().then(setBiometricsActive);
    isBiometricsAvailable().then(setBiometricsSupported);
  }, []);

  const handleToggleSound = async (val: boolean) => {
    triggerLightHaptic();
    setSoundActive(val);
    await setSoundEnabled(val);
    if (val) {
      await playZenChime();
    }
  };

  const handleTestSound = async () => {
    triggerLightHaptic();
    await playZenChime();
  };

  const handleToggleBiometrics = async (val: boolean) => {
    triggerLightHaptic();
    if (val) {
      const ok = await promptBiometricAuth('Confirme sua biometria para proteger o Florescer');
      if (ok) {
        triggerSuccessHaptic();
        setBiometricsActive(true);
        await setBiometricLockEnabled(true);
        Alert.alert('Segurança Ativada 🔒', 'O Florescer agora exigirá autenticação biométrica ao ser aberto.');
      } else {
        triggerWarningHaptic();
        setBiometricsActive(false);
      }
    } else {
      setBiometricsActive(false);
      await setBiometricLockEnabled(false);
    }
  };

  const handleExportBackup = async () => {
    try {
      triggerLightHaptic();
      const jsonStr = await exportAllData();
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(jsonStr);
        triggerSuccessHaptic();
        Alert.alert(
          'Backup Copiado! 📥',
          'Os dados em formato JSON foram copiados para a sua área de transferência.'
        );
        return;
      }

      await Share.share({
        title: 'Florescer_Backup.json',
        message: jsonStr,
      });
      triggerSuccessHaptic();
    } catch (e: any) {
      Alert.alert('Erro ao Exportar', e.message || 'Falha ao gerar o arquivo de backup.');
    }
  };

  const handleConfirmRestore = async () => {
    if (!importJsonText || !importJsonText.trim()) {
      Alert.alert('Aviso', 'Cole o texto JSON do backup para prosseguir.');
      return;
    }

    try {
      const result = await importBackupData(importJsonText.trim());
      if (result.success) {
        triggerSuccessHaptic();
        await useRoutineStore.getState().loadRoutines();
        setIsImportModalVisible(false);
        setImportJsonText('');
        Alert.alert('Restauração Concluída! 🎉', result.message);
      } else {
        triggerWarningHaptic();
        Alert.alert('Falha na Importação', result.message);
      }
    } catch (e: any) {
      triggerWarningHaptic();
      Alert.alert('Erro ao Importar', e.message || 'JSON inválido.');
    }
  };

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

          {/* Sound & Sensory Card */}
          <GlassCard borderRadius={18} style={styles.card}>
            <View style={styles.cardPadding}>
              <View style={styles.optionRow}>
                <View style={styles.optionLeft}>
                  <View
                    style={[
                      styles.optionIconBox,
                      {
                        backgroundColor: isDark ? 'rgba(56, 189, 248, 0.1)' : '#F0F9FF',
                        borderColor: isDark ? 'rgba(56, 189, 248, 0.2)' : '#BAE6FD',
                      },
                    ]}
                  >
                    <Ionicons
                      name="musical-notes-outline"
                      size={20}
                      color={isDark ? '#38BDF8' : '#0284C7'}
                    />
                  </View>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={[styles.optionTitle, { color: theme.colors.onSurface }]}>
                      Efeito Sonoro Zen
                    </Text>
                    <Text style={[styles.optionSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                      Acordes suaves ao concluir metas e no timer
                    </Text>
                  </View>
                </View>

                <Switch
                  value={soundActive}
                  onValueChange={handleToggleSound}
                  color={activeFocusBorder}
                />
              </View>

              {soundActive && (
                <TouchableOpacity
                  onPress={handleTestSound}
                  activeOpacity={0.7}
                  style={[
                    styles.testSoundBtn,
                    {
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                    },
                  ]}
                >
                  <Ionicons name="volume-medium-outline" size={16} color={activeFocusBorder} style={{ marginRight: 6 }} />
                  <Text style={[styles.testSoundText, { color: activeFocusBorder }]}>
                    Ouvir demonstração do som zen 🔔
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </GlassCard>

          {/* Biometric Security Card */}
          <GlassCard borderRadius={18} style={styles.card}>
            <View style={styles.cardPadding}>
              <View style={styles.optionRow}>
                <View style={styles.optionLeft}>
                  <View
                    style={[
                      styles.optionIconBox,
                      {
                        backgroundColor: isDark ? 'rgba(168, 85, 247, 0.1)' : '#FAF5FF',
                        borderColor: isDark ? 'rgba(168, 85, 247, 0.2)' : '#E9D5FF',
                      },
                    ]}
                  >
                    <Ionicons
                      name="finger-print-outline"
                      size={20}
                      color={isDark ? '#C084FC' : '#9333EA'}
                    />
                  </View>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={[styles.optionTitle, { color: theme.colors.onSurface }]}>
                      Bloqueio por Biometria
                    </Text>
                    <Text style={[styles.optionSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                      Exigir Face ID ou Digital ao abrir o app
                    </Text>
                  </View>
                </View>

                <Switch
                  value={biometricsActive}
                  onValueChange={handleToggleBiometrics}
                  color={activeFocusBorder}
                />
              </View>
            </View>
          </GlassCard>

          {/* Backup & Data Privacy Card */}
          <GlassCard borderRadius={18} style={styles.card}>
            <View style={styles.cardPadding}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}>
                Backup & Privacidade Local
              </Text>
              <Text style={[styles.backupDesc, { color: theme.colors.onSurfaceVariant }]}>
                Seus hábitos e conquistas pertencem a você. Exporte uma cópia completa de segurança ou restaure em qualquer aparelho.
              </Text>

              <View style={styles.backupButtonsRow}>
                <TouchableOpacity
                  style={[
                    styles.backupBtn,
                    {
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC',
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                    },
                  ]}
                  onPress={handleExportBackup}
                  activeOpacity={0.8}
                >
                  <Ionicons name="download-outline" size={16} color={theme.colors.onSurface} style={{ marginRight: 6 }} />
                  <Text style={[styles.backupBtnText, { color: theme.colors.onSurface }]}>
                    Exportar JSON
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.backupBtn,
                    {
                      backgroundColor: isDark ? 'rgba(56, 189, 248, 0.08)' : '#F0F9FF',
                      borderColor: isDark ? 'rgba(56, 189, 248, 0.25)' : '#BAE6FD',
                    },
                  ]}
                  onPress={() => setIsImportModalVisible(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="cloud-upload-outline" size={16} color={activeFocusBorder} style={{ marginRight: 6 }} />
                  <Text style={[styles.backupBtnText, { color: activeFocusBorder }]}>
                    Restaurar Backup
                  </Text>
                </TouchableOpacity>
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

      {/* Import Backup Modal */}
      <Modal
        visible={isImportModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsImportModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <GlassCard borderRadius={22} style={styles.modalCard}>
            <View style={styles.modalInner}>
              <View style={styles.modalHeader}>
                <View
                  style={[
                    styles.optionIconBox,
                    {
                      backgroundColor: isDark ? 'rgba(56, 189, 248, 0.1)' : '#F0F9FF',
                      borderColor: isDark ? 'rgba(56, 189, 248, 0.2)' : '#BAE6FD',
                    },
                  ]}
                >
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color={activeFocusBorder}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
                    Restaurar Backup
                  </Text>
                  <Text style={[styles.modalSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                    Cole o código JSON do seu backup
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.modalTextContainer,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                  },
                ]}
              >
                <TextInput
                  value={importJsonText}
                  onChangeText={setImportJsonText}
                  placeholder='{"version": 1, "routines": [...]}'
                  placeholderTextColor={theme.colors.placeholder}
                  multiline
                  style={[styles.modalTextInput, { color: theme.colors.onSurface }]}
                />
              </View>

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={[
                    styles.modalCancelBtn,
                    {
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                    },
                  ]}
                  onPress={() => {
                    setIsImportModalVisible(false);
                    setImportJsonText('');
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.modalCancelText, { color: theme.colors.onSurface }]}>
                    Cancelar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalConfirmBtn,
                    { backgroundColor: buttonBg },
                  ]}
                  onPress={handleConfirmRestore}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.modalConfirmText, { color: buttonTextColor }]}>
                    Restaurar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </GlassCard>
        </View>
      </Modal>
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
  testSoundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  testSoundText: {
    fontSize: 12,
    fontWeight: '600',
  },
  backupDesc: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  backupButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  backupBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  backupBtnText: {
    fontSize: 13,
    fontWeight: '700',
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
  },
  modalInner: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  modalTextContainer: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    height: 140,
    marginBottom: 18,
  },
  modalTextInput: {
    fontSize: 12,
    fontFamily: Platform.select({ ios: 'Courier', default: 'monospace' }),
    height: '100%',
    textAlignVertical: 'top',
    ...Platform.select({
      web: { outlineStyle: 'none' } as any,
    }),
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalConfirmBtn: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  modalConfirmText: {
    fontSize: 13,
    fontWeight: '700',
  },
});