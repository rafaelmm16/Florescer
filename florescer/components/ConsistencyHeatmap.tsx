import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Routine } from '../types/routine';
import { useTheme } from './ThemeContext';
import GlassCard from './GlassCard';
import { getFormattedDate } from '../utils/streak';

interface ConsistencyHeatmapProps {
  routines: Routine[];
}

const DAYS_TO_SHOW = 28; // 4 weeks

export default function ConsistencyHeatmap({ routines }: ConsistencyHeatmapProps) {
  const { theme, isDark } = useTheme();

  // 1. Gather all completion dates
  const completionCountMap: { [date: string]: number } = {};

  routines.forEach((routine) => {
    if (Array.isArray(routine.completedDates)) {
      routine.completedDates.forEach((dateStr) => {
        completionCountMap[dateStr] = (completionCountMap[dateStr] || 0) + 1;
      });
    } else if (routine.lastCompletedDate) {
      completionCountMap[routine.lastCompletedDate] =
        (completionCountMap[routine.lastCompletedDate] || 0) + 1;
    }
  });

  // 2. Generate dates for the last 28 days
  const today = new Date();
  const daysList: { dateStr: string; dayLabel: number; count: number }[] = [];

  for (let i = DAYS_TO_SHOW - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = getFormattedDate(d);
    daysList.push({
      dateStr,
      dayLabel: d.getDate(),
      count: completionCountMap[dateStr] || 0,
    });
  }

  const getCellColor = (count: number) => {
    if (count === 0) {
      return isDark ? 'rgba(255, 255, 255, 0.04)' : '#F1F5F9';
    }
    if (count === 1) {
      return isDark ? 'rgba(52, 211, 153, 0.40)' : '#A7F3D0';
    }
    if (count === 2) {
      return isDark ? 'rgba(52, 211, 153, 0.70)' : '#34D399';
    }
    return isDark ? '#34D399' : '#059669';
  };

  const totalActiveDays = Object.keys(completionCountMap).length;

  return (
    <View style={styles.container}>
      <GlassCard borderRadius={18} style={styles.card}>
        <View style={styles.cardContent}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Constância (Últimos 28 Dias)
            </Text>
            <Text style={[styles.subtext, { color: theme.colors.onSurfaceVariant }]}>
              {totalActiveDays} {totalActiveDays === 1 ? 'dia ativo' : 'dias ativos'}
            </Text>
          </View>

          {/* Grid */}
          <View style={styles.gridContainer}>
            {daysList.map((item) => {
              const bg = getCellColor(item.count);
              return (
                <View
                  key={item.dateStr}
                  style={[
                    styles.cell,
                    {
                      backgroundColor: bg,
                      borderColor: item.count > 0 ? bg : isDark ? 'rgba(255, 255, 255, 0.06)' : '#E2E8F0',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.cellText,
                      {
                        color:
                          item.count > 1
                            ? '#FFFFFF'
                            : isDark
                            ? 'rgba(255, 255, 255, 0.5)'
                            : '#64748B',
                        fontWeight: item.count > 0 ? '700' : '400',
                      },
                    ]}
                  >
                    {item.dayLabel}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Minimalist Legend */}
          <View style={styles.legendRow}>
            <Text style={[styles.legendLabel, { color: theme.colors.onSurfaceVariant }]}>Menos</Text>
            <View style={[styles.legendDot, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9' }]} />
            <View style={[styles.legendDot, { backgroundColor: isDark ? 'rgba(52, 211, 153, 0.40)' : '#A7F3D0' }]} />
            <View style={[styles.legendDot, { backgroundColor: isDark ? 'rgba(52, 211, 153, 0.70)' : '#34D399' }]} />
            <View style={[styles.legendDot, { backgroundColor: isDark ? '#34D399' : '#059669' }]} />
            <Text style={[styles.legendLabel, { color: theme.colors.onSurfaceVariant }]}>Mais</Text>
          </View>
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    width: '100%',
  },
  cardContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  subtext: {
    fontSize: 12,
    fontWeight: '500',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'space-between',
  },
  cell: {
    width: '12%',
    aspectRatio: 1,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 10,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 5,
    marginTop: 12,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  legendLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
});
