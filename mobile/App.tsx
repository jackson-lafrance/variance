import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/services/AuthContext';
import { DarkModeProvider } from './src/contexts/DarkModeContext';
import RootNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <RootNavigator />
      </AuthProvider>
    </DarkModeProvider>
  );
}
