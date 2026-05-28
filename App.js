import React from 'react';
import { StatusBar, Platform, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MoodProvider } from './src/context/MoodContext';
import { AudioProvider } from './src/context/AudioContext';
import AppNavigator from './src/navigation/AppNavigator';

// Suppress non-critical warnings in development
if (Platform.OS !== 'web') {
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AudioProvider>
        <MoodProvider>
          <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" />
          <AppNavigator />
        </MoodProvider>
      </AudioProvider>
    </SafeAreaProvider>
  );
}
