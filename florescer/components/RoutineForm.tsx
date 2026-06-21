import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Text, HelperText } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Routine } from '../types/routine';
import { useTheme } from './ThemeContext';

interface RoutineFormProps {
  onSave: (routine: Omit<Routine, 'id' | 'progress' | 'isCompleted'>) => void;
  initialRoutine?: Routine | null;
  disabled?: boolean;
}

export default function RoutineForm({ onSave, initialRoutine, disabled = false }: RoutineFormProps) {
  const { theme } = useTheme();
  const [name, setName] = useState(initialRoutine?.name || '');
  const [days, setDays] = useState(initialRoutine?.days || []);
  const [goal, setGoal] = useState(initialRoutine?.goal.toString() || '1');
  const [nameError, setNameError] = useState<string | null>(null);

  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const toggleDay = (dayIndex: number) => {
    if (disabled) return;
    setDays(days.includes(dayIndex) ? days.filter(d => d !== dayIndex) : [...days, dayIndex]);
  };

  const handleSubmit = () => {
    if (disabled) return;
    if (!name || name.trim() === "") {
      setNameError("O nome da rotina não pode estar vazio.");
      return;
    }
    setNameError(null);
    if (name.trim() && goal.trim()) {
      onSave({ name, days, goal: parseInt(goal, 10) });
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.shadow }]}>
        <TextInput
          label="Nome da Rotina"
          value={name}
          onChangeText={(text) => setName(text)}
          mode="flat"
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          style={[styles.input, { backgroundColor: theme.colors.surfaceVariant }]}
          textColor={theme.colors.onSurface}
          error={!!nameError}
          editable={!disabled}
        />
        <HelperText type="error" visible={!!nameError}>
          {nameError}
        </HelperText>

        <TextInput
          label="Meta de Repetições (por dia)"
          value={goal}
          onChangeText={setGoal}
          keyboardType="numeric"
          mode="flat"
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          style={[styles.input, { backgroundColor: theme.colors.surfaceVariant }]}
          textColor={theme.colors.onSurface}
          editable={!disabled}
        />
        
        <Text style={[styles.label, { color: theme.colors.primary }]}>Dias da Semana</Text>
        <View style={styles.daysContainer}>
          {weekDays.map((day, index) => {
            const isSelected = days.includes(index);
            return (
              <TouchableOpacity
                key={index}
                onPress={() => toggleDay(index)}
                disabled={disabled}
                activeOpacity={0.8}
                style={[
                  styles.dayButton,
                  { 
                    backgroundColor: isSelected ? theme.colors.primary : theme.colors.surfaceVariant,
                  }
                ]}
              >
                <Text style={[
                  styles.dayButtonLabel, 
                  { color: isSelected ? theme.colors.onPrimary : theme.colors.onSurfaceVariant }
                ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity 
          style={styles.saveButtonContainer}
          onPress={handleSubmit}
          disabled={disabled}
          activeOpacity={0.9}
      >
          <LinearGradient 
              colors={[theme.colors.primary, theme.colors.primaryContainer]} 
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={[styles.saveButton, disabled && { opacity: 0.5 }]}
          >
              <Text style={[styles.saveButtonText, { color: theme.colors.onPrimary }]}>
                  {initialRoutine ? "Atualizar Rotina" : "Salvar Nova Rotina"}
              </Text>
          </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
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
  input: {
    marginBottom: 4,
    borderRadius: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: 60,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  saveButtonContainer: {
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