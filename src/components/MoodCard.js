import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../constants/theme';

export default function MoodCard({ mood, onPress, isActive, size = 'normal' }) {
  const isSmall = size === 'small';

  return (
    <TouchableOpacity
      onPress={() => onPress(mood)}
      activeOpacity={0.7}
      style={[
        styles.container,
        isSmall && styles.containerSmall,
        isActive && styles.containerActive,
      ]}
    >
      <LinearGradient
        colors={mood.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, isSmall && styles.gradientSmall]}
      >
        {isActive && (
          <View style={styles.activeIndicator}>
            <View style={styles.activeDot} />
          </View>
        )}
        <Text style={[styles.emoji, isSmall && styles.emojiSmall]}>
          {mood.emoji}
        </Text>
        <Text style={[styles.label, isSmall && styles.labelSmall]}>
          {mood.label}
        </Text>
        {!isSmall && (
          <Text style={styles.subtitle}>{mood.subtitle}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '47%',
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  containerSmall: {
    width: 100,
    marginBottom: 0,
    marginRight: SPACING.sm,
  },
  containerActive: {
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  gradient: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 130,
  },
  gradientSmall: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    minHeight: 90,
  },
  activeIndicator: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#38ef7d',
  },
  emoji: {
    fontSize: 36,
    marginBottom: SPACING.sm,
  },
  emojiSmall: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  labelSmall: {
    fontSize: FONT_SIZE.sm,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
});
