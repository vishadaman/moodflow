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
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { useMood } from '../context/MoodContext';
import { useAudio } from '../context/AudioContext';
import IntensitySlider from '../components/IntensitySlider';
import PlayerControls from '../components/PlayerControls';
import TimerPicker from '../components/TimerPicker';

export default function PlayerScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useMood();
  const { loadMood, play, pause, stop } = useAudio();
  const [showTimer, setShowTimer] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Pulsing animation for the mood orb
  useEffect(() => {
    if (state.isPlaying) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [state.isPlaying]);

  // Slow rotation for the background rings
  useEffect(() => {
    const rotation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 30000,
        useNativeDriver: true,
      })
    );
    rotation.start();
    return () => rotation.stop();
  }, []);

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
    try { await stop(); } catch (e) { console.warn('Audio stop error:', e); }
    dispatch({ type: 'END_SESSION' });
    navigation.goBack();
  }, [stop, dispatch, navigation]);

  const handleShiftMood = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleIntensityChange = useCallback(async (value) => {
    dispatch({ type: 'SET_INTENSITY', payload: value });
    if (state.currentMood) {
      try { await loadMood(state.currentMood.id, value); } catch (e) { /* silent */ }
    }
  }, [state.currentMood, loadMood, dispatch]);

  const handleTimerSelect = useCallback((minutes) => {
    dispatch({ type: 'SET_TIMER', payload: minutes });
  }, [dispatch]);

  const handleToggleFocusLock = useCallback(() => {
    dispatch({ type: 'TOGGLE_FOCUS_LOCK' });
  }, [dispatch]);

  const mood = state.currentMood;

  if (!mood) {
    return (
      <View style={[styles.emptyContainer, { paddingTop: insets.top }]}>
        <LinearGradient
          colors={[COLORS.background, COLORS.surface]}
          style={StyleSheet.absoluteFill}
        />
        <Ionicons name="musical-notes-outline" size={64} color={COLORS.textTertiary} />
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

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={[mood.colors[0], COLORS.background, COLORS.background]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      {!state.focusLock && (
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-down" size={28} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Now Playing</Text>
          <TouchableOpacity
            onPress={() => setShowTimer(true)}
            style={styles.timerBtn}
            activeOpacity={0.7}
          >
            <Ionicons
              name="timer-outline"
              size={22}
              color={state.timerDuration ? COLORS.accent : COLORS.textSecondary}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Mood Orb */}
      <View style={styles.orbContainer}>
        <Animated.View
          style={[
            styles.orbRingOuter,
            {
              borderColor: mood.accentColor + '15',
              transform: [{ rotate: spin }, { scale: pulseAnim }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.orbRingMiddle,
            {
              borderColor: mood.accentColor + '25',
              transform: [{ rotate: spin }, { scale: pulseAnim }],
            },
          ]}
        />
        <Animated.View style={[styles.orb, { transform: [{ scale: pulseAnim }] }]}>
          <LinearGradient
            colors={mood.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.orbGradient}
          >
            <Text style={styles.orbEmoji}>{mood.emoji}</Text>
          </LinearGradient>
        </Animated.View>

        <Text style={styles.moodName}>{mood.label}</Text>
        <Text style={styles.moodGenre}>{mood.genre}</Text>
        <Text style={styles.moodDescription}>{mood.description}</Text>
      </View>

      {/* Intensity Slider */}
      {!state.focusLock && (
        <IntensitySlider
          value={state.intensity}
          onValueChange={handleIntensityChange}
          accentColor={mood.accentColor}
        />
      )}

      {/* Player Controls */}
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.md,
  },
  goBackButton: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.round,
  },
  goBackText: {
    color: '#fff',
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  timerBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    flex: 1,
    justifyContent: 'center',
  },
  orbRingOuter: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
  },
  orbRingMiddle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
  },
  orb: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  orbGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbEmoji: {
    fontSize: 64,
  },
  moodName: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
  },
  moodGenre: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.xs,
  },
  moodDescription: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginHorizontal: SPACING.xl,
    lineHeight: 20,
  },
});
