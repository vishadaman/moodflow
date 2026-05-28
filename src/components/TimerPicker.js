import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

const TIMER_OPTIONS = [
  { label: 'No Timer', value: null, icon: 'infinite-outline' },
  { label: '15 min', value: 15, icon: 'timer-outline' },
  { label: '25 min', value: 25, icon: 'timer-outline' },
  { label: '45 min', value: 45, icon: 'timer-outline' },
  { label: '60 min', value: 60, icon: 'timer-outline' },
  { label: '90 min', value: 90, icon: 'timer-outline' },
  { label: '2 hours', value: 120, icon: 'timer-outline' },
];

export default function TimerPicker({ visible, onClose, onSelect, currentValue }) {
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
          <View style={styles.handle} />
          <Text style={styles.title}>Mood Timer</Text>
          <Text style={styles.subtitle}>
            Auto-fade at session end
          </Text>

          <View style={styles.options}>
            {TIMER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={String(option.value)}
                style={[
                  styles.option,
                  currentValue === option.value && styles.optionActive,
                ]}
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={option.icon}
                  size={20}
                  color={
                    currentValue === option.value
                      ? COLORS.accent
                      : COLORS.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.optionText,
                    currentValue === option.value && styles.optionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
                {currentValue === option.value && (
                  <Ionicons name="checkmark" size={18} color={COLORS.accent} />
                )}
              </TouchableOpacity>
            ))}
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
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.textTertiary,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.sm,
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
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.overlayLight,
    gap: SPACING.md,
  },
  optionActive: {
    backgroundColor: 'rgba(124, 77, 255, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  optionText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    flex: 1,
  },
  optionTextActive: {
    color: COLORS.textPrimary,
  },
});
