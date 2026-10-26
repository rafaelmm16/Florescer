import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { Routine } from '../types/routine';
import { useRoutineStore } from '../store/useRoutineStore';
import RoutineItem from '../components/RoutineItem';
import Header from '../components/Header';
import { useTheme } from '../components/ThemeContext';
import NewRoutineButton from '../components/NewRoutineButton';
import GlassCard from '../components/GlassCard';
import GlassBackground from '../components/GlassBackground';

export default function HomeScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();

  const { routines, loadRoutines, updateRoutine, deleteRoutine, reorderRoutines } = useRoutineStore();
  const activeRoutines = routines.filter((r) => !r.isCompleted);
  const completedCount = routines.filter((r) => r.isCompleted).length;

  const [expandedRoutines, setExpandedRoutines] = useState<Set<string>>(new Set());

  useFocusEffect(
    useCallback(() => {
      loadRoutines();
    }, [])
  );

  const toggleExpandRoutine = (id: string) => {
    setExpandedRoutines((currentExpanded) => {
      const newExpanded = new Set(currentExpanded);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return newExpanded;
    });
  };

  const handleUpdateRoutine = async (updatedRoutine: Routine) => {
    await updateRoutine(updatedRoutine);
  };

  const handleDeleteRoutine = async (id: string) => {
    await deleteRoutine(id);
  };

  const handleDragEnd = async ({ data }: { data: Routine[] }) => {
    const completedRoutines = routines.filter((r) => r.isCompleted);
    await reorderRoutines([...data, ...completedRoutines]);
  };

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Routine>) => {
      return (
        <RoutineItem
          routine={item}
          onUpdate={handleUpdateRoutine}
          onDelete={handleDeleteRoutine}
          drag={drag}
          isActive={isActive}
          isExpanded={expandedRoutines.has(item.id)}
          onExpandToggle={() => toggleExpandRoutine(item.id)}
          index={activeRoutines.findIndex((r) => r.id === item.id)}
        />
      );
    },
    [expandedRoutines, activeRoutines]
  );

  const today = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  const formattedDate = today.charAt(0).toUpperCase() + today.slice(1);
  const maxStreak = Math.max(0, ...routines.map((r) => r.streak || 0));
  const progressPercent =
    routines.length > 0 ? Math.round((completedCount / routines.length) * 100) : 0;

  return (
    <GlassBackground>
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Meus Hábitos"
          subtitle={formattedDate}
          right={
            <View style={styles.headerBadgesRow}>
              {maxStreak > 0 && (
                <View
                  style={[
                    styles.streakBadge,
                    {
                      backgroundColor: isDark ? 'rgba(249, 115, 22, 0.12)' : '#FFF7ED',
                      borderColor: isDark ? 'rgba(249, 115, 22, 0.25)' : '#FFEDD5',
                    },
                  ]}
                >
                  <Text style={styles.streakBadgeText}>🔥 {maxStreak}d</Text>
                </View>
              )}

              <View
                style={[
                  styles.countBadge,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                  },
                ]}
              >
                <Text style={[styles.countBadgeText, { color: theme.colors.onSurfaceVariant }]}>
                  {activeRoutines.length} ativas
                </Text>
              </View>
            </View>
          }
        />

        {/* Minimalist Overview Stats Banner */}
        {routines.length > 0 && (
          <View style={styles.statsWrapper}>
            <GlassCard borderRadius={18} style={styles.statsCard}>
              <View style={styles.statsContent}>
                <View style={styles.statsGrid}>
                  <View style={styles.statCol}>
                    <Text style={[styles.statNum, { color: theme.colors.onSurface }]}>
                      {activeRoutines.length}
                    </Text>
                    <Text style={[styles.statText, { color: theme.colors.onSurfaceVariant }]}>
                      Pendentes
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statDivider,
                      { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9' },
                    ]}
                  />

                  <View style={styles.statCol}>
                    <Text style={[styles.statNum, { color: isDark ? '#34D399' : '#059669' }]}>
                      {completedCount}
                    </Text>
                    <Text style={[styles.statText, { color: theme.colors.onSurfaceVariant }]}>
                      Feitas
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statDivider,
                      { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9' },
                    ]}
                  />

                  <View style={styles.statCol}>
                    <Text style={[styles.statNum, { color: theme.colors.onSurface }]}>
                      {progressPercent}%
                    </Text>
                    <Text style={[styles.statText, { color: theme.colors.onSurfaceVariant }]}>
                      Progresso
                    </Text>
                  </View>
                </View>

                {/* Minimalist 3px Progress Line */}
                <View
                  style={[
                    styles.progressTrack,
                    { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9' },
                  ]}
                >
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${progressPercent}%`,
                        backgroundColor: isDark ? '#38BDF8' : '#0F172A',
                      },
                    ]}
                  />
                </View>
              </View>
            </GlassCard>
          </View>
        )}

        <DraggableFlatList
          data={activeRoutines}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onDragEnd={handleDragEnd}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <GlassCard borderRadius={20} style={styles.emptyCard}>
                <View style={styles.emptyCardContent}>
                  {routines.length > 0 ? (
                    <>
                      <View
                        style={[
                          styles.emptyIconBox,
                          {
                            backgroundColor: isDark ? 'rgba(52, 211, 153, 0.12)' : '#ECFDF5',
                            borderColor: isDark ? 'rgba(52, 211, 153, 0.25)' : '#A7F3D0',
                          },
                        ]}
                      >
                        <Ionicons
                          name="checkmark"
                          size={28}
                          color={isDark ? '#34D399' : '#059669'}
                        />
                      </View>

                      <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
                        Tudo pronto por hoje!
                      </Text>
                      <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                        Todos os seus hábitos de hoje foram concluídos. Continue consistente amanhã!
                      </Text>

                      <TouchableOpacity
                        onPress={() => router.push('/completed')}
                        activeOpacity={0.8}
                        style={[
                          styles.emptyButton,
                          {
                            backgroundColor: isDark ? '#34D399' : '#0F172A',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.emptyButtonText,
                            { color: isDark ? '#090D14' : '#FFFFFF' },
                          ]}
                        >
                          Ver Histórico
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <View
                        style={[
                          styles.emptyIconBox,
                          {
                            backgroundColor: isDark ? 'rgba(56, 189, 248, 0.12)' : '#F0F9FF',
                            borderColor: isDark ? 'rgba(56, 189, 248, 0.25)' : '#BAE6FD',
                          },
                        ]}
                      >
                        <Ionicons
                          name="leaf-outline"
                          size={28}
                          color={isDark ? '#38BDF8' : '#0284C7'}
                        />
                      </View>

                      <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
                        Nenhum hábito ainda
                      </Text>
                      <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                        Crie seu primeiro hábito para começar a transformar sua rotina.
                      </Text>

                      <TouchableOpacity
                        onPress={() => router.push('/new')}
                        activeOpacity={0.8}
                        style={[
                          styles.emptyButton,
                          {
                            backgroundColor: isDark ? '#38BDF8' : '#0F172A',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.emptyButtonText,
                            { color: isDark ? '#090D14' : '#FFFFFF' },
                          ]}
                        >
                          + Criar Hábito
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </GlassCard>
            </View>
          }
        />

        <NewRoutineButton />
      </SafeAreaView>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 130,
  },
  headerBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  streakBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EA580C',
  },
  countBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsWrapper: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  statsCard: {
    width: '100%',
  },
  statsContent: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statNum: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  statText: {
    fontSize: 11,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 24,
  },
  progressTrack: {
    height: 3,
    borderRadius: 1.5,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  emptyContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  emptyCard: {
    width: '100%',
  },
  emptyCardContent: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 24,
  },
  emptyIconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});