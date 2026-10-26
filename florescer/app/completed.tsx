import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Share } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoutineStore } from '../store/useRoutineStore';
import RoutineItem from '../components/RoutineItem';
import Header from '../components/Header';
import { useTheme } from '../components/ThemeContext';
import GlassCard from '../components/GlassCard';
import GlassBackground from '../components/GlassBackground';
import ConsistencyHeatmap from '../components/ConsistencyHeatmap';
import AchievementsGrid from '../components/AchievementsGrid';
import HabitNoteModal from '../components/HabitNoteModal';
import { HABIT_CATEGORIES } from '../constants/categories';
import { triggerLightHaptic, triggerSuccessHaptic } from '../utils/haptics';
import { getTodayDateString } from '../utils/streak';
import { Routine } from '../types/routine';

export default function CompletedScreen() {
  const { theme, isDark } = useTheme();
  const { routines, loadRoutines, updateRoutine, deleteRoutine } = useRoutineStore();

  const [expandedRoutines, setExpandedRoutines] = useState<Set<string>>(new Set());
  const [journalRoutine, setJournalRoutine] = useState<Routine | null>(null);

  const completedRoutines = routines.filter((r) => r.isCompleted);

  useFocusEffect(
    useCallback(() => {
      loadRoutines();
    }, [])
  );

  const highestStreak = Math.max(
    0,
    ...routines.map((r) => Math.max(r.streak || 0, r.bestStreak || 0))
  );

  const totalCompletions = routines.reduce(
    (acc, r) => acc + (Array.isArray(r.completedDates) ? r.completedDates.length : r.isCompleted ? 1 : 0),
    0
  );

  const completionRate =
    routines.length > 0
      ? Math.round((completedRoutines.length / routines.length) * 100)
      : 0;

  const toggleExpand = (id: string) => {
    triggerLightHaptic();
    setExpandedRoutines((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSaveNote = async (routineId: string, text: string) => {
    const target = routines.find((r) => r.id === routineId);
    if (!target) return;

    const newNote = {
      id: Date.now().toString(),
      date: getTodayDateString(),
      text,
    };

    const updatedNotes = [...(target.notes || []), newNote];
    await updateRoutine({
      ...target,
      notes: updatedNotes,
    });
  };

  const handleShareAchievements = async () => {
    triggerLightHaptic();
    try {
      await Share.share({
        title: 'Minhas Conquistas no Florescer 🌱',
        message: `🌱 Florescer | Meu Progresso de Hábitos:\n🔥 Recorde de Ofensiva: ${highestStreak} dias seguidos\n🎯 Total de Conclusões: ${totalCompletions}\n⚡ Taxa de Hoje: ${completionRate}%\n\nTransformando pequenos hábitos em grandes conquistas com o Florescer! ✨`,
      });
      triggerSuccessHaptic();
    } catch {}
  };

  // Distribution of habits by category
  const categoryCounts = HABIT_CATEGORIES.map((cat) => ({
    ...cat,
    count: routines.filter((r) => r.category === cat.id).length,
  })).filter((c) => c.count > 0);

  return (
    <GlassBackground>
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Conquistas"
          subtitle="Histórico & Desempenho"
          right={
            <View style={styles.headerRightRow}>
              <TouchableOpacity
                onPress={handleShareAchievements}
                style={[
                  styles.shareBtn,
                  {
                    backgroundColor: isDark ? 'rgba(56, 189, 248, 0.12)' : '#F0F9FF',
                    borderColor: isDark ? 'rgba(56, 189, 248, 0.25)' : '#BAE6FD',
                  },
                ]}
                accessibilityLabel="Compartilhar Conquistas"
              >
                <Ionicons
                  name="share-social-outline"
                  size={16}
                  color={isDark ? '#38BDF8' : '#0284C7'}
                />
              </TouchableOpacity>

              <View
                style={[
                  styles.badgePill,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                  },
                ]}
              >
                <Text style={[styles.badgePillText, { color: isDark ? '#34D399' : '#059669' }]}>
                  {completedRoutines.length} concluídas
                </Text>
              </View>
            </View>
          }
        />

        <FlatList
          data={completedRoutines}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <RoutineItem
              routine={item}
              onUpdate={updateRoutine}
              onDelete={deleteRoutine}
              isExpanded={expandedRoutines.has(item.id)}
              onExpandToggle={() => toggleExpand(item.id)}
              onOpenJournal={(r) => setJournalRoutine(r)}
              index={index}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              {/* Minimalist 3-Stat Row */}
              <View style={styles.statsRow}>
                {/* Streak Record */}
                <GlassCard borderRadius={16} style={styles.statCard}>
                  <View style={styles.statContent}>
                    <Text style={[styles.statValue, { color: isDark ? '#FB923C' : '#EA580C' }]}>
                      {highestStreak}d
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                      Recorde 🔥
                    </Text>
                  </View>
                </GlassCard>

                {/* Total Completions */}
                <GlassCard borderRadius={16} style={styles.statCard}>
                  <View style={styles.statContent}>
                    <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
                      {totalCompletions}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                      Feitos 🎯
                    </Text>
                  </View>
                </GlassCard>

                {/* Today's Rate */}
                <GlassCard borderRadius={16} style={styles.statCard}>
                  <View style={styles.statContent}>
                    <Text style={[styles.statValue, { color: isDark ? '#34D399' : '#059669' }]}>
                      {completionRate}%
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                      Hoje ⚡
                    </Text>
                  </View>
                </GlassCard>
              </View>

              {/* Consistency Heatmap */}
              <ConsistencyHeatmap routines={routines} />

              {/* Achievements & Badges Grid */}
              <AchievementsGrid routines={routines} />

              {/* Habit Category Balance Breakdown */}
              {categoryCounts.length > 0 && (
                <View style={styles.categoryBalanceSection}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}>
                    Equilíbrio por Categoria
                  </Text>
                  <GlassCard borderRadius={16} style={styles.categoryCard}>
                    <View style={styles.categoryGrid}>
                      {categoryCounts.map((cat) => (
                        <View
                          key={cat.id}
                          style={[
                            styles.categoryChip,
                            {
                              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
                              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                            },
                          ]}
                        >
                          <View style={[styles.catIconCircle, { backgroundColor: cat.color + '22' }]}>
                            <Ionicons name={cat.icon as any} size={13} color={cat.color} />
                          </View>
                          <Text style={[styles.catName, { color: theme.colors.onSurface }]}>
                            {cat.name.split('&')[0].trim()}
                          </Text>
                          <View style={[styles.catCountBadge, { backgroundColor: cat.color + '25' }]}>
                            <Text style={[styles.catCountText, { color: cat.color }]}>
                              {cat.count}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </GlassCard>
                </View>
              )}

              {completedRoutines.length > 0 && (
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}>
                  Concluídos Hoje
                </Text>
              )}
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <GlassCard borderRadius={18} style={styles.emptyCard}>
                <View style={styles.emptyCardContent}>
                  <View
                    style={[
                      styles.emptyIconCircle,
                      {
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                      },
                    ]}
                  >
                    <Ionicons
                      name="trophy-outline"
                      size={28}
                      color={theme.colors.onSurfaceVariant}
                    />
                  </View>
                  <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
                    Nenhuma conclusão hoje
                  </Text>
                  <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                    Conclua seus hábitos na tela inicial para acompanhar a sua evolução aqui.
                  </Text>
                </View>
              </GlassCard>
            </View>
          }
        />

        {/* Note / Journal Modal for reflections on completed habits */}
        <HabitNoteModal
          visible={!!journalRoutine}
          routine={journalRoutine}
          onClose={() => setJournalRoutine(null)}
          onSaveNote={handleSaveNote}
        />
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
    paddingBottom: 120,
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shareBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  badgePillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  categoryBalanceSection: {
    marginBottom: 14,
  },
  categoryCard: {
    padding: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  catIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catName: {
    fontSize: 12,
    fontWeight: '600',
  },
  catCountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  catCountText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
    marginTop: 6,
  },
  emptyContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  emptyCard: {
    width: '100%',
  },
  emptyCardContent: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 12,
  },
});