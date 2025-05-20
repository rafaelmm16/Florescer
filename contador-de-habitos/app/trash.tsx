import { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import { loadHabits, saveHabits } from '../utils/storage';
import { Habit } from '../types/habit';
import Header from '../components/Header';
import colors from '../constants/colors';
import { useRouter } from 'expo-router';

export default function TrashScreen() {
  const [trash, setTrash] = useState<Habit[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
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
    const updatedTrash = trash.filter(h => h.id !== id);
    const updatedHabits = [habitToRestore, ...habits];
    setTrash(updatedTrash);
    setHabits(updatedHabits);
    saveHabits({ habits: updatedHabits, trash: updatedTrash });
  };

  const confirmDelete = (habit: Habit) => {
    setSelectedHabit(habit);
    setModalVisible(true);
  };

  const deleteForever = () => {
    if (!selectedHabit) return;
    const updatedTrash = trash.filter(h => h.id !== selectedHabit.id);
    setTrash(updatedTrash);
    saveHabits({ habits, trash: updatedTrash });
    setModalVisible(false);
    setSelectedHabit(null);
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
                onPress={() => confirmDelete(item)}
                style={styles.deleteButton}
              >
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
            <Text style={styles.modalTitle}>Excluir permanentemente?</Text>
            <Text style={styles.modalMessage}>
              Tem certeza que deseja excluir "{selectedHabit?.name}" para sempre?
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
                onPress={deleteForever}
              >
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Excluir</Text>
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