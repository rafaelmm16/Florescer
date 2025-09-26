// contador-de-habitos/components/RoutineForm.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
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
      <View>
        <TextInput
          label="Nome da Rotina"
          value={name}
          onChangeText={(text) => setName(text)}
          mode="outlined"
          style={styles.input}
          error={!!nameError}
          editable={!disabled}
        />
        <HelperText type="error" visible={!!nameError}>
          {nameError}
        </HelperText>
      </View>

      <TextInput
        label="Meta de Repetições (por dia)"
        value={goal}
        onChangeText={setGoal}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
        editable={!disabled}
      />
      <Text variant="bodyLarge" style={[styles.label, { color: theme.colors.onSurface }]}>Dias da Semana</Text>
      <View style={styles.daysContainer}>
        {weekDays.map((day, index) => (
          <Button
            key={index}
            mode={days.includes(index) ? 'contained' : 'outlined'}
            onPress={() => toggleDay(index)}
            style={styles.dayButton}
            labelStyle={styles.dayButtonLabel}
            disabled={disabled}
          >
            {day}
          </Button>
        ))}
      </View>
      <Button mode="contained" onPress={handleSubmit} style={styles.saveButton} disabled={disabled}>
        Salvar Rotina
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 10,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 4,
  },
  dayButton: {
    minWidth: 40,
  },
  dayButtonLabel: {
    fontSize: 14,
    marginHorizontal: 0,
    paddingHorizontal: 4,
  },
  saveButton: {
    marginTop: 10,
  },
});