import { View, FlatList, StyleSheet, SafeAreaView, Text, Modal } from 'react-native';
import { useState, useCallback } from 'react';
import HabitItem from '../components/HabitItem';
import { loadHabits, saveHabits } from '../utils/storage';
import { Habit } from '../types/habit';
import { Link, useFocusEffect } from 'expo-router';
import colors from '../constants/colors';
import Header from '../components/Header';
import { TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [trash, setTrash] = useState<Habit[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadHabits().then(data => {
        setHabits(data?.habits || []);
        setTrash(data?.trash || []);
      });
    }, [])
  );

  const toggleHabit = (id: string) => {
    const updatedHabits = habits.map((h) =>
      h.id === id ? { ...h, done: !h.done } : h
    );
    setHabits(updatedHabits);
    saveHabits({ habits: updatedHabits, trash });
  };

  const askDeleteHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    setModalVisible(true);
  };

  const confirmDeleteHabit = () => {
    if (!selectedHabit) return;
    const updatedHabits = habits.filter(h => h.id !== selectedHabit.id);
    const updatedTrash = [selectedHabit, ...trash];
    setHabits(updatedHabits);
    setTrash(updatedTrash);
    saveHabits({ habits: updatedHabits, trash: updatedTrash });
    setModalVisible(false);
    setSelectedHabit(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Meus Hábitos"
        right={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Link href="/trash" asChild>
              <TouchableOpacity style={styles.trashButton}>
                <Text style={styles.trashButtonText}>Lixeira</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/new" asChild>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>+ Novo Hábito</Text>
              </TouchableOpacity>
            </Link>
          </View>
        }
      />
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HabitItem habit={item} onToggle={toggleHabit} onDelete={() => askDeleteHabit(item)} />
        )}
        contentContainerStyle={habits.length === 0 && styles.emptyList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum hábito cadastrado ainda.</Text>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Modal customizado */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Mover para a lixeira?</Text>
            <Text style={styles.modalMessage}>
              Tem certeza que deseja mover "{selectedHabit?.name}" para a lixeira?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalDelete}
                onPress={confirmDeleteHabit}
              >
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Mover</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 0,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    elevation: 2,
    marginLeft: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  trashButton: {
    backgroundColor: colors.danger,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    elevation: 2,
    marginRight: 8,
  },
  trashButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.danger,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancel: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 6,
    backgroundColor: '#F0F0F0',
  },
  modalDelete: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginLeft: 8,
    borderRadius: 6,
    backgroundColor: colors.danger,
  },
});