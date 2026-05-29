// ─── MoodCard v2 ────────────────────────────────────────────────────
// Atmospheric floating card — no emojis, no loud gradients
// Communicates mood through typography + subtle accent glow

import React, { useCallback } from 'react';
import { Text, StyleSheet, View, Pressable, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, MOOD_ACCENTS, SPACING, TYPE, RADIUS, SHADOWS } from '../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function MoodCard({ mood, onPress, isActive, index = 0 }) {
  const accent = MOOD_ACCENTS[mood.id] || MOOD_ACCENTS.calm;

  const handlePress = useCallback(() => {
    onPress(mood);
  }, [mood, onPress]);

  return (
    <AnimatedPressable
      onPress={handlePress}
      entering={FadeInDown.delay(index * 60).duration(400).springify().damping(18)}
      style={({ pressed }) => [
        styles.container,
        isActive && { borderColor: accent.accent + '60' },
        isActive && SHADOWS.glow(accent.accent),
        pressed && styles.pressed,
      ]}
    >
      {/* Subtle accent glow at top */}
      <View style={[styles.glowLine, { backgroundColor: accent.accent }]} />

      {/* Content */}
      <View style={styles.body}>
        <Text style={[styles.label, isActive && { color: accent.accent }]}>
          {mood.label}
        </Text>
        <Text style={styles.subtitle}>{mood.subtitle}</Text>
        <Text style={styles.genre} numberOfLines={1}>{mood.genre}</Text>
      </View>

      {/* Active indicator */}
      {isActive && (
        <View style={styles.activeRow}>
          <View style={[styles.activeDot, { backgroundColor: accent.accent }]} />
          <Text style={[styles.activeLabel, { color: accent.accent }]}>Playing</Text>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '47%',
    marginBottom: SPACING.md,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.soft,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  glowLine: {
    height: 2,
    opacity: 0.4,
  },
  body: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    minHeight: 100,
    justifyContent: 'center',
  },
  label: {
    color: COLORS.textPrimary,
    ...TYPE.h3,
    marginBottom: 2,
  },
  subtitle: {
    color: COLORS.textSecondary,
    ...TYPE.bodySm,
    marginBottom: SPACING.sm,
  },
  genre: {
    color: COLORS.textMuted,
    ...TYPE.caption,
  },
  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    gap: 6,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activeLabel: {
    ...TYPE.caption,
    letterSpacing: 0.8,
  },
});
