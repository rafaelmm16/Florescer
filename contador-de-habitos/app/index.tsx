import { View, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import HabitItem from '../components/HabitItem';
import { loadHabits, saveHabits } from '../utils/storage';
import { Habit } from '../types/habit';
import { Link } from 'expo-router';
import { Button } from 'react-native';

export default function HomeScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    loadHabits().then(setHabits);
  }, []);

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, done: !h.done } : h))
    );
  };

  return (
    <View style={{ padding: 20, marginTop: 50 }}>
      <Link href="/new" asChild>
        <Button title="Novo Hábito" />
      </Link>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HabitItem habit={item} onToggle={toggleHabit} />
        )}
      />
    </View>
  );
}