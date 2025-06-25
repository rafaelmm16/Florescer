import { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, Modal, TouchableOpacity } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { loadHabits, saveHabits } from '../utils/storage';
import { Habit } from '../types/habit';
import Header from '../components/Header';
import { useRouter } from 'expo-router';
import { useTheme } from '../components/ThemeContext';

export default function TrashScreen() {
  const [trash, setTrash] = useState<Habit[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    loadHabits().then(data => {
      setTrash(data.trash || []);
      setHabits(data.habits || []);
    });
  }, []);

  const restoreHabit = (id: string) => {
    // ... (lógica inalterada)
  };

  const confirmDelete = (habit: Habit) => {
    setSelectedHabit(habit);
    setModalVisible(true);
  };

  const deleteForever = () => {
    // ... (lógica inalterada)
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Lixeira" showBack onBack={() => router.back()} />
      <FlatList
        data={trash}
        keyExtractor={item => item.id}
        contentContainerStyle={trash.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={
          <Text variant="bodyLarge" style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
              Nenhum hábito na lixeira.
          </Text>
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.name} titleStyle={{ color: theme.colors.onSurface }} />
            <Card.Actions>
              <Button onPress={() => confirmDelete(item)} textColor={theme.colors.error}>
                Excluir
              </Button>
              <Button onPress={() => restoreHabit(item.id)}>
                Restaurar
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
      {/* O Modal pode ser substituído pelo componente Dialog da react-native-paper para um visual mais integrado */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        padding: 8,
    },
    card: {
        margin: 8,
    },
    emptyList: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 40,
        textAlign: 'center',
    },
});