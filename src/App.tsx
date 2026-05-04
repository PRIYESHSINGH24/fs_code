/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { ApiKeyScreen } from './screens/ApiKeyScreen';
import { ModeSelectionScreen } from './screens/ModeSelectionScreen';
import { VoiceAssistantScreen } from './screens/VoiceAssistantScreen';
import { BackgroundAnimation } from './components/BackgroundAnimation';
import { AnimatePresence, motion } from 'motion/react';

type Screen = 'apiKey' | 'modeSelection' | 'voiceAssistant';

function AppContent() {
  const { isConfigured, apiKey } = useAppContext();
  const [currentScreen, setCurrentScreen] = useState<Screen>(
    apiKey ? 'modeSelection' : 'apiKey'
  );

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-white/20 relative overflow-hidden">
      <BackgroundAnimation />
      
      <AnimatePresence mode="wait">
        {currentScreen === 'apiKey' && (
          <motion.div
            key="apiKey"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <ApiKeyScreen onNext={() => setCurrentScreen('modeSelection')} />
          </motion.div>
        )}

        {currentScreen === 'modeSelection' && (
          <motion.div
            key="modeSelection"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <ModeSelectionScreen 
              onNext={() => setCurrentScreen('voiceAssistant')} 
              onBack={() => setCurrentScreen('apiKey')}
            />
          </motion.div>
        )}

        {currentScreen === 'voiceAssistant' && (
          <motion.div
            key="voiceAssistant"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <VoiceAssistantScreen onBack={() => setCurrentScreen('modeSelection')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
