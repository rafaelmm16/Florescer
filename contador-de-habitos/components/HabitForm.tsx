import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Habit } from '../types/habit';
import colors from '../constants/colors';
import { useTheme } from './ThemeContext';

interface Props {
  onSubmit: (habit: Habit) => void;
}

export default function HabitForm({ onSubmit }: Props) {
  const [name, setName] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({
      id: Date.now().toString(),
      name: name.trim(),
      done: false,
      createdAt: new Date().toISOString(),
    });
    setName('');
  };

  return (
    <View style={styles.form}>
      <TextInput
        label="Nome do Hábito"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
        theme={{
          colors: {
            primary: colors.primary,
            background: isDark ? '#232136' : colors.card,
            text: isDark ? '#fff' : colors.text,
            placeholder: isDark ? '#aaa' : colors.placeholder
          }
        }}
      />
      <Button
        mode="contained"
        onPress={handleSubmit}
        disabled={!name.trim()}
        style={styles.button}
        labelStyle={styles.buttonText}
        theme={{ colors: { primary: colors.primary } }}
      >
        Salvar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 32,
    alignItems: 'center',
    width: '100%',
  },
  input: {
    width: '100%',
    marginBottom: 18,
  },
  button: {
    width: '100%',
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});