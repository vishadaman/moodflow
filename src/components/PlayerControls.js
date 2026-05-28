import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../constants/theme';
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

  return (
    <View style={styles.container}>
      {/* Now Playing Info */}
      <LinearGradient
        colors={[...mood.colors, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.nowPlaying}
      >
        <Text style={styles.emoji}>{mood.emoji}</Text>
        <View style={styles.info}>
          <Text style={styles.moodLabel}>{mood.label}</Text>
          <Text style={styles.genre}>{mood.genre}</Text>
        </View>
        {timerRemaining !== null && (
          <View style={styles.timer}>
            <Ionicons name="timer-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.timerText}>{formatTime(timerRemaining)}</Text>
          </View>
        )}
      </LinearGradient>

      {/* Visualizer bar (animated dots) */}
      <View style={styles.visualizer}>
        {Array.from({ length: 20 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.visualizerBar,
              {
                height: isPlaying
                  ? 4 + Math.random() * 20
                  : 4,
                backgroundColor: mood.accentColor || COLORS.accent,
                opacity: isPlaying ? 0.4 + Math.random() * 0.6 : 0.2,
              },
            ]}
          />
        ))}
      </View>

      {/* Control buttons */}
      {!focusLock ? (
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={onShiftMood}
            activeOpacity={0.7}
          >
            <Ionicons name="swap-horizontal" size={22} color={COLORS.textSecondary} />
            <Text style={styles.controlLabel}>Shift</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: mood.accentColor || COLORS.accent }]}
            onPress={onTogglePlay}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={32}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={onStop}
            activeOpacity={0.7}
          >
            <Ionicons name="stop-circle-outline" size={22} color={COLORS.textSecondary} />
            <Text style={styles.controlLabel}>End</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Focus Lock mode: only a stop button */
        <View style={styles.focusLockControls}>
          <TouchableOpacity
            style={[styles.focusStopButton, { borderColor: mood.accentColor }]}
            onPress={onStop}
            activeOpacity={0.7}
          >
            <Ionicons name="stop" size={28} color={mood.accentColor} />
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom row: Focus Lock toggle */}
      {!focusLock && (
        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={[styles.featureChip, focusLock && styles.featureChipActive]}
            onPress={onToggleFocusLock}
            activeOpacity={0.7}
          >
            <Ionicons
              name="lock-closed-outline"
              size={14}
              color={focusLock ? COLORS.textPrimary : COLORS.textTertiary}
            />
            <Text style={[styles.featureChipText, focusLock && styles.featureChipTextActive]}>
              Focus Lock
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.large,
  },
  nowPlaying: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  emoji: {
    fontSize: 42,
    marginRight: SPACING.md,
  },
  info: {
    flex: 1,
  },
  moodLabel: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
  },
  genre: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.overlayMedium,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  timerText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    marginLeft: 4,
    fontVariant: ['tabular-nums'],
  },
  visualizer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 28,
    paddingHorizontal: SPACING.lg,
    gap: 3,
  },
  visualizerBar: {
    width: 3,
    borderRadius: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    gap: SPACING.xl,
  },
  controlButton: {
    alignItems: 'center',
    gap: 4,
  },
  controlLabel: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
  },
  playButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  focusLockControls: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  focusStopButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.overlayLight,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.overlayLight,
  },
  featureChipActive: {
    backgroundColor: COLORS.accent,
  },
  featureChipText: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '500',
  },
  featureChipTextActive: {
    color: COLORS.textPrimary,
  },
});
