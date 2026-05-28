import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOODS } from '../constants/moods';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import { useMood } from '../context/MoodContext';
import { useAudio } from '../context/AudioContext';
import MoodCard from '../components/MoodCard';
import MiniPlayer from '../components/MiniPlayer';

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useMood();
  const { loadMood, play, pause } = useAudio();

  const handleMoodSelect = useCallback(async (mood) => {
    dispatch({ type: 'SET_MOOD', payload: mood });
    try {
      await loadMood(mood.id, state.intensity);
    } catch (e) {
      console.warn('Audio playback unavailable:', e);
    }
    navigation.navigate('Player');
  }, [loadMood, state.intensity, dispatch, navigation]);

  const handleTogglePlay = useCallback(async () => {
    const wasPlaying = state.isPlaying;
    dispatch({ type: 'TOGGLE_PLAY' });
    try {
      if (wasPlaying) await pause();
      else await play();
    } catch (e) {
      console.warn('Audio toggle error:', e);
    }
  }, [state.isPlaying, dispatch, play, pause]);

  const greeting = getGreeting();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: state.currentMood ? 140 : 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.title}>How are you feeling?</Text>
          </View>
          <TouchableOpacity
            style={styles.timerButton}
            onPress={() => {
              if (state.currentMood) navigation.navigate('Player');
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="musical-notes-outline" size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Tagline */}
        <Text style={styles.tagline}>
          One tap. Right tone. Stay in flow.
        </Text>

        {/* Mood Grid */}
        <View style={styles.moodGrid}>
          {MOODS.map((mood) => (
            <MoodCard
              key={mood.id}
              mood={mood}
              onPress={handleMoodSelect}
              isActive={state.currentMood?.id === mood.id}
            />
          ))}
        </View>

        {/* Quick Stats */}
        {state.history.length > 0 && (
          <View style={styles.quickStats}>
            <Text style={styles.sectionTitle}>Your Flow</Text>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{state.history.length}</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {Math.round(
                    state.history.reduce((s, h) => s + (h.duration || 0), 0) / 60
                  )}m
                </Text>
                <Text style={styles.statLabel}>Total Time</Text>
              </View>
            </View>
          </View>
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

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Late night';
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  greeting: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.sm,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    marginTop: SPACING.xs,
  },
  timerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  tagline: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.xl,
    fontStyle: 'italic',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickStats: {
    marginTop: SPACING.xl,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 12,
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
  },
});
