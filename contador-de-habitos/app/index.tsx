import { View, FlatList, StyleSheet, SafeAreaView, Text, Modal } from 'react-native';
import { useState, useCallback } from 'react';
import HabitItem from '../components/HabitItem';
import { loadHabits, saveHabits } from '../utils/storage';
import { Habit } from '../types/habit';
import { Link, useFocusEffect } from 'expo-router';
import colors from '../constants/colors';
import Header from '../components/Header';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [trash, setTrash] = useState<Habit[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const { theme } = useTheme();

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

  const openHabitModal = (habit: Habit) => {
    setSelectedHabit(habit);
    setModalVisible(true);
  };

  const markHabitDone = () => {
    if (!selectedHabit) return;
    const updatedHabits = habits.map(h =>
      h.id === selectedHabit.id ? { ...h, done: true } : h
    );
    setHabits(updatedHabits);
    saveHabits({ habits: updatedHabits, trash });
    setModalVisible(false);
    setSelectedHabit(null);
  };

  const isDark = theme === 'dark';

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ backgroundColor: isDark ? '#181825' : '#fff', flex: 1 }}>
        <Header title="Meus Hábitos" />
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HabitItem
              habit={item}
              onPress={() => openHabitModal(item)}
              onDelete={() => askDeleteHabit(item)}
            />
          )}
          contentContainerStyle={habits.length === 0 && styles.emptyList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum hábito cadastrado ainda.</Text>
          }
          showsVerticalScrollIndicator={false}
        />

        {/* Modal de detalhes do hábito */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedHabit?.name}</Text>
              <Text style={styles.modalMessage}>
                Criado em: {selectedHabit?.createdAt && new Date(selectedHabit.createdAt).toLocaleDateString()}
              </Text>
              <Text style={styles.modalMessage}>
                Status: {selectedHabit?.done ? 'Concluído' : 'Pendente'}
              </Text>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Fechar</Text>
                </TouchableOpacity>
                {!selectedHabit?.done && (
                  <TouchableOpacity
                    style={styles.modalDelete}
                    onPress={markHabitDone}
                  >
                    <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Concluir</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Modal>

        {/* Botão flutuante */}
        <Link href="/new" asChild>
          <TouchableOpacity style={styles.fab}>
            <Ionicons name="add" size={36} color="#fff" />
          </TouchableOpacity>
        </Link>
      </View>
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
  fab: {
    position: 'absolute',
    bottom: 76, // aumenta para ficar acima da navbar (ajuste conforme altura da navbar)
    right: 16,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});