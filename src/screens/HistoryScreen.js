import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { useMood } from '../context/MoodContext';
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

  const mostUsedMood = stats.mostUsedMoodId ? getMoodById(stats.mostUsedMoodId) : null;

  // Mood distribution for bar chart
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

  const { play, pause } = require('../context/AudioContext').useAudio();

  const handleTogglePlay = async () => {
    const wasPlaying = state.isPlaying;
    dispatch({ type: 'TOGGLE_PLAY' });
    try {
      if (wasPlaying) await pause();
      else await play();
    } catch (e) { /* silent */ }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: state.currentMood ? 140 : 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.title}>Mood History</Text>
        <Text style={styles.subtitle}>Your listening patterns</Text>

        {state.history.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="analytics-outline" size={48} color={COLORS.textTertiary} />
            <Text style={styles.emptyTitle}>No sessions yet</Text>
            <Text style={styles.emptyText}>
              Start a mood session to see your listening patterns here
            </Text>
          </View>
        ) : (
          <>
            {/* Stats Overview */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.totalSessions}</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {formatDuration(stats.totalTime)}
                </Text>
                <Text style={styles.statLabel}>Total Time</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.streak}🔥</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
              {mostUsedMood && (
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{mostUsedMood.emoji}</Text>
                  <Text style={styles.statLabel}>Top Mood</Text>
                </View>
              )}
            </View>

            {/* Mood Distribution */}
            {moodDistribution.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mood Distribution</Text>
                <View style={styles.distributionChart}>
                  {moodDistribution.map((item) => (
                    <View key={item.mood.id} style={styles.distributionRow}>
                      <Text style={styles.distributionEmoji}>{item.mood.emoji}</Text>
                      <View style={styles.distributionBarBg}>
                        <LinearGradient
                          colors={item.mood.colors}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={[
                            styles.distributionBarFill,
                            { width: `${Math.max(item.ratio * 100, 8)}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.distributionCount}>{item.count}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Recent Sessions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Sessions</Text>
              {Object.entries(stats.grouped)
                .slice(0, 7)
                .map(([date, items]) => (
                  <View key={date} style={styles.dateGroup}>
                    <Text style={styles.dateLabel}>{date}</Text>
                    {items.map((item) => {
                      const mood = getMoodById(item.moodId);
                      if (!mood) return null;
                      return (
                        <View key={item.id} style={styles.sessionItem}>
                          <LinearGradient
                            colors={mood.colors}
                            style={styles.sessionDot}
                          />
                          <View style={styles.sessionInfo}>
                            <Text style={styles.sessionMood}>
                              {mood.emoji} {mood.label}
                            </Text>
                            <Text style={styles.sessionTime}>
                              {getRelativeTime(item.startTime)} · {formatDuration(item.duration)}
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
            </View>
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
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
  },
  subtitle: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
    gap: SPACING.md,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  },
  emptyText: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.md,
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
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  statNumber: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
  },
  statLabel: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  distributionChart: {
    gap: SPACING.sm,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  distributionEmoji: {
    fontSize: 18,
    width: 28,
    textAlign: 'center',
  },
  distributionBarBg: {
    flex: 1,
    height: 24,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  distributionBarFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.sm,
    opacity: 0.8,
  },
  distributionCount: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    width: 28,
    textAlign: 'right',
  },
  dateGroup: {
    marginBottom: SPACING.lg,
  },
  dateLabel: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginBottom: SPACING.sm,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  sessionDot: {
    width: 8,
    height: 32,
    borderRadius: 4,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionMood: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  sessionTime: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  intensityBadge: {
    backgroundColor: COLORS.overlayMedium,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  intensityText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
});
