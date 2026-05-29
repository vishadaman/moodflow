// ─── ProfileScreen v2 ───────────────────────────────────────────────
// Atmospheric profile with settings — clean, minimal, dark

import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING, TYPE, RADIUS, SHADOWS } from '../constants/theme';
import { useMood } from '../context/MoodContext';
import { useAudio } from '../context/AudioContext';
import { formatDuration, getTotalListeningTime, getStreak } from '../utils/helpers';
import MiniPlayer from '../components/MiniPlayer';

const SETTINGS_SECTIONS = [
  {
    title: 'PLAYBACK',
    items: [
      { icon: 'volume-high-outline', label: 'Audio Quality', value: 'High', id: 'quality' },
      { icon: 'cloud-download-outline', label: 'Offline Moods', value: '3 cached', id: 'offline' },
      { icon: 'repeat-outline', label: 'Auto-Loop', value: 'On', id: 'loop' },
      { icon: 'swap-horizontal-outline', label: 'Crossfade', value: '3s', id: 'crossfade' },
    ],
  },
  {
    title: 'PREFERENCES',
    items: [
      { icon: 'notifications-outline', label: 'Notifications', value: 'Off', id: 'notif' },
      { icon: 'moon-outline', label: 'Dark Mode', value: 'Always', id: 'darkmode' },
      { icon: 'hand-left-outline', label: 'Haptic Feedback', value: 'On', id: 'haptic' },
    ],
  },
  {
    title: 'ABOUT',
    items: [
      { icon: 'information-circle-outline', label: 'Version', value: '1.0.0', id: 'version' },
      { icon: 'document-text-outline', label: 'Privacy Policy', id: 'privacy' },
      { icon: 'help-circle-outline', label: 'Help & Feedback', id: 'help' },
    ],
  },
];

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useMood();
  const { play, pause } = useAudio();

  const stats = useMemo(
    () => ({
      totalSessions: state.history.length,
      totalTime: getTotalListeningTime(state.history),
      streak: getStreak(state.history),
    }),
    [state.history],
  );

  const handleClearHistory = useCallback(() => {
    if (Platform.OS === 'web') {
      if (confirm('Clear all mood history? This cannot be undone.')) {
        dispatch({ type: 'CLEAR_HISTORY' });
      }
    } else {
      Alert.alert(
        'Clear History',
        'Clear all mood history? This cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Clear',
            style: 'destructive',
            onPress: () => dispatch({ type: 'CLEAR_HISTORY' }),
          },
        ],
      );
    }
  }, [dispatch]);

  const handleTogglePlay = useCallback(async () => {
    const wasPlaying = state.isPlaying;
    dispatch({ type: 'TOGGLE_PLAY' });
    try {
      if (wasPlaying) await pause();
      else await play();
    } catch (e) {
      /* silent */
    }
  }, [state.isPlaying, dispatch, play, pause]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: state.currentMood ? 150 : 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.title}>Profile</Text>

        {/* User Card */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.userCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={28} color={COLORS.textSecondary} />
          </View>
          <Text style={styles.userName}>MoodFlow Listener</Text>
          <Text style={styles.userTagline}>Finding flow since 2026</Text>

          <View style={styles.profileStats}>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatNum}>{stats.totalSessions}</Text>
              <Text style={styles.profileStatLabel}>Sessions</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.profileStat}>
              <Text style={styles.profileStatNum}>
                {formatDuration(stats.totalTime)}
              </Text>
              <Text style={styles.profileStatLabel}>Listened</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.profileStat}>
              <Text style={styles.profileStatNum}>{stats.streak}</Text>
              <Text style={styles.profileStatLabel}>Streak</Text>
            </View>
          </View>
        </Animated.View>

        {/* Settings */}
        {SETTINGS_SECTIONS.map((section, si) => (
          <Animated.View
            key={section.title}
            entering={FadeInDown.delay(100 + si * 80).duration(400)}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.settingRow,
                    idx < section.items.length - 1 && styles.settingBorder,
                  ]}
                  activeOpacity={0.5}
                >
                  <Ionicons
                    name={item.icon}
                    size={18}
                    color={COLORS.textMuted}
                  />
                  <Text style={styles.settingLabel}>{item.label}</Text>
                  {item.value && (
                    <Text style={styles.settingValue}>{item.value}</Text>
                  )}
                  <Ionicons
                    name="chevron-forward"
                    size={14}
                    color={COLORS.textGhost}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        ))}

        {/* Danger zone */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearHistory}
            activeOpacity={0.6}
          >
            <Ionicons name="trash-outline" size={16} color={COLORS.error} />
            <Text style={styles.clearText}>Clear Mood History</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Mini Player */}
      {state.currentMood && (
        <MiniPlayer
          mood={state.currentMood}
          isPlaying={state.isPlaying}
          onTogglePlay={handleTogglePlay}
          onPress={() => navigation.navigate('Player')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  title: {
    color: COLORS.textPrimary,
    ...TYPE.h1,
    marginBottom: SPACING.lg,
  },
  userCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
    marginBottom: SPACING.md,
  },
  userName: {
    color: COLORS.textPrimary,
    ...TYPE.h3,
  },
  userTagline: {
    color: COLORS.textMuted,
    ...TYPE.bodySm,
    marginTop: 4,
  },
  profileStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    width: '100%',
  },
  profileStat: {
    flex: 1,
    alignItems: 'center',
  },
  profileStatNum: {
    color: COLORS.textPrimary,
    ...TYPE.h3,
  },
  profileStatLabel: {
    color: COLORS.textMuted,
    ...TYPE.caption,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.textMuted,
    ...TYPE.label,
    marginBottom: SPACING.sm,
  },
  sectionCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  settingBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLabel: {
    flex: 1,
    color: COLORS.textPrimary,
    ...TYPE.body,
  },
  settingValue: {
    color: COLORS.textMuted,
    ...TYPE.bodySm,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.errorBg,
    borderWidth: 1,
    borderColor: 'rgba(229, 72, 77, 0.15)',
  },
  clearText: {
    color: COLORS.error,
    ...TYPE.body,
    fontWeight: '500',
  },
});
