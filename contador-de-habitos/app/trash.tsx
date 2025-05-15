import { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { loadHabits, saveHabits } from '../utils/storage';
import { Habit } from '../types/habit';
import Header from '../components/Header';
import colors from '../constants/colors';
import { useRouter } from 'expo-router';

export default function TrashScreen() {
  const [trash, setTrash] = useState<Habit[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadHabits().then(data => {
      setTrash(data.trash || []);
      setHabits(data.habits || []);
    });
  }, []);

  const restoreHabit = (id: string) => {
    const habitToRestore = trash.find(h => h.id === id);
    if (!habitToRestore) return;
    setTrash(prev => prev.filter(h => h.id !== id));
    setHabits(prev => [habitToRestore, ...prev]);
    saveHabits({ habits: [habitToRestore, ...habits], trash: trash.filter(h => h.id !== id) });
  };

  const deleteForever = (id: string) => {
    Alert.alert(
      'Excluir permanentemente',
      'Deseja excluir este hábito para sempre?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setTrash(prev => prev.filter(h => h.id !== id));
            saveHabits({ habits, trash: trash.filter(h => h.id !== id) });
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Lixeira" showBack onBack={() => router.back()} />
      <FlatList
        data={trash}
        keyExtractor={item => item.id}
        contentContainerStyle={trash.length === 0 && styles.emptyList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum hábito na lixeira.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.trashItem}>
            <Text style={styles.trashText}>{item.name}</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => restoreHabit(item.id)}
                style={styles.restoreButton}
              >
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Restaurar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteForever(item.id)}
                style={styles.deleteButton}
              >
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 0,
  },
  trashItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    padding: 16,
    justifyContent: 'space-between',
  },
  trashText: {
    fontSize: 18,
    color: colors.text,
    flex: 1,
  },
  restoreButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: colors.danger,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: colors.placeholder,
    fontSize: 18,
    marginTop: 40,
    textAlign: 'center',
  },
});