// ─── MoodFlow Design System v2 ──────────────────────────────────────
// Emotional direction: healing through music · digital calm · ambient intelligence
// Visual language: cinematic · immersive · deeply minimal · atmospheric

export const COLORS = {
  // Backgrounds — true black with subtle warmth
  bg: '#050505',
  bgElevated: '#0B0B0C',
  bgSurface: '#111111',
  bgCard: '#161616',
  bgCardHover: '#1A1A1A',

  // Text — warm whites, never pure #fff
  textPrimary: '#E8E4DF',
  textSecondary: '#8A8A8E',
  textMuted: '#4A4A50',
  textGhost: '#2A2A30',

  // Borders & dividers
  border: 'rgba(255, 255, 255, 0.04)',
  borderLight: 'rgba(255, 255, 255, 0.06)',
  borderAccent: 'rgba(255, 255, 255, 0.08)',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(255, 255, 255, 0.03)',
  overlayMedium: 'rgba(255, 255, 255, 0.05)',
  blur: 'rgba(5, 5, 5, 0.85)',

  // Semantic
  error: '#E5484D',
  errorBg: 'rgba(229, 72, 77, 0.08)',
};

// ─── Mood-Adaptive Accent System ────────────────────────────────────
// Each mood has a carefully tuned accent that feels muted and atmospheric
export const MOOD_ACCENTS = {
  sad:       { accent: '#6366A0', glow: 'rgba(99, 102, 160, 0.15)', gradient: ['#0a0a1a', '#0f0f2a', '#0a0a1a'] },
  happy:     { accent: '#C9A96E', glow: 'rgba(201, 169, 110, 0.12)', gradient: ['#0f0d08', '#1a1508', '#0f0d08'] },
  energetic: { accent: '#C87941', glow: 'rgba(200, 121, 65, 0.12)',  gradient: ['#0f0a06', '#1a0f06', '#0f0a06'] },
  ecstatic:  { accent: '#B07CC0', glow: 'rgba(176, 124, 192, 0.12)', gradient: ['#0d080f', '#15081a', '#0d080f'] },
  hyped:     { accent: '#C06060', glow: 'rgba(192, 96, 96, 0.12)',   gradient: ['#0f0808', '#1a0a0a', '#0f0808'] },
  motivated: { accent: '#5EA07A', glow: 'rgba(94, 160, 122, 0.12)',  gradient: ['#080f0a', '#081a0f', '#080f0a'] },
  focus:     { accent: '#6B7FBF', glow: 'rgba(107, 127, 191, 0.15)', gradient: ['#08081a', '#0a0a2a', '#08081a'] },
  study:     { accent: '#7BA3C4', glow: 'rgba(123, 163, 196, 0.10)', gradient: ['#080c10', '#0a1018', '#080c10'] },
  calm:      { accent: '#5AAF96', glow: 'rgba(90, 175, 150, 0.10)',  gradient: ['#080f0d', '#081a15', '#080f0d'] },
  latenight: { accent: '#8B7FC7', glow: 'rgba(139, 127, 199, 0.15)', gradient: ['#08071a', '#0d0a25', '#08071a'] },
};

// ─── Spacing Scale ──────────────────────────────────────────────────
export const SPACING = {
  '2xs': 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 56,
  '4xl': 72,
};

// ─── Typography Scale ───────────────────────────────────────────────
// Cinematic hierarchy: large quiet headings, small elegant labels
export const TYPE = {
  hero:      { fontSize: 48, fontWeight: '300', letterSpacing: -1.5, lineHeight: 54 },
  h1:        { fontSize: 34, fontWeight: '300', letterSpacing: -0.8, lineHeight: 40 },
  h2:        { fontSize: 24, fontWeight: '400', letterSpacing: -0.4, lineHeight: 30 },
  h3:        { fontSize: 18, fontWeight: '500', letterSpacing: -0.2, lineHeight: 24 },
  body:      { fontSize: 15, fontWeight: '400', letterSpacing: 0,    lineHeight: 22 },
  bodySm:    { fontSize: 13, fontWeight: '400', letterSpacing: 0,    lineHeight: 18 },
  caption:   { fontSize: 11, fontWeight: '500', letterSpacing: 0.4,  lineHeight: 14 },
  label:     { fontSize: 11, fontWeight: '500', letterSpacing: 1.2,  lineHeight: 14, textTransform: 'uppercase' },
  mono:      { fontSize: 13, fontWeight: '500', letterSpacing: 0.5,  lineHeight: 18, fontVariant: ['tabular-nums'] },
};

// ─── Border Radius ──────────────────────────────────────────────────
export const RADIUS = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
};

// ─── Shadows — minimal, ambient ─────────────────────────────────────
export const SHADOWS = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  glow: (color) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
  }),
};

// ─── Animation Timing ───────────────────────────────────────────────
export const TIMING = {
  fast: 200,
  normal: 350,
  slow: 600,
  ambient: 3000,
  breathe: 4000,
};
