import { View, FlatList, StyleSheet, SafeAreaView, Text } from 'react-native';
import { useState, useCallback } from 'react';
import HabitItem from '../components/HabitItem';
import { loadHabits } from '../utils/storage';
import { Habit } from '../types/habit';
import Header from '../components/Header';
import { useFocusEffect } from 'expo-router';
import colors from '../constants/colors';
import { useTheme } from '../components/ThemeContext';

export default function CompletedHabitsScreen() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useFocusEffect(
        useCallback(() => {
            loadHabits().then(data => {
                setHabits((data?.habits || []).filter(h => h.done));
            });
        }, [])
    );

    return (
        <SafeAreaView style={[
            styles.container,
            { backgroundColor: isDark ? '#181825' : colors.background }
        ]}>
            <Header title="Hábitos Concluídos" showBack />
            <FlatList
                data={habits}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <HabitItem habit={item} onPress={() => { }} />
                )}
                contentContainerStyle={habits.length === 0 && styles.emptyList}
                ListEmptyComponent={
                    <Text style={[
                        styles.emptyText,
                        { color: isDark ? '#aaa' : colors.placeholder }
                    ]}>
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
        backgroundColor: colors.background,
        paddingHorizontal: 0,
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