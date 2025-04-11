import { View, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Habit } from '../types/habit';

interface Props {
  onSubmit: (habit: Habit) => void;
}

export default function HabitForm({ onSubmit }: Props) {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      done: false,
      createdAt: new Date().toISOString()
    };
    onSubmit(newHabit);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Nome do hábito"
        value={name}
        onChangeText={setName}
        style={{ borderBottomWidth: 1, marginBottom: 20, fontSize: 16 }}
      />
      <Button title="Salvar Hábito" onPress={handleSubmit} disabled={!name.trim()} />
    </View>
  );
}