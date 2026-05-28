import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../constants/theme';

export default function MiniPlayer({ mood, isPlaying, onTogglePlay, onPress }) {
  if (!mood) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={mood.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Text style={styles.emoji}>{mood.emoji}</Text>
        <View style={styles.info}>
          <Text style={styles.label} numberOfLines={1}>{mood.label}</Text>
          <Text style={styles.genre} numberOfLines={1}>{mood.genre}</Text>
        </View>

        {/* Mini visualizer */}
        <View style={styles.miniViz}>
          {[...Array(4)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.vizBar,
                {
                  height: isPlaying ? 6 + Math.random() * 12 : 4,
                  backgroundColor: '#fff',
                  opacity: isPlaying ? 0.7 : 0.3,
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.playBtn}
          onPress={(e) => {
            e.stopPropagation();
            onTogglePlay();
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={22}
            color="#fff"
          />
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: SPACING.md,
    right: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.large,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  emoji: {
    fontSize: 28,
    marginRight: SPACING.sm,
  },
  info: {
    flex: 1,
  },
  label: {
    color: '#fff',
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  genre: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FONT_SIZE.xs,
    marginTop: 1,
  },
  miniViz: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    marginRight: SPACING.md,
    height: 20,
  },
  vizBar: {
    width: 3,
    borderRadius: 1.5,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
