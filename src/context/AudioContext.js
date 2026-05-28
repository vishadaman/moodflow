import React, { createContext, useContext, useRef, useCallback, useState, useEffect } from 'react';

// ─── Safe dynamic import ────────────────────────────────────────────
let Audio = null;
let audioAvailable = false;

try {
  const expoAv = require('expo-av');
  Audio = expoAv.Audio;
  audioAvailable = true;
} catch (e) {
  console.warn(
    'MoodFlow: expo-av native module not available. ' +
    'Audio is disabled. Create a dev build to enable audio.'
  );
}

// Synthesized tone frequencies per mood
const MOOD_FREQUENCIES = {
  sad: { base: 220, harmonics: [1, 0.5, 0.25] },
  happy: { base: 392, harmonics: [1, 0.6, 0.3] },
  energetic: { base: 330, harmonics: [1, 0.7, 0.4] },
  ecstatic: { base: 440, harmonics: [1, 0.8, 0.5] },
  hyped: { base: 349, harmonics: [1, 0.9, 0.6] },
  motivated: { base: 370, harmonics: [1, 0.6, 0.35] },
  focus: { base: 261, harmonics: [1, 0.4, 0.2] },
  study: { base: 293, harmonics: [1, 0.3, 0.15] },
  calm: { base: 196, harmonics: [1, 0.35, 0.15] },
  latenight: { base: 185, harmonics: [1, 0.4, 0.2] },
};

function generateAmbientWav(moodId, intensity = 0.5, durationSec = 8) {
  const sampleRate = 22050;
  const numSamples = sampleRate * durationSec;
  const mood = MOOD_FREQUENCIES[moodId] || MOOD_FREQUENCIES.calm;
  const samples = new Float32Array(numSamples);
  const baseFreq = mood.base * (0.8 + intensity * 0.4);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;
    mood.harmonics.forEach((amp, idx) => {
      const freq = baseFreq * (idx + 1);
      const detune = 1 + Math.sin(t * 0.1 * (idx + 1)) * 0.002;
      sample += amp * Math.sin(2 * Math.PI * freq * detune * t);
    });
    sample += 0.3 * Math.sin(2 * Math.PI * (baseFreq / 2) * t);
    const lfo = 0.7 + 0.3 * Math.sin(2 * Math.PI * 0.15 * t);
    sample *= lfo;
    const fadeLen = sampleRate * 0.5;
    if (i < fadeLen) sample *= i / fadeLen;
    if (i > numSamples - fadeLen) sample *= (numSamples - i) / fadeLen;
    samples[i] = sample * 0.15 * (0.5 + intensity * 0.5);
  }

  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);
  const writeStr = (offset, str) => {
    for (let j = 0; j < str.length; j++) view.setUint8(offset + j, str.charCodeAt(j));
  };
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, s * 0x7fff, true);
  }

  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const soundRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!audioAvailable || !Audio) return;
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    }).catch(() => {});
    return () => {
      if (soundRef.current) soundRef.current.unloadAsync().catch(() => {});
    };
  }, []);

  const loadMood = useCallback(async (moodId, intensity = 0.5) => {
    if (!audioAvailable || !Audio) { setIsLoaded(false); return false; }
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        setIsLoaded(false);
      }
      const wavBase64 = generateAmbientWav(moodId, intensity);
      const uri = `data:audio/wav;base64,${wavBase64}`;
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { isLooping: true, volume: 0.8, shouldPlay: true }
      );
      soundRef.current = sound;
      setIsLoaded(true);
      return true;
    } catch (e) {
      console.warn('Audio load error:', e);
      setIsLoaded(false);
      return false;
    }
  }, []);

  const play = useCallback(async () => {
    if (!audioAvailable || !soundRef.current) return;
    try { await soundRef.current.playAsync(); } catch (e) { /* silent */ }
  }, []);

  const pause = useCallback(async () => {
    if (!audioAvailable || !soundRef.current) return;
    try { await soundRef.current.pauseAsync(); } catch (e) { /* silent */ }
  }, []);

  const stop = useCallback(async () => {
    if (!audioAvailable || !soundRef.current) return;
    try {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
      setIsLoaded(false);
    } catch (e) { /* silent */ }
  }, []);

  const setVolume = useCallback(async (volume) => {
    if (!audioAvailable || !soundRef.current) return;
    try { await soundRef.current.setVolumeAsync(Math.max(0, Math.min(1, volume))); } catch (e) { /* silent */ }
  }, []);

  return (
    <AudioContext.Provider value={{ loadMood, play, pause, stop, setVolume, isLoaded, audioAvailable }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within an AudioProvider');
  return ctx;
}
