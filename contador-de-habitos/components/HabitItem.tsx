import { View, Text, TouchableOpacity } from 'react-native';
import { Habit } from '../types/habit';
import { useRouter } from 'expo-router';
import colors from '../constants/colors';

interface Props {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function HabitItem({ habit, onToggle, onDelete }: Props) {
  const router = useRouter();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginVertical: 8,
        backgroundColor: habit.done ? '#A5D6A7' : '#E0E0E0',
        borderRadius: 8,
      }}
    >
      <TouchableOpacity
        onPress={() => onToggle(habit.id)}
        onLongPress={() => router.push(`/habit/${habit.id}`)}
        style={{ flex: 1 }}
      >
        <Text style={{ fontSize: 18 }}>{habit.name}</Text>
      </TouchableOpacity>
      {onDelete && (
        <TouchableOpacity
          onPress={() => onDelete(habit.id)}
          style={{
            marginLeft: 12,
            backgroundColor: colors.danger,
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 6,
          }}
        >
          <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Apagar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}