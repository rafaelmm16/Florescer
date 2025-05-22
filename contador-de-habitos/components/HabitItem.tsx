import { View, Text, TouchableOpacity } from 'react-native';
import { Habit } from '../types/habit';
import colors from '../constants/colors';

interface Props {
  habit: Habit;
  onPress: (habit: Habit) => void;
  onDelete?: (id: string) => void;
}

export default function HabitItem({ habit, onPress, onDelete }: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 8,
      }}
    >
      <TouchableOpacity onPress={() => onPress(habit)} style={{ flex: 1 }}>
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