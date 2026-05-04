import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useAppContext } from './context/AppContext';
import { ApiKeyScreen } from './screens/ApiKeyScreen';
import { ModeSelectionScreen } from './screens/ModeSelectionScreen';
import { VoiceAssistantScreen } from './screens/VoiceAssistantScreen';

type Screen = 'apiKey' | 'modeSelection' | 'voiceAssistant';

function AppContent() {
  const { isConfigured, apiKey } = useAppContext();
  const [currentScreen, setCurrentScreen] = useState<Screen>(
    apiKey ? 'modeSelection' : 'apiKey'
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {currentScreen === 'apiKey' && (
        <ApiKeyScreen onNext={() => setCurrentScreen('modeSelection')} />
      )}

      {currentScreen === 'modeSelection' && (
        <ModeSelectionScreen 
          onNext={() => setCurrentScreen('voiceAssistant')} 
          onBack={() => setCurrentScreen('apiKey')}
        />
      )}

      {currentScreen === 'voiceAssistant' && (
        <VoiceAssistantScreen onBack={() => setCurrentScreen('modeSelection')} />
      )}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
