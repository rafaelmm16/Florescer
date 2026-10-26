import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from './ThemeContext';
import GlassCard from './GlassCard';
import { Achievement, computeAchievements } from '../constants/achievements';
import { Routine } from '../types/routine';

interface AchievementsGridProps {
  routines: Routine[];
}

export default function AchievementsGrid({ routines }: AchievementsGridProps) {
  const { theme, isDark } = useTheme();
  const achievements = computeAchievements(routines);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}>
          Medalhas & Conquistas
        </Text>
        <Text style={[styles.countBadge, { color: isDark ? '#34D399' : '#059669' }]}>
          {unlockedCount}/{achievements.length} desbloqueadas
        </Text>
      </View>

      <View style={styles.grid}>
        {achievements.map((item) => {
          return (
            <GlassCard
              key={item.id}
              borderRadius={16}
              style={[
                styles.badgeCard,
                item.unlocked && {
                  borderColor: isDark ? 'rgba(52, 211, 153, 0.25)' : '#BBF7D0',
                },
                !item.unlocked && { opacity: 0.65 },
              ]}
            >
              <View style={styles.cardContent}>
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor: item.unlocked
                        ? isDark
                          ? 'rgba(52, 211, 153, 0.12)'
                          : '#ECFDF5'
                        : isDark
                        ? 'rgba(255, 255, 255, 0.04)'
                        : '#F1F5F9',
                      borderColor: item.unlocked
                        ? isDark
                          ? 'rgba(52, 211, 153, 0.3)'
                          : '#A7F3D0'
                        : isDark
                        ? 'rgba(255, 255, 255, 0.06)'
                        : '#E2E8F0',
                    },
                  ]}
                >
                  <Text style={styles.iconEmoji}>{item.icon}</Text>
                </View>

                <View style={styles.infoCol}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.title, { color: theme.colors.onSurface }]}>
                      {item.title}
                    </Text>
                    {item.unlocked && <Text style={styles.checkMark}>✓</Text>}
                  </View>

                  <Text
                    style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>

                  {/* Progress bar */}
                  <View
                    style={[
                      styles.track,
                      { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9' },
                    ]}
                  >
                    <View
                      style={[
                        styles.fill,
                        {
                          width: `${Math.round(item.progressRatio * 100)}%`,
                          backgroundColor: item.unlocked
                            ? isDark
                              ? '#34D399'
                              : '#059669'
                            : isDark
                            ? '#38BDF8'
                            : '#0F172A',
                        },
                      ]}
                    />
                  </View>

                  <Text style={[styles.progressText, { color: theme.colors.onSurfaceVariant }]}>
                    {item.progressText}
                  </Text>
                </View>
              </View>
            </GlassCard>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  countBadge: {
    fontSize: 11,
    fontWeight: '700',
  },
  grid: {
    gap: 8,
  },
  badgeCard: {
    width: '100%',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconEmoji: {
    fontSize: 22,
  },
  infoCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  checkMark: {
    fontSize: 12,
    fontWeight: '800',
    color: '#10B981',
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6,
  },
  track: {
    height: 3,
    borderRadius: 1.5,
    width: '100%',
    overflow: 'hidden',
    marginBottom: 4,
  },
  fill: {
    height: '100%',
    borderRadius: 1.5,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
