import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Habit } from '../types/habit';
import colors from '../constants/colors';
import typography from '../constants/typography';

interface Props {
  habit: Habit;
  onPress: (habit: Habit) => void;
  onDelete?: (id: string) => void;
}

export default function HabitItem({ habit, onPress, onDelete }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onPress(habit)} style={styles.touchable}>
        <Text style={styles.text}>{habit.name}</Text>
      </TouchableOpacity>
      {onDelete && (
        <TouchableOpacity
          onPress={() => onDelete(habit.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Apagar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 12, // Bordas mais arredondadas
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  touchable: {
    flex: 1,
  },
  text: {
    ...typography.bodyLarge,
    color: colors.onSurfaceVariant,
  },
  deleteButton: {
    marginLeft: 12,
    backgroundColor: colors.error,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20, // Botão em formato de pílula
  },
  deleteButtonText: {
    ...typography.labelLarge,
    color: colors.onError,
    fontWeight: 'bold',
  },
});