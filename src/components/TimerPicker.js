// ─── TimerPicker v2 ─────────────────────────────────────────────────
// Atmospheric bottom sheet with blur backdrop

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPE, RADIUS } from '../constants/theme';

const TIMER_OPTIONS = [
  { label: 'No Timer', value: null, icon: 'infinite-outline' },
  { label: '15 min', value: 15, icon: 'timer-outline' },
  { label: '25 min', value: 25, icon: 'timer-outline' },
  { label: '45 min', value: 45, icon: 'timer-outline' },
  { label: '60 min', value: 60, icon: 'timer-outline' },
  { label: '90 min', value: 90, icon: 'timer-outline' },
  { label: '2 hours', value: 120, icon: 'timer-outline' },
];

export default function TimerPicker({ visible, onClose, onSelect, currentValue, accentColor }) {
  const accent = accentColor || COLORS.textSecondary;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <Text style={styles.title}>Session Timer</Text>
          <Text style={styles.subtitle}>Auto-fade when time runs out</Text>

          {/* Options */}
          <View style={styles.options}>
            {TIMER_OPTIONS.map((option) => {
              const isSelected = currentValue === option.value;
              return (
                <TouchableOpacity
                  key={String(option.value)}
                  style={[
                    styles.option,
                    isSelected && [styles.optionActive, { borderColor: accent + '40' }],
                  ]}
                  onPress={() => {
                    onSelect(option.value);
                    onClose();
                  }}
                  activeOpacity={0.6}
                >
                  <Ionicons
                    name={option.icon}
                    size={18}
                    color={isSelected ? accent : COLORS.textMuted}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && { color: COLORS.textPrimary },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark" size={16} color={accent} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.bgElevated,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING['3xl'],
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: COLORS.borderLight,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: COLORS.textGhost,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    color: COLORS.textPrimary,
    ...TYPE.h2,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textMuted,
    ...TYPE.bodySm,
    textAlign: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  options: {
    gap: SPACING.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgSurface,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  optionActive: {
    backgroundColor: COLORS.bgCard,
  },
  optionText: {
    color: COLORS.textSecondary,
    ...TYPE.body,
    flex: 1,
  },
});
