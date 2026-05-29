// ─── MiniPlayer v2 ──────────────────────────────────────────────────
// Glassmorphic floating bar with accent-adaptive glow
// Sits above the tab bar — minimal, atmospheric

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, MOOD_ACCENTS, SPACING, TYPE, RADIUS, SHADOWS } from '../constants/theme';

export default function MiniPlayer({ mood, isPlaying, onTogglePlay, onPress }) {
  if (!mood) return null;

  const accent = MOOD_ACCENTS[mood.id] || MOOD_ACCENTS.calm;

  const content = (
    <>
      {/* Accent dot */}
      <View style={[styles.dot, { backgroundColor: accent.accent }]} />

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.label} numberOfLines={1}>
          {mood.label}
        </Text>
        <Text style={styles.genre} numberOfLines={1}>
          {mood.genre}
        </Text>
      </View>

      {/* Mini visualizer */}
      <View style={styles.miniViz}>
        {[...Array(5)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.vizBar,
              {
                height: isPlaying ? 4 + Math.random() * 12 : 3,
                backgroundColor: accent.accent,
                opacity: isPlaying ? 0.5 + Math.random() * 0.5 : 0.2,
              },
            ]}
          />
        ))}
      </View>

      {/* Play/Pause */}
      <TouchableOpacity
        style={[styles.playBtn, { backgroundColor: accent.accent + '30' }]}
        onPress={(e) => {
          e.stopPropagation();
          onTogglePlay();
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        activeOpacity={0.6}
      >
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={18}
          color={accent.accent}
        />
      </TouchableOpacity>
    </>
  );

  return (
    <TouchableOpacity
      style={[styles.container, SHADOWS.glow(accent.accent)]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {Platform.OS === 'web' ? (
        <View style={[styles.inner, styles.webFallback]}>{content}</View>
      ) : (
        <BlurView intensity={60} tint="dark" style={styles.inner}>
          {content}
        </BlurView>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: SPACING.md,
    right: SPACING.md,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
  },
  webFallback: {
    backgroundColor: 'rgba(11, 11, 12, 0.92)',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  info: {
    flex: 1,
  },
  label: {
    color: COLORS.textPrimary,
    ...TYPE.body,
    fontWeight: '500',
  },
  genre: {
    color: COLORS.textMuted,
    ...TYPE.caption,
    marginTop: 1,
  },
  miniViz: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    marginRight: SPACING.md,
    height: 18,
  },
  vizBar: {
    width: 2.5,
    borderRadius: 1.5,
  },
  playBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
