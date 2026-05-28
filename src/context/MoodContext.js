import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MoodContext = createContext();

const STORAGE_KEY = '@moodflow_history';

const initialState = {
  currentMood: null,
  intensity: 0.5,       // 0–1 range
  isPlaying: false,
  focusLock: false,
  timerDuration: null,   // in minutes, null = no timer
  timerRemaining: null,  // in seconds
  history: [],           // { moodId, intensity, startTime, endTime, duration }
  currentSessionStart: null,
};

function moodReducer(state, action) {
  switch (action.type) {
    case 'SET_MOOD':
      return {
        ...state,
        currentMood: action.payload,
        isPlaying: true,
        currentSessionStart: Date.now(),
      };
    case 'SET_INTENSITY':
      return { ...state, intensity: action.payload };
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'TOGGLE_FOCUS_LOCK':
      return { ...state, focusLock: !state.focusLock };
    case 'SET_TIMER':
      return {
        ...state,
        timerDuration: action.payload,
        timerRemaining: action.payload ? action.payload * 60 : null,
      };
    case 'TICK_TIMER':
      if (state.timerRemaining === null || state.timerRemaining <= 0) {
        return { ...state, timerRemaining: null, timerDuration: null };
      }
      return { ...state, timerRemaining: state.timerRemaining - 1 };
    case 'END_SESSION': {
      // Guard: if there's no active session, just reset state
      if (!state.currentMood || !state.currentSessionStart) {
        return {
          ...state,
          currentMood: null,
          isPlaying: false,
          focusLock: false,
          timerDuration: null,
          timerRemaining: null,
          currentSessionStart: null,
        };
      }
      const now = Date.now();
      const session = {
        id: now.toString(),
        moodId: state.currentMood.id,
        intensity: state.intensity,
        startTime: state.currentSessionStart,
        endTime: now,
        duration: Math.max(0, Math.round((now - state.currentSessionStart) / 1000)),
      };
      return {
        ...state,
        currentMood: null,
        isPlaying: false,
        focusLock: false,
        timerDuration: null,
        timerRemaining: null,
        currentSessionStart: null,
        history: [session, ...state.history].slice(0, 200),
      };
    }
    case 'LOAD_HISTORY':
      return { ...state, history: action.payload };
    case 'CLEAR_HISTORY':
      return { ...state, history: [] };
    default:
      return state;
  }
}

export function MoodProvider({ children }) {
  const [state, dispatch] = useReducer(moodReducer, initialState);

  // Load history from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          dispatch({ type: 'LOAD_HISTORY', payload: JSON.parse(stored) });
        }
      } catch (e) {
        console.warn('Failed to load mood history:', e);
      }
    })();
  }, []);

  // Persist history whenever it changes
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.history));
      } catch (e) {
        console.warn('Failed to save mood history:', e);
      }
    })();
  }, [state.history]);

  // Timer tick
  useEffect(() => {
    if (state.timerRemaining === null || !state.isPlaying) return;
    const interval = setInterval(() => {
      dispatch({ type: 'TICK_TIMER' });
    }, 1000);
    return () => clearInterval(interval);
  }, [state.timerRemaining, state.isPlaying]);

  // Auto-end session when timer reaches 0
  useEffect(() => {
    if (state.timerRemaining !== null && state.timerRemaining <= 0 && state.currentMood) {
      dispatch({ type: 'END_SESSION' });
    }
  }, [state.timerRemaining]);

  return (
    <MoodContext.Provider value={{ state, dispatch }}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
}
