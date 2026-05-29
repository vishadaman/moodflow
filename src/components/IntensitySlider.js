// ─── IntensitySlider v2 ─────────────────────────────────────────────
// Sleek minimal slider with accent-adaptive fill
// Uses INTENSITY_LABELS from moods.js for state labels

import React, { useRef, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPE, RADIUS } from '../constants/theme';
import { INTENSITY_LABELS } from '../constants/moods';

export default function IntensitySlider({ value, onValueChange, accentColor }) {
  const accent = accentColor || COLORS.textSecondary;
  const labelIndex = Math.min(
    Math.floor(value * INTENSITY_LABELS.length),
    INTENSITY_LABELS.length - 1,
  );
  const currentLabel = INTENSITY_LABELS[labelIndex];
  const trackWidth = useRef(0);

  const handleTouch = useCallback(
    (e) => {
      const { locationX } = e.nativeEvent;
      const width = trackWidth.current || 1;
      const newValue = Math.max(0, Math.min(1, locationX / width));
      onValueChange(newValue);
    },
    [onValueChange],
  );

  return (
    <View style={styles.container}>
      {/* Header row */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>INTENSITY</Text>
        <Text style={[styles.headerValue, { color: accent }]}>{currentLabel}</Text>
      </View>

      {/* Track */}
      <View style={styles.trackContainer}>
        <View style={styles.track}>
          {/* Fill */}
          <View
            style={[
              styles.fill,
              { width: `${value * 100}%`, backgroundColor: accent },
            ]}
          />
          {/* Thumb */}
          <View
            style={[
              styles.thumb,
              {
                left: `${value * 100}%`,
                backgroundColor: accent,
                shadowColor: accent,
              },
            ]}
          />
        </View>
        {/* Touch target */}
        <View
          style={styles.touchArea}
          onLayout={(e) => {
            trackWidth.current = e.nativeEvent.layout.width;
          }}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={handleTouch}
          onResponderMove={handleTouch}
          onResponderRelease={handleTouch}
        />
      </View>

      {/* Scale labels */}
      <View style={styles.scaleRow}>
        {INTENSITY_LABELS.map((label, i) => (
          <View
            key={label}
            style={[
              styles.scaleDot,
              { backgroundColor: i <= labelIndex ? accent : COLORS.textGhost },
            ]}
          />
        ))}
      </View>
      <View style={styles.endLabels}>
        <Text style={styles.endLabel}>Gentle</Text>
        <Text style={styles.endLabel}>Intense</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerLabel: {
    color: COLORS.textMuted,
    ...TYPE.label,
  },
  headerValue: {
    ...TYPE.body,
    fontWeight: '600',
  },
  trackContainer: {
    position: 'relative',
    height: 44,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    backgroundColor: COLORS.bgCard,
    borderRadius: 2,
    position: 'relative',
    overflow: 'visible',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
    opacity: 0.8,
  },
  thumb: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: -8,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  touchArea: {
    ...StyleSheet.absoluteFillObject,
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xs,
    marginTop: SPACING.xs,
    gap: SPACING.xs,
  },
  scaleDot: {
    flex: 1,
    height: 2,
    borderRadius: 1,
  },
  endLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  endLabel: {
    color: COLORS.textMuted,
    ...TYPE.caption,
  },
});
