import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Text, HelperText } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Routine } from '../types/routine';
import { useTheme } from './ThemeContext';
import GlassCard from './GlassCard';

interface RoutineFormProps {
  onSave: (routine: Omit<Routine, 'id' | 'progress' | 'isCompleted'>) => void;
  initialRoutine?: Routine | null;
  disabled?: boolean;
}

const weekDays = [
  { label: 'D', full: 'Domingo' },
  { label: 'S', full: 'Segunda' },
  { label: 'T', full: 'Terça' },
  { label: 'Q', full: 'Quarta' },
  { label: 'Q', full: 'Quinta' },
  { label: 'S', full: 'Sexta' },
  { label: 'S', full: 'Sábado' },
];

export default function RoutineForm({ onSave, initialRoutine, disabled = false }: RoutineFormProps) {
  const { theme, isDark } = useTheme();
  const [name, setName] = useState(initialRoutine?.name || '');
  const [days, setDays] = useState(initialRoutine?.days || [1, 2, 3, 4, 5]); // default Mon-Fri
  const [goal, setGoal] = useState(initialRoutine?.goal?.toString() || '1');
  const [nameError, setNameError] = useState<string | null>(null);

  const [nameFocused, setNameFocused] = useState(false);
  const [goalFocused, setGoalFocused] = useState(false);

  const toggleDay = (dayIndex: number) => {
    if (disabled) return;
    setDays((prev) =>
      prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex].sort()
    );
  };

  const selectAllDays = () => {
    if (disabled) return;
    if (days.length === 7) {
      setDays([]);
    } else {
      setDays([0, 1, 2, 3, 4, 5, 6]);
    }
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

    onSave({
      name: name.trim(),
      days,
      goal: finalGoal,
    });
  };

  return (
    <View style={styles.container}>
      <GlassCard borderRadius={28} style={styles.formCard}>
        <View style={styles.cardPadding}>
          {/* Routine Name Field */}
          <Text style={[styles.fieldLabel, { color: theme.colors.onSurfaceVariant }]}>
            Nome da Rotina
          </Text>
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: isDark ? 'rgba(10, 16, 28, 0.65)' : 'rgba(255, 255, 255, 0.72)',
                borderColor: nameFocused
                  ? theme.colors.primary
                  : nameError
                  ? theme.colors.danger
                  : isDark
                  ? 'rgba(255, 255, 255, 0.12)'
                  : 'rgba(226, 232, 240, 0.85)',
              },
            ]}
          >
            <Ionicons
              name="sparkles-outline"
              size={20}
              color={nameFocused ? theme.colors.primary : theme.colors.placeholder}
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
              placeholder="Ex: Beber 2L de água, Meditar..."
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

          {/* Goal Field */}
          <Text style={[styles.fieldLabel, { color: theme.colors.onSurfaceVariant, marginTop: 18 }]}>
            Meta Diária (repetições)
          </Text>
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: isDark ? 'rgba(10, 16, 28, 0.65)' : 'rgba(255, 255, 255, 0.72)',
                borderColor: goalFocused
                  ? theme.colors.primary
                  : isDark
                  ? 'rgba(255, 255, 255, 0.12)'
                  : 'rgba(226, 232, 240, 0.85)',
              },
            ]}
          >
            <Ionicons
              name="flag-outline"
              size={20}
              color={goalFocused ? theme.colors.primary : theme.colors.placeholder}
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

          {/* Week Days Section */}
          <View style={styles.daysHeaderRow}>
            <Text style={[styles.fieldLabel, { color: theme.colors.onSurfaceVariant, marginBottom: 0 }]}>
              Dias da Semana
            </Text>
            <TouchableOpacity onPress={selectAllDays} disabled={disabled}>
              <Text style={[styles.toggleAllText, { color: theme.colors.primary }]}>
                {days.length === 7 ? 'Desmarcar todos' : 'Todos os dias'}
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
                        ? theme.colors.primary
                        : isDark
                        ? 'rgba(255, 255, 255, 0.06)'
                        : 'rgba(255, 255, 255, 0.70)',
                      borderColor: isSelected
                        ? theme.colors.primary
                        : isDark
                        ? 'rgba(255, 255, 255, 0.12)'
                        : 'rgba(226, 232, 240, 0.85)',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayChipLabel,
                      {
                        color: isSelected ? '#FFFFFF' : theme.colors.onSurface,
                        fontWeight: isSelected ? '800' : '600',
                      },
                    ]}
                  >
                    {day.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </GlassCard>

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitContainer}
        onPress={handleSubmit}
        disabled={disabled}
        activeOpacity={0.88}
      >
        <LinearGradient
          colors={['#34D399', '#10B981', '#059669']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.submitGradient,
            disabled && { opacity: 0.5 },
          ]}
        >
          {/* Subtle liquid sheen */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.45)', 'rgba(255, 255, 255, 0.1)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.8 }}
            style={styles.buttonShine}
            pointerEvents="none"
          />

          <Ionicons
            name={initialRoutine ? 'checkmark-circle-outline' : 'leaf-outline'}
            size={22}
            color="#FFFFFF"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.submitText}>
            {initialRoutine ? 'Atualizar Rotina' : 'Salvar Nova Rotina'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  formCard: {
    marginBottom: 24,
  },
  cardPadding: {
    padding: 22,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 54,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    ...Platform.select({
      web: { outlineStyle: 'none' } as any,
    }),
  },
  daysHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 12,
  },
  toggleAllText: {
    fontSize: 12,
    fontWeight: '700',
  },
  daysGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayChip: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dayChipLabel: {
    fontSize: 15,
  },
  submitContainer: {
    borderRadius: 20,
    elevation: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    borderWidth: 1.2,
    overflow: 'hidden',
    position: 'relative',
  },
  buttonShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 18,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});