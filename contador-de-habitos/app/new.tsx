import HabitForm from '../components/HabitForm';
import { useEffect, useState } from 'react';
import { loadHabits, saveHabits } from '../utils/storage';
import { Habit } from '../types/habit';

export default function NewHabitScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    loadHabits().then(setHabits);
  }, []);

  const handleSubmit = (newHabit: Habit) => {
    const updated = [...habits, newHabit];
    setHabits(updated);
    saveHabits(updated);
  };

  return <HabitForm onSubmit={handleSubmit} />;
}