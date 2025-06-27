// contador-de-habitos/components/RoutineForm.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { Routine } from '../types/routine';
import { useTheme } from './ThemeContext';

interface RoutineFormProps {
  onSave: (routine: Omit<Routine, 'id' | 'progress' | 'isCompleted' | 'isDeleted'>) => void;
  initialRoutine?: Routine | null;
}

export default function RoutineForm({ onSave, initialRoutine }: RoutineFormProps) {
  const { theme } = useTheme();
  const [name, setName] = useState(initialRoutine?.name || '');
  const [days, setDays] = useState(initialRoutine?.days || []);
  const [goal, setGoal] = useState(initialRoutine?.goal.toString() || '1');

  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const toggleDay = (dayIndex: number) => {
    if (days.includes(dayIndex)) {
      setDays(days.filter(d => d !== dayIndex));
    } else {
      setDays([...days, dayIndex]);
    }
  };

  const handleSubmit = () => {
    if (name.trim() && goal.trim()) {
      onSave({
        name,
        days,
        goal: parseInt(goal, 10),
      });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Nome da Rotina"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Meta de Repetições (por dia)"
        value={goal}
        onChangeText={setGoal}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
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
          >
            {day}
          </Button>
        ))}
      </View>
      <Button mode="contained" onPress={handleSubmit} style={styles.saveButton}>
        Salvar Rotina
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
    // Estilos permanecem os mesmos
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
    },
    dayButton: {
        minWidth: 40,
        paddingHorizontal: 0,
    },
    dayButtonLabel: {
        fontSize: 12,
    },
    saveButton: {
        marginTop: 10,
    },
});