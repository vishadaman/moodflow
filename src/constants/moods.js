// ─── MoodFlow Mood Catalogue v2 ─────────────────────────────────────
// Redesigned for atmospheric, cinematic UI — no emojis, no loud gradients
// Each mood is an emotional space the user steps into

export const MOODS = [
  {
    id: 'sad',
    label: 'Sad',
    subtitle: 'Melancholic',
    genre: 'Slow Blues · Ambient Soul',
    description: 'Sparse piano. Minor keys. Validates the feeling without amplifying it.',
    bpmRange: [55, 70],
    // Atmospheric image keywords (for future stock photo integration)
    atmosphere: 'rain on window',
  },
  {
    id: 'happy',
    label: 'Happy',
    subtitle: 'Content',
    genre: 'Acoustic Lo-Fi · Bright Ambient',
    description: 'Warm chords, gentle plucking. Like a quiet afternoon in golden light.',
    bpmRange: [85, 110],
    atmosphere: 'golden hour',
  },
  {
    id: 'energetic',
    label: 'Energetic',
    subtitle: 'Pumped',
    genre: 'Upbeat Lo-Fi · Funk Instrumental',
    description: 'Prominent bassline, syncopated drums. Drives momentum forward.',
    bpmRange: [110, 130],
    atmosphere: 'city lights motion',
  },
  {
    id: 'ecstatic',
    label: 'Ecstatic',
    subtitle: 'Joyful',
    genre: 'Euphoric Ambient · Cinematic Lift',
    description: 'Rising progressions, layered pads. Feels expansive and infinite.',
    bpmRange: [100, 125],
    atmosphere: 'aurora sky',
  },
  {
    id: 'hyped',
    label: 'Hyped',
    subtitle: 'EDM Mode',
    genre: 'Deep House · Downtempo Electronic',
    description: 'Synthesized pads, driving pulse. Energy without aggression.',
    bpmRange: [130, 145],
    atmosphere: 'neon abstract',
  },
  {
    id: 'motivated',
    label: 'Motivated',
    subtitle: 'Rising',
    genre: 'Motivational Ambient · Cinematic Build',
    description: 'Gradual crescendos, orchestral warmth. Built for the push.',
    bpmRange: [90, 115],
    atmosphere: 'mountain summit',
  },
  {
    id: 'focus',
    label: 'Deep Focus',
    subtitle: 'Coding',
    genre: 'Lo-Fi Hip-Hop · Binaural Ambient',
    description: 'Steady rhythm, vinyl texture. Engineered to reduce cognitive load.',
    bpmRange: [70, 90],
    atmosphere: 'dark workspace',
  },
  {
    id: 'study',
    label: 'Study',
    subtitle: 'Reading',
    genre: 'Classical Minimal · Piano Ambient',
    description: 'Slow harmonic movement, sparse arrangement. Maximum concentration.',
    bpmRange: [60, 80],
    atmosphere: 'library quiet',
  },
  {
    id: 'calm',
    label: 'Calm',
    subtitle: 'Winding Down',
    genre: 'Ambient · Nature-Infused Electronic',
    description: 'Long sustain notes, gentle reverb. Designed for decompression.',
    bpmRange: [45, 65],
    atmosphere: 'still water',
  },
  {
    id: 'latenight',
    label: 'Late Night',
    subtitle: 'Mellow',
    genre: 'Dark Lo-Fi · Night Ambient',
    description: 'Lower register, nocturnal textures. For the quiet hours.',
    bpmRange: [55, 75],
    atmosphere: 'midnight city',
  },
];

export const getMoodById = (id) => MOODS.find((m) => m.id === id);

export const INTENSITY_LABELS = ['Gentle', 'Soft', 'Medium', 'Deep', 'Intense'];
