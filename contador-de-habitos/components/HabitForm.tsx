import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Habit } from '../types/habit';
import colors from '../constants/colors';

interface Props {
  onSubmit: (habit: Habit) => void;
}

export default function HabitForm({ onSubmit }: Props) {
  const [name, setName] = useState('');

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
        style={styles.input}
        placeholder="Nome do hábito"
        placeholderTextColor={colors.placeholder}
        value={name}
        onChangeText={setName}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />
      <TouchableOpacity
        style={[styles.button, !name.trim() && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!name.trim()}
      >
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
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
    padding: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.card,
    fontSize: 18,
    color: colors.text,
    marginBottom: 18,
    elevation: 2,
  },
  button: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: colors.placeholder,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});