import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function HabitDetail() {
  const { id } = useLocalSearchParams();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Detalhes do Hábito</Text>
      <Text>ID: {id}</Text>
    </View>
  );
}
