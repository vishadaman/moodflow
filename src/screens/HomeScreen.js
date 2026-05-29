// ─── HomeScreen v2 ──────────────────────────────────────────────────
// Cinematic mood selection — large quiet heading, atmospheric card grid

import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOODS } from '../constants/moods';
import { COLORS, SPACING, TYPE, RADIUS, MOOD_ACCENTS } from '../constants/theme';
import { useMood } from '../context/MoodContext';
import { useAudio } from '../context/AudioContext';
import MoodCard from '../components/MoodCard';
import MiniPlayer from '../components/MiniPlayer';

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useMood();
  const { loadMood, play, pause } = useAudio();

  const handleMoodSelect = useCallback(
    async (mood) => {
      dispatch({ type: 'SET_MOOD', payload: mood });
      try {
        await loadMood(mood.id, state.intensity);
      } catch (e) {
        console.warn('Audio playback unavailable:', e);
      }
      navigation.navigate('Player');
    },
    [loadMood, state.intensity, dispatch, navigation],
  );

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
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: state.currentMood ? 150 : 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero heading */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.hero}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.title}>How are you{'\n'}feeling?</Text>
        </Animated.View>

        {/* Mood description */}
        <Animated.Text
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.tagline}
        >
          Choose a mood. We handle the rest.
        </Animated.Text>

        {/* Mood Grid */}
        <View style={styles.moodGrid}>
          {MOODS.map((mood, i) => (
            <MoodCard
              key={mood.id}
              mood={mood}
              onPress={handleMoodSelect}
              isActive={state.currentMood?.id === mood.id}
              index={i}
            />
          ))}
        </View>

        {/* Quick stats */}
        {state.history.length > 0 && (
          <Animated.View
            entering={FadeInDown.delay(400).duration(500)}
            style={styles.statsSection}
          >
            <Text style={styles.sectionLabel}>YOUR FLOW</Text>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNum}>{state.history.length}</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNum}>
                  {Math.round(
                    state.history.reduce((s, h) => s + (h.duration || 0), 0) / 60,
                  )}m
                </Text>
                <Text style={styles.statLabel}>Total Time</Text>
              </View>
            </View>
          </Animated.View>
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
    backgroundColor: COLORS.bg,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  hero: {
    marginBottom: SPACING.sm,
  },
  greeting: {
    color: COLORS.textMuted,
    ...TYPE.label,
    marginBottom: SPACING.sm,
  },
  title: {
    color: COLORS.textPrimary,
    ...TYPE.hero,
  },
  tagline: {
    color: COLORS.textMuted,
    ...TYPE.body,
    marginBottom: SPACING.xl,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statsSection: {
    marginTop: SPACING.xl,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  sectionLabel: {
    color: COLORS.textMuted,
    ...TYPE.label,
    marginBottom: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
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
    marginTop: 4,
  },
});
