// ─── PlayerControls v2 ──────────────────────────────────────────────
// Minimal, atmospheric player controls with accent glow

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, MOOD_ACCENTS, SPACING, TYPE, RADIUS, SHADOWS } from '../constants/theme';
import { formatTime } from '../utils/helpers';

export default function PlayerControls({
  mood,
  isPlaying,
  onTogglePlay,
  onStop,
  onShiftMood,
  timerRemaining,
  focusLock,
  onToggleFocusLock,
}) {
  if (!mood) return null;

  const accent = MOOD_ACCENTS[mood.id] || MOOD_ACCENTS.calm;

  return (
    <View style={styles.container}>
      {/* Now Playing strip */}
      <View style={styles.nowPlaying}>
        <View style={[styles.moodDot, { backgroundColor: accent.accent }]} />
        <View style={styles.info}>
          <Text style={styles.moodLabel}>{mood.label}</Text>
          <Text style={styles.genre}>{mood.genre}</Text>
        </View>
        {timerRemaining !== null && (
          <View style={styles.timer}>
            <Ionicons name="timer-outline" size={13} color={accent.accent} />
            <Text style={[styles.timerText, { color: accent.accent }]}>
              {formatTime(timerRemaining)}
            </Text>
          </View>
        )}
      </View>

      {/* Visualizer */}
      <View style={styles.visualizer}>
        {Array.from({ length: 24 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.vizBar,
              {
                height: isPlaying ? 3 + Math.random() * 18 : 3,
                backgroundColor: accent.accent,
                opacity: isPlaying ? 0.25 + Math.random() * 0.5 : 0.08,
              },
            ]}
          />
        ))}
      </View>

      {/* Controls */}
      {!focusLock ? (
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={onShiftMood}
            activeOpacity={0.6}
          >
            <Ionicons name="swap-horizontal" size={20} color={COLORS.textSecondary} />
            <Text style={styles.secondaryLabel}>Shift</Text>
          </TouchableOpacity>

          <Pressable
            onPress={onTogglePlay}
            style={({ pressed }) => [
              styles.playButton,
              { backgroundColor: accent.accent },
              SHADOWS.glow(accent.accent),
              pressed && { opacity: 0.85, transform: [{ scale: 0.95 }] },
            ]}
          >
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color="#fff" />
          </Pressable>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={onStop}
            activeOpacity={0.6}
          >
            <Ionicons name="stop-circle-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.secondaryLabel}>End</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.focusControls}>
          <TouchableOpacity
            style={[styles.focusStopBtn, { borderColor: accent.accent + '40' }]}
            onPress={onStop}
            activeOpacity={0.6}
          >
            <Ionicons name="stop" size={24} color={accent.accent} />
          </TouchableOpacity>
        </View>
      )}

      {/* Focus Lock chip */}
      {!focusLock && (
        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.chip}
            onPress={onToggleFocusLock}
            activeOpacity={0.6}
          >
            <Ionicons name="lock-closed-outline" size={13} color={COLORS.textMuted} />
            <Text style={styles.chipText}>Focus Lock</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.soft,
  },
  nowPlaying: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  moodDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.md,
  },
  info: {
    flex: 1,
  },
  moodLabel: {
    color: COLORS.textPrimary,
    ...TYPE.h3,
  },
  genre: {
    color: COLORS.textMuted,
    ...TYPE.bodySm,
    marginTop: 2,
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgSurface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    gap: 4,
  },
  timerText: {
    ...TYPE.mono,
  },
  visualizer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 24,
    paddingHorizontal: SPACING.lg,
    gap: 2,
  },
  vizBar: {
    width: 2,
    borderRadius: 1,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    gap: SPACING['2xl'],
  },
  secondaryBtn: {
    alignItems: 'center',
    gap: 4,
  },
  secondaryLabel: {
    color: COLORS.textMuted,
    ...TYPE.caption,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusControls: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  focusStopBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bgSurface,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: SPACING.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bgSurface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipText: {
    color: COLORS.textMuted,
    ...TYPE.caption,
  },
});
