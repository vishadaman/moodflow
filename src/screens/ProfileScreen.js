import React, { useMemo } from 'react';
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
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { useMood } from '../context/MoodContext';
import { getMoodById } from '../constants/moods';
import { formatDuration, getTotalListeningTime, getStreak } from '../utils/helpers';
import MiniPlayer from '../components/MiniPlayer';

const SETTINGS_SECTIONS = [
  {
    title: 'Playback',
    items: [
      { icon: 'volume-high-outline', label: 'Audio Quality', value: 'High (256kbps)', id: 'quality' },
      { icon: 'cloud-download-outline', label: 'Offline Moods', value: '3 of 5 cached', id: 'offline' },
      { icon: 'repeat-outline', label: 'Auto-Loop', value: 'On', id: 'loop' },
      { icon: 'swap-horizontal-outline', label: 'Crossfade', value: '3 seconds', id: 'crossfade' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: 'notifications-outline', label: 'Notifications', value: 'Off', id: 'notif' },
      { icon: 'moon-outline', label: 'Dark Mode', value: 'Always', id: 'darkmode' },
      { icon: 'hand-left-outline', label: 'Haptic Feedback', value: 'On', id: 'haptic' },
    ],
  },
  {
    title: 'About',
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

  const stats = useMemo(() => ({
    totalSessions: state.history.length,
    totalTime: getTotalListeningTime(state.history),
    streak: getStreak(state.history),
  }), [state.history]);

  const handleClearHistory = () => {
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
        ]
      );
    }
  };

  const { play, pause } = require('../context/AudioContext').useAudio();

  const handleTogglePlay = async () => {
    const wasPlaying = state.isPlaying;
    dispatch({ type: 'TOGGLE_PLAY' });
    try {
      if (wasPlaying) await pause();
      else await play();
    } catch (e) { /* silent */ }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: state.currentMood ? 140 : 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.title}>Profile</Text>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color={COLORS.accent} />
            </View>
          </View>
          <Text style={styles.userName}>MoodFlow Listener</Text>
          <Text style={styles.userTagline}>Finding flow since 2026</Text>

          {/* Quick stats */}
          <View style={styles.profileStats}>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatNum}>{stats.totalSessions}</Text>
              <Text style={styles.profileStatLabel}>Sessions</Text>
            </View>
            <View style={styles.profileStatDivider} />
            <View style={styles.profileStat}>
              <Text style={styles.profileStatNum}>{formatDuration(stats.totalTime)}</Text>
              <Text style={styles.profileStatLabel}>Listened</Text>
            </View>
            <View style={styles.profileStatDivider} />
            <View style={styles.profileStat}>
              <Text style={styles.profileStatNum}>{stats.streak}</Text>
              <Text style={styles.profileStatLabel}>Day Streak</Text>
            </View>
          </View>
        </View>

        {/* Settings Sections */}
        {SETTINGS_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.settingItem,
                    idx < section.items.length - 1 && styles.settingItemBorder,
                  ]}
                  activeOpacity={0.6}
                >
                  <Ionicons name={item.icon} size={20} color={COLORS.textSecondary} />
                  <Text style={styles.settingLabel}>{item.label}</Text>
                  {item.value && (
                    <Text style={styles.settingValue}>{item.value}</Text>
                  )}
                  <Ionicons name="chevron-forward" size={16} color={COLORS.textTertiary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Danger Zone */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearHistory}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={18} color={COLORS.error} />
            <Text style={styles.clearButtonText}>Clear Mood History</Text>
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
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    marginBottom: SPACING.lg,
  },
  userCard: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatarContainer: {
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.overlayMedium,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  userName: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
  },
  userTagline: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.sm,
    marginTop: 4,
  },
  profileStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.overlayMedium,
    width: '100%',
  },
  profileStat: {
    flex: 1,
    alignItems: 'center',
  },
  profileStatNum: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  profileStatLabel: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  profileStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.overlayMedium,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  sectionCard: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.overlayLight,
  },
  settingLabel: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
  },
  settingValue: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.sm,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.2)',
  },
  clearButtonText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
  },
});
