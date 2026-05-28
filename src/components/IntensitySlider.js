import React, { useRef, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

export default function IntensitySlider({ value, onValueChange, accentColor }) {
  const labels = ['Gentle', 'Low', 'Medium', 'High', 'Intense'];
  const currentLabel = labels[Math.min(Math.floor(value * labels.length), labels.length - 1)];
  const trackWidth = useRef(0);

  const handleTouch = useCallback((e) => {
    const { locationX } = e.nativeEvent;
    const width = trackWidth.current || 1;
    const newValue = Math.max(0, Math.min(1, locationX / width));
    onValueChange(newValue);
  }, [onValueChange]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Intensity</Text>
        <Text style={[styles.value, { color: accentColor || COLORS.accent }]}>
          {currentLabel}
        </Text>
      </View>
      <View style={styles.trackContainer}>
        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              {
                width: `${value * 100}%`,
                backgroundColor: accentColor || COLORS.accent,
              },
            ]}
          />
          {/* Tick marks */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
            <View
              key={tick}
              style={[
                styles.tick,
                {
                  left: `${tick * 100}%`,
                  opacity: value >= tick ? 1 : 0.3,
                },
              ]}
            />
          ))}
        </View>
        {/* Touch area for sliding — measures own width dynamically */}
        <View
          style={styles.touchArea}
          onLayout={(e) => { trackWidth.current = e.nativeEvent.layout.width; }}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={handleTouch}
          onResponderMove={handleTouch}
          onResponderRelease={handleTouch}
        />
      </View>
      <View style={styles.labelsRow}>
        <Text style={styles.labelEnd}>Mellow</Text>
        <Text style={styles.labelEnd}>Intense</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  value: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  trackContainer: {
    position: 'relative',
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: 6,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 3,
    overflow: 'visible',
    position: 'relative',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  tick: {
    position: 'absolute',
    top: -3,
    width: 4,
    height: 12,
    backgroundColor: COLORS.textTertiary,
    borderRadius: 2,
    marginLeft: -2,
  },
  touchArea: {
    ...StyleSheet.absoluteFillObject,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  labelEnd: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
  },
});
