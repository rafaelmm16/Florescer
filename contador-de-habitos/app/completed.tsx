import { FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useState, useCallback } from 'react';
import { Text } from 'react-native-paper';
import HabitItem from '../components/HabitItem';
import { loadHabits } from '../utils/storage';
import { Habit } from '../types/habit';
import Header from '../components/Header';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '../components/ThemeContext';

export default function CompletedHabitsScreen() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const { theme } = useTheme();

    useFocusEffect(
        useCallback(() => {
            loadHabits().then(data => {
                setHabits((data?.habits || []).filter(h => h.done));
            });
        }, [])
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Header title="Hábitos Concluídos" showBack />
            <FlatList
                data={habits}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <HabitItem habit={item} onPress={() => { }} />
                )}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
                ListEmptyComponent={
                    <Text variant="bodyLarge" style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                        Nenhum hábito concluído ainda.
                    </Text>
                }
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        paddingHorizontal: 16,
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