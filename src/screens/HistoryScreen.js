// ─── HistoryScreen v2 ───────────────────────────────────────────────
// Clean, atmospheric history view with mood-accent distribution bars

import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, MOOD_ACCENTS, SPACING, TYPE, RADIUS, SHADOWS } from '../constants/theme';
import { useMood } from '../context/MoodContext';
import { useAudio } from '../context/AudioContext';
import { getMoodById, MOODS } from '../constants/moods';
import {
  formatDuration,
  getRelativeTime,
  groupByDate,
  getMostUsedMood,
  getTotalListeningTime,
  getStreak,
} from '../utils/helpers';
import MiniPlayer from '../components/MiniPlayer';

export default function HistoryScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useMood();
  const { play, pause } = useAudio();

  const stats = useMemo(() => {
    const history = state.history;
    return {
      totalSessions: history.length,
      totalTime: getTotalListeningTime(history),
      mostUsedMoodId: getMostUsedMood(history),
      streak: getStreak(history),
      grouped: groupByDate(history),
    };
  }, [state.history]);

  const mostUsedMood = stats.mostUsedMoodId
    ? getMoodById(stats.mostUsedMoodId)
    : null;

  // Mood distribution
  const moodDistribution = useMemo(() => {
    const counts = {};
    state.history.forEach((h) => {
      counts[h.moodId] = (counts[h.moodId] || 0) + 1;
    });
    const max = Math.max(...Object.values(counts), 1);
    return MOODS.map((m) => ({
      mood: m,
      count: counts[m.id] || 0,
      ratio: (counts[m.id] || 0) / max,
    })).filter((d) => d.count > 0);
  }, [state.history]);

  const handleTogglePlay = useCallback(async () => {
    const wasPlaying = state.isPlaying;
    dispatch({ type: 'TOGGLE_PLAY' });
    try {
      if (wasPlaying) await pause();
      else await play();
    } catch (e) {
      /* silent */
    }
  }, [state.isPlaying, dispatch, play, pause]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: state.currentMood ? 150 : 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>Your listening patterns</Text>

        {state.history.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="analytics-outline" size={40} color={COLORS.textGhost} />
            <Text style={styles.emptyTitle}>No sessions yet</Text>
            <Text style={styles.emptyText}>
              Start a mood session to see your patterns here
            </Text>
          </View>
        ) : (
          <>
            {/* Stats grid */}
            <Animated.View
              entering={FadeInDown.duration(400)}
              style={styles.statsGrid}
            >
              <View style={styles.statCard}>
                <Text style={styles.statNum}>{stats.totalSessions}</Text>
                <Text style={styles.statLabel}>SESSIONS</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNum}>{formatDuration(stats.totalTime)}</Text>
                <Text style={styles.statLabel}>TOTAL TIME</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNum}>{stats.streak}</Text>
                <Text style={styles.statLabel}>DAY STREAK</Text>
              </View>
              {mostUsedMood && (
                <View style={styles.statCard}>
                  <Text style={[
                    styles.statNum,
                    { color: (MOOD_ACCENTS[mostUsedMood.id] || {}).accent || COLORS.textPrimary },
                  ]}>
                    {mostUsedMood.label}
                  </Text>
                  <Text style={styles.statLabel}>TOP MOOD</Text>
                </View>
              )}
            </Animated.View>

            {/* Mood Distribution */}
            {moodDistribution.length > 0 && (
              <Animated.View
                entering={FadeInDown.delay(150).duration(400)}
                style={styles.section}
              >
                <Text style={styles.sectionLabel}>MOOD DISTRIBUTION</Text>
                <View style={styles.chart}>
                  {moodDistribution.map((item) => {
                    const itemAccent =
                      MOOD_ACCENTS[item.mood.id] || MOOD_ACCENTS.calm;
                    return (
                      <View key={item.mood.id} style={styles.chartRow}>
                        <View
                          style={[
                            styles.chartDot,
                            { backgroundColor: itemAccent.accent },
                          ]}
                        />
                        <Text style={styles.chartLabel}>{item.mood.label}</Text>
                        <View style={styles.chartBarBg}>
                          <View
                            style={[
                              styles.chartBarFill,
                              {
                                width: `${Math.max(item.ratio * 100, 8)}%`,
                                backgroundColor: itemAccent.accent,
                              },
                            ]}
                          />
                        </View>
                        <Text style={styles.chartCount}>{item.count}</Text>
                      </View>
                    );
                  })}
                </View>
              </Animated.View>
            )}

            {/* Recent Sessions */}
            <Animated.View
              entering={FadeInDown.delay(250).duration(400)}
              style={styles.section}
            >
              <Text style={styles.sectionLabel}>RECENT SESSIONS</Text>
              {Object.entries(stats.grouped)
                .slice(0, 7)
                .map(([date, items]) => (
                  <View key={date} style={styles.dateGroup}>
                    <Text style={styles.dateLabel}>{date}</Text>
                    {items.map((item) => {
                      const itemMood = getMoodById(item.moodId);
                      if (!itemMood) return null;
                      const itemAccent =
                        MOOD_ACCENTS[itemMood.id] || MOOD_ACCENTS.calm;
                      return (
                        <View key={item.id} style={styles.sessionItem}>
                          <View
                            style={[
                              styles.sessionDot,
                              { backgroundColor: itemAccent.accent },
                            ]}
                          />
                          <View style={styles.sessionInfo}>
                            <Text style={styles.sessionMood}>
                              {itemMood.label}
                            </Text>
                            <Text style={styles.sessionTime}>
                              {getRelativeTime(item.startTime)} ·{' '}
                              {formatDuration(item.duration)}
                            </Text>
                          </View>
                          <View style={styles.intensityBadge}>
                            <Text style={styles.intensityText}>
                              {Math.round(item.intensity * 100)}%
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                ))}
            </Animated.View>
          </>
        )}
      </ScrollView>

      {/* Mini Player */}
      {state.currentMood && (
        <MiniPlayer
          mood={state.currentMood}
          isPlaying={state.isPlaying}
          onTogglePlay={handleTogglePlay}
          onPress={() => navigation.navigate('Player')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  title: {
    color: COLORS.textPrimary,
    ...TYPE.h1,
  },
  subtitle: {
    color: COLORS.textMuted,
    ...TYPE.bodySm,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING['4xl'],
    gap: SPACING.md,
  },
  emptyTitle: {
    color: COLORS.textSecondary,
    ...TYPE.h3,
  },
  emptyText: {
    color: COLORS.textMuted,
    ...TYPE.body,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statNum: {
    color: COLORS.textPrimary,
    ...TYPE.h2,
  },
  statLabel: {
    color: COLORS.textMuted,
    ...TYPE.caption,
    letterSpacing: 0.8,
    marginTop: 4,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionLabel: {
    color: COLORS.textMuted,
    ...TYPE.label,
    marginBottom: SPACING.md,
  },
  chart: {
    gap: SPACING.sm,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  chartDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chartLabel: {
    color: COLORS.textSecondary,
    ...TYPE.bodySm,
    width: 70,
  },
  chartBarBg: {
    flex: 1,
    height: 20,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
  },
  chartBarFill: {
    height: '100%',
    borderRadius: RADIUS.sm,
    opacity: 0.5,
  },
  chartCount: {
    color: COLORS.textSecondary,
    ...TYPE.mono,
    width: 28,
    textAlign: 'right',
  },
  dateGroup: {
    marginBottom: SPACING.lg,
  },
  dateLabel: {
    color: COLORS.textMuted,
    ...TYPE.caption,
    marginBottom: SPACING.sm,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  sessionDot: {
    width: 6,
    height: 28,
    borderRadius: 3,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionMood: {
    color: COLORS.textPrimary,
    ...TYPE.body,
    fontWeight: '500',
  },
  sessionTime: {
    color: COLORS.textMuted,
    ...TYPE.caption,
    marginTop: 2,
  },
  intensityBadge: {
    backgroundColor: COLORS.bgSurface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  intensityText: {
    color: COLORS.textSecondary,
    ...TYPE.caption,
    fontWeight: '600',
  },
});
