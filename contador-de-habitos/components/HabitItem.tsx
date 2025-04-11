import { View, Text, TouchableOpacity } from 'react-native';
import { Habit } from '../types/habit';
import { useRouter } from 'expo-router';

interface Props {
  habit: Habit;
  onToggle: (id: string) => void;
}

export default function HabitItem({ habit, onToggle }: Props) {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => onToggle(habit.id)}
      onLongPress={() => router.push(`/habit/${habit.id}`)}
      style={{
        padding: 16,
        marginVertical: 8,
        backgroundColor: habit.done ? '#A5D6A7' : '#E0E0E0',
        borderRadius: 8
      }}
    >
      <Text style={{ fontSize: 18 }}>{habit.name}</Text>
    </TouchableOpacity>
  );
}