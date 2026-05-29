// ─── PlayerScreen v2 ────────────────────────────────────────────────
// Immersive full-screen mood space — cinematic orb, ambient gradient

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  COLORS,
  MOOD_ACCENTS,
  SPACING,
  TYPE,
  RADIUS,
  SHADOWS,
  TIMING,
} from '../constants/theme';
import { useMood } from '../context/MoodContext';
import { useAudio } from '../context/AudioContext';
import IntensitySlider from '../components/IntensitySlider';
import PlayerControls from '../components/PlayerControls';
import TimerPicker from '../components/TimerPicker';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ORB_SIZE = Math.min(SCREEN_WIDTH * 0.4, 180);

export default function PlayerScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useMood();
  const { loadMood, play, pause, stop } = useAudio();
  const [showTimer, setShowTimer] = useState(false);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(0.3)).current;

  // Breathing glow animation
  useEffect(() => {
    if (state.isPlaying) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.06,
            duration: TIMING.breathe,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: TIMING.breathe,
            useNativeDriver: true,
          }),
        ]),
      );
      const breathe = Animated.loop(
        Animated.sequence([
          Animated.timing(breatheAnim, {
            toValue: 0.6,
            duration: TIMING.breathe,
            useNativeDriver: true,
          }),
          Animated.timing(breatheAnim, {
            toValue: 0.3,
            duration: TIMING.breathe,
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      breathe.start();
      return () => {
        pulse.stop();
        breathe.stop();
      };
    } else {
      pulseAnim.setValue(1);
      breatheAnim.setValue(0.3);
    }
  }, [state.isPlaying, pulseAnim, breatheAnim]);

  // Slow rotation
  useEffect(() => {
    const rotation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 40000,
        useNativeDriver: true,
      }),
    );
    rotation.start();
    return () => rotation.stop();
  }, [rotateAnim]);

  const handleTogglePlay = useCallback(async () => {
    const wasPlaying = state.isPlaying;
    dispatch({ type: 'TOGGLE_PLAY' });
    try {
      if (wasPlaying) await pause();
      else await play();
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }, [state.isPlaying, dispatch, play, pause]);

  const handleStop = useCallback(async () => {
    try {
      await stop();
    } catch (e) {
      console.warn('Audio stop error:', e);
    }
    dispatch({ type: 'END_SESSION' });
    navigation.goBack();
  }, [stop, dispatch, navigation]);

  const handleShiftMood = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleIntensityChange = useCallback(
    async (value) => {
      dispatch({ type: 'SET_INTENSITY', payload: value });
      if (state.currentMood) {
        try {
          await loadMood(state.currentMood.id, value);
        } catch (e) {
          /* silent */
        }
      }
    },
    [state.currentMood, loadMood, dispatch],
  );

  const handleTimerSelect = useCallback(
    (minutes) => {
      dispatch({ type: 'SET_TIMER', payload: minutes });
    },
    [dispatch],
  );

  const handleToggleFocusLock = useCallback(() => {
    dispatch({ type: 'TOGGLE_FOCUS_LOCK' });
  }, [dispatch]);

  const mood = state.currentMood;

  // Empty state
  if (!mood) {
    return (
      <View style={[styles.emptyContainer, { paddingTop: insets.top }]}>
        <LinearGradient
          colors={[COLORS.bg, COLORS.bgElevated]}
          style={StyleSheet.absoluteFill}
        />
        <Ionicons name="musical-notes-outline" size={48} color={COLORS.textGhost} />
        <Text style={styles.emptyTitle}>No mood selected</Text>
        <Text style={styles.emptySubtitle}>Go back and tap a mood to begin</Text>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.goBackText}>Choose a Mood</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const accent = MOOD_ACCENTS[mood.id] || MOOD_ACCENTS.calm;
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Ambient background gradient */}
      <LinearGradient
        colors={accent.gradient}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      {!state.focusLock && (
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerBtn}
            activeOpacity={0.6}
          >
            <Ionicons name="chevron-down" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>NOW PLAYING</Text>
          <TouchableOpacity
            onPress={() => setShowTimer(true)}
            style={styles.headerBtn}
            activeOpacity={0.6}
          >
            <Ionicons
              name="timer-outline"
              size={20}
              color={state.timerDuration ? accent.accent : COLORS.textSecondary}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Orb area */}
      <View style={styles.orbContainer}>
        {/* Outer breathing ring */}
        <Animated.View
          style={[
            styles.orbRingOuter,
            {
              borderColor: accent.accent + '10',
              transform: [{ rotate: spin }, { scale: pulseAnim }],
            },
          ]}
        />
        {/* Middle ring */}
        <Animated.View
          style={[
            styles.orbRingMiddle,
            {
              borderColor: accent.accent + '18',
              transform: [{ rotate: spin }, { scale: pulseAnim }],
            },
          ]}
        />
        {/* Core orb */}
        <Animated.View
          style={[
            styles.orb,
            SHADOWS.glow(accent.accent),
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <LinearGradient
            colors={[accent.accent + '40', accent.accent + '15', accent.accent + '05']}
            start={{ x: 0.3, y: 0 }}
            end={{ x: 0.7, y: 1 }}
            style={styles.orbGradient}
          >
            {/* Accent core dot */}
            <Animated.View
              style={[
                styles.orbCore,
                {
                  backgroundColor: accent.accent,
                  opacity: breatheAnim,
                },
              ]}
            />
          </LinearGradient>
        </Animated.View>

        {/* Mood info */}
        <Text style={[styles.moodName, { color: accent.accent }]}>{mood.label}</Text>
        <Text style={styles.moodGenre}>{mood.genre}</Text>
        <Text style={styles.moodDescription}>{mood.description}</Text>
      </View>

      {/* Intensity */}
      {!state.focusLock && (
        <IntensitySlider
          value={state.intensity}
          onValueChange={handleIntensityChange}
          accentColor={accent.accent}
        />
      )}

      {/* Controls */}
      <PlayerControls
        mood={mood}
        isPlaying={state.isPlaying}
        onTogglePlay={handleTogglePlay}
        onStop={handleStop}
        onShiftMood={handleShiftMood}
        timerRemaining={state.timerRemaining}
        focusLock={state.focusLock}
        onToggleFocusLock={handleToggleFocusLock}
      />

      {/* Timer Picker */}
      <TimerPicker
        visible={showTimer}
        onClose={() => setShowTimer(false)}
        onSelect={handleTimerSelect}
        currentValue={state.timerDuration}
        accentColor={accent.accent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    ...TYPE.h2,
  },
  emptySubtitle: {
    color: COLORS.textMuted,
    ...TYPE.body,
  },
  goBackButton: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
  },
  goBackText: {
    color: COLORS.textPrimary,
    ...TYPE.body,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  headerBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: COLORS.textMuted,
    ...TYPE.label,
  },
  orbContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    flex: 1,
    justifyContent: 'center',
  },
  orbRingOuter: {
    position: 'absolute',
    width: ORB_SIZE + 80,
    height: ORB_SIZE + 80,
    borderRadius: (ORB_SIZE + 80) / 2,
    borderWidth: 1,
  },
  orbRingMiddle: {
    position: 'absolute',
    width: ORB_SIZE + 40,
    height: ORB_SIZE + 40,
    borderRadius: (ORB_SIZE + 40) / 2,
    borderWidth: 1,
  },
  orb: {
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
  },
  orbGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbCore: {
    width: ORB_SIZE * 0.25,
    height: ORB_SIZE * 0.25,
    borderRadius: ORB_SIZE * 0.125,
  },
  moodName: {
    ...TYPE.h1,
  },
  moodGenre: {
    color: COLORS.textSecondary,
    ...TYPE.bodySm,
    marginTop: SPACING.xs,
  },
  moodDescription: {
    color: COLORS.textMuted,
    ...TYPE.bodySm,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginHorizontal: SPACING['2xl'],
    lineHeight: 20,
  },
});
