import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { Text, HelperText, Switch } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Routine } from '../types/routine';
import { useTheme } from './ThemeContext';
import GlassCard from './GlassCard';
import { HABIT_CATEGORIES, PRESET_COLORS, getCategoryById } from '../constants/categories';
import { triggerLightHaptic, triggerSuccessHaptic } from '../utils/haptics';

interface RoutineFormProps {
  onSave: (routine: {
    name: string;
    days: number[];
    goal: number;
    category: string;
    color: string;
    icon: string;
    reminderTime: string | null;
  }) => void;
  initialRoutine?: Routine | null;
  disabled?: boolean;
}

const weekDays = [
  { label: 'D', full: 'Dom' },
  { label: 'S', full: 'Seg' },
  { label: 'T', full: 'Ter' },
  { label: 'Q', full: 'Qua' },
  { label: 'Q', full: 'Qui' },
  { label: 'S', full: 'Sex' },
  { label: 'S', full: 'Sáb' },
];

const PRESET_REMINDER_TIMES = ['07:00', '08:00', '09:00', '12:30', '18:00', '21:00'];

export default function RoutineForm({ onSave, initialRoutine, disabled = false }: RoutineFormProps) {
  const { theme, isDark } = useTheme();

  const initialCat = getCategoryById(initialRoutine?.category);
  const [name, setName] = useState(initialRoutine?.name || '');
  const [days, setDays] = useState(initialRoutine?.days || [1, 2, 3, 4, 5]); // default Mon-Fri
  const [goal, setGoal] = useState(initialRoutine?.goal?.toString() || '1');
  const [category, setCategory] = useState<string>(initialRoutine?.category || initialCat.id);
  const [selectedColor, setSelectedColor] = useState<string>(initialRoutine?.color || initialCat.color);
  const [selectedIcon, setSelectedIcon] = useState<string>(initialRoutine?.icon || initialCat.icon);

  // Reminder state
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(!!initialRoutine?.reminderTime);
  const [reminderTime, setReminderTime] = useState<string>(initialRoutine?.reminderTime || '08:00');

  const [nameError, setNameError] = useState<string | null>(null);
  const [nameFocused, setNameFocused] = useState(false);
  const [goalFocused, setGoalFocused] = useState(false);

  const toggleDay = (dayIndex: number) => {
    if (disabled) return;
    triggerLightHaptic();
    setDays((prev) =>
      prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex].sort()
    );
  };

  const selectAllDays = () => {
    if (disabled) return;
    triggerLightHaptic();
    if (days.length === 7) {
      setDays([]);
    } else {
      setDays([0, 1, 2, 3, 4, 5, 6]);
    }
  };

  const handleSelectCategory = (catId: string) => {
    if (disabled) return;
    triggerLightHaptic();
    const cat = getCategoryById(catId);
    setCategory(catId);
    setSelectedColor(cat.color);
    setSelectedIcon(cat.icon);
  };

  const handleSelectColor = (hex: string) => {
    if (disabled) return;
    triggerLightHaptic();
    setSelectedColor(hex);
  };

  const handleSelectReminderTime = (time: string) => {
    if (disabled) return;
    triggerLightHaptic();
    setReminderTime(time);
  };

  const handleSubmit = () => {
    if (disabled) return;
    if (!name || name.trim() === '') {
      setNameError('O nome da rotina não pode estar vazio.');
      return;
    }
    setNameError(null);
    const parsedGoal = parseInt(goal, 10);
    const finalGoal = isNaN(parsedGoal) || parsedGoal <= 0 ? 1 : parsedGoal;

    triggerSuccessHaptic();

    onSave({
      name: name.trim(),
      days,
      goal: finalGoal,
      category,
      color: selectedColor,
      icon: selectedIcon,
      reminderTime: reminderEnabled ? reminderTime : null,
    });
  };

  const activeFocusBorder = isDark ? '#38BDF8' : '#0F172A';
  const buttonBg = isDark ? '#38BDF8' : '#0F172A';
  const buttonTextColor = isDark ? '#090D14' : '#FFFFFF';

  return (
    <View style={styles.container}>
      <GlassCard borderRadius={20} style={styles.formCard}>
        <View style={styles.cardPadding}>
          {/* Routine Name Field */}
          <Text style={[styles.fieldLabel, { color: theme.colors.onSurfaceVariant }]}>
            Nome do Hábito
          </Text>
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
                borderColor: nameFocused
                  ? activeFocusBorder
                  : nameError
                  ? '#EF4444'
                  : isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : '#E2E8F0',
              },
            ]}
          >
            <Ionicons
              name={(selectedIcon as any) || 'sparkles-outline'}
              size={18}
              color={nameFocused ? activeFocusBorder : theme.colors.placeholder}
              style={styles.inputIcon}
            />
            <TextInput
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (nameError) setNameError(null);
              }}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              placeholder="Ex: Beber 2L de água, Meditar, Ler..."
              placeholderTextColor={theme.colors.placeholder}
              editable={!disabled}
              style={[styles.textInput, { color: theme.colors.onSurface }]}
            />
          </View>
          {nameError && (
            <HelperText type="error" visible={!!nameError} style={{ paddingHorizontal: 0 }}>
              {nameError}
            </HelperText>
          )}

          {/* Category Selection */}
          <Text style={[styles.fieldLabel, { color: theme.colors.onSurfaceVariant, marginTop: 18 }]}>
            Categoria
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {HABIT_CATEGORIES.map((cat) => {
              const isSelected = category === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => handleSelectCategory(cat.id)}
                  disabled={disabled}
                  activeOpacity={0.7}
                  style={[
                    styles.categoryChip,
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
                  <Ionicons
                    name={cat.icon as any}
                    size={15}
                    color={isSelected ? activeFocusBorder : theme.colors.onSurfaceVariant}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.categoryChipText,
                      {
                        color: isSelected ? theme.colors.onSurface : theme.colors.onSurfaceVariant,
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Color Customization */}
          <Text style={[styles.fieldLabel, { color: theme.colors.onSurfaceVariant, marginTop: 18 }]}>
            Cor de Destaque
          </Text>
          <View style={styles.colorRow}>
            {PRESET_COLORS.map((hex) => {
              const isSelected = selectedColor === hex;
              return (
                <TouchableOpacity
                  key={hex}
                  onPress={() => handleSelectColor(hex)}
                  disabled={disabled}
                  style={[
                    styles.colorDot,
                    { backgroundColor: hex },
                    isSelected && [
                      styles.colorDotSelected,
                      { borderColor: isDark ? '#FFFFFF' : '#0F172A' },
                    ],
                  ]}
                >
                  {isSelected && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Goal Field */}
          <Text style={[styles.fieldLabel, { color: theme.colors.onSurfaceVariant, marginTop: 18 }]}>
            Meta Diária (vezes por dia)
          </Text>
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
                borderColor: goalFocused
                  ? activeFocusBorder
                  : isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : '#E2E8F0',
              },
            ]}
          >
            <Ionicons
              name="flag-outline"
              size={18}
              color={goalFocused ? activeFocusBorder : theme.colors.placeholder}
              style={styles.inputIcon}
            />
            <TextInput
              value={goal}
              onChangeText={setGoal}
              onFocus={() => setGoalFocused(true)}
              onBlur={() => setGoalFocused(false)}
              keyboardType="number-pad"
              placeholder="1"
              placeholderTextColor={theme.colors.placeholder}
              editable={!disabled}
              style={[styles.textInput, { color: theme.colors.onSurface }]}
            />
          </View>

          {/* Reminder Section */}
          <View style={[styles.reminderRow, { borderTopColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9' }]}>
            <View>
              <Text style={[styles.fieldLabel, { marginBottom: 2, color: theme.colors.onSurface }]}>
                Lembrete Diário
              </Text>
              <Text style={[styles.reminderSubtext, { color: theme.colors.onSurfaceVariant }]}>
                Notificação para manter o foco
              </Text>
            </View>
            <Switch
              value={reminderEnabled}
              onValueChange={(val) => {
                triggerLightHaptic();
                setReminderEnabled(val);
              }}
              color={activeFocusBorder}
              disabled={disabled}
            />
          </View>

          {reminderEnabled && (
            <View
              style={[
                styles.reminderTimeBox,
                { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC' },
              ]}
            >
              <View style={styles.presetTimesRow}>
                {PRESET_REMINDER_TIMES.map((time) => {
                  const isSelected = reminderTime === time;
                  return (
                    <TouchableOpacity
                      key={time}
                      onPress={() => handleSelectReminderTime(time)}
                      disabled={disabled}
                      style={[
                        styles.presetTimeChip,
                        {
                          backgroundColor: isSelected
                            ? activeFocusBorder
                            : isDark
                            ? 'rgba(255, 255, 255, 0.05)'
                            : '#FFFFFF',
                          borderColor: isSelected
                            ? activeFocusBorder
                            : isDark
                            ? 'rgba(255, 255, 255, 0.08)'
                            : '#E2E8F0',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.presetTimeText,
                          {
                            color: isSelected
                              ? buttonTextColor
                              : theme.colors.onSurface,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Week Days Section */}
          <View style={styles.daysHeaderRow}>
            <Text style={[styles.fieldLabel, { color: theme.colors.onSurfaceVariant, marginBottom: 0 }]}>
              Dias da Semana
            </Text>
            <TouchableOpacity onPress={selectAllDays} disabled={disabled}>
              <Text style={[styles.toggleAllText, { color: activeFocusBorder }]}>
                {days.length === 7 ? 'Desmarcar' : 'Todos'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.daysGrid}>
            {weekDays.map((day, index) => {
              const isSelected = days.includes(index);
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => toggleDay(index)}
                  disabled={disabled}
                  activeOpacity={0.7}
                  style={[
                    styles.dayChip,
                    {
                      backgroundColor: isSelected
                        ? activeFocusBorder
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
                  <Text
                    style={[
                      styles.dayChipLabel,
                      {
                        color: isSelected ? buttonTextColor : theme.colors.onSurface,
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {day.full}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </GlassCard>

      {/* Modern Minimalist Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitBtn,
          { backgroundColor: buttonBg },
          disabled && { opacity: 0.5 },
        ]}
        onPress={handleSubmit}
        disabled={disabled}
        activeOpacity={0.85}
      >
        <Text style={[styles.submitText, { color: buttonTextColor }]}>
          {initialRoutine ? 'Atualizar Hábito' : 'Salvar Hábito'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 6,
  },
  formCard: {
    marginBottom: 16,
  },
  cardPadding: {
    padding: 20,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
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
  textInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    height: '100%',
  },
  categoryScroll: {
    flexDirection: 'row',
    paddingVertical: 2,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 13,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 2,
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorDotSelected: {
    borderWidth: 2,
    transform: [{ scale: 1.15 }],
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  reminderSubtext: {
    fontSize: 12,
  },
  reminderTimeBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 12,
  },
  presetTimesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetTimeChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  presetTimeText: {
    fontSize: 12,
  },
  daysHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  toggleAllText: {
    fontSize: 12,
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayChip: {
    width: 38,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayChipLabel: {
    fontSize: 12,
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
  submitText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});