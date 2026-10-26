import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, TextInput, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Routine } from '../types/routine';
import { useTheme } from './ThemeContext';
import GlassCard from './GlassCard';
import { getTodayDateString } from '../utils/streak';
import { triggerSuccessHaptic, triggerLightHaptic } from '../utils/haptics';

interface HabitNoteModalProps {
  visible: boolean;
  routine: Routine | null;
  onClose: () => void;
  onSaveNote: (routineId: string, noteText: string) => void;
}

export default function HabitNoteModal({
  visible,
  routine,
  onClose,
  onSaveNote,
}: HabitNoteModalProps) {
  const { theme, isDark } = useTheme();
  const [text, setText] = useState('');

  if (!routine) return null;

  const notesList = Array.isArray(routine.notes) ? routine.notes : [];

  const handleSave = () => {
    if (!text.trim()) return;
    triggerSuccessHaptic();
    onSaveNote(routine.id, text.trim());
    setText('');
    onClose();
  };

  const activeFocusBorder = isDark ? '#38BDF8' : '#0F172A';
  const buttonBg = isDark ? '#38BDF8' : '#0F172A';
  const buttonTextColor = isDark ? '#090D14' : '#FFFFFF';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <GlassCard borderRadius={22} style={styles.modalCard}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.headerRow}>
              <View>
                <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
                  Diário do Hábito ✍️
                </Text>
                <Text style={[styles.routineName, { color: theme.colors.onSurfaceVariant }]}>
                  {routine.name}
                </Text>
              </View>

              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            {/* Input for new note */}
            <View
              style={[
                styles.inputBox,
                {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                },
              ]}
            >
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Como foi hoje? (ex: li 12 páginas, me senti mais calmo...)"
                placeholderTextColor={theme.colors.placeholder}
                multiline
                numberOfLines={3}
                style={[styles.input, { color: theme.colors.onSurface }]}
              />
            </View>

            <TouchableOpacity
              onPress={handleSave}
              disabled={!text.trim()}
              style={[
                styles.saveBtn,
                { backgroundColor: buttonBg },
                !text.trim() && { opacity: 0.5 },
              ]}
            >
              <Text style={[styles.saveBtnText, { color: buttonTextColor }]}>Adicionar Reflexão</Text>
            </TouchableOpacity>

            {/* Historical Notes */}
            {notesList.length > 0 && (
              <View style={styles.historySection}>
                <Text style={[styles.historyTitle, { color: theme.colors.onSurfaceVariant }]}>
                  Reflexões Anteriores ({notesList.length})
                </Text>
                <ScrollView style={styles.historyScroll} showsVerticalScrollIndicator={false}>
                  {notesList
                    .slice()
                    .reverse()
                    .map((item) => (
                      <View
                        key={item.id}
                        style={[
                          styles.noteItem,
                          {
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
                            borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#E2E8F0',
                          },
                        ]}
                      >
                        <Text style={[styles.noteDate, { color: theme.colors.onSurfaceVariant }]}>
                          {item.date}
                        </Text>
                        <Text style={[styles.noteText, { color: theme.colors.onSurface }]}>
                          {item.text}
                        </Text>
                      </View>
                    ))}
                </ScrollView>
              </View>
            )}
          </View>
        </GlassCard>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '85%',
  },
  modalContent: {
    padding: 22,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  routineName: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  inputBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    minHeight: 76,
    marginBottom: 12,
  },
  input: {
    fontSize: 14,
    lineHeight: 20,
    textAlignVertical: 'top',
    height: '100%',
    ...Platform.select({
      web: { outlineStyle: 'none' } as any,
    }),
  },
  saveBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  historySection: {
    marginTop: 4,
  },
  historyTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  historyScroll: {
    maxHeight: 160,
  },
  noteItem: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 6,
  },
  noteDate: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  noteText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
