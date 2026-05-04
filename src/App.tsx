/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { ApiKeyScreen } from './screens/ApiKeyScreen';
import { ModeSelectionScreen } from './screens/ModeSelectionScreen';
import { VoiceAssistantScreen } from './screens/VoiceAssistantScreen';
import { AnimatePresence, motion } from 'motion/react';

type Screen = 'apiKey' | 'modeSelection' | 'voiceAssistant';

function AppContent() {
  const { isConfigured } = useAppContext();
  const [currentScreen, setCurrentScreen] = useState<Screen>(isConfigured ? 'modeSelection' : 'apiKey');

  return (
    <div className="min-h-screen bg-[#050505] font-sans selection:bg-white/20">
      <AnimatePresence mode="wait">
        {currentScreen === 'apiKey' && (
          <motion.div
            key="apiKey"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ApiKeyScreen onNext={() => setCurrentScreen('modeSelection')} />
          </motion.div>
        )}

        {currentScreen === 'modeSelection' && (
          <motion.div
            key="modeSelection"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
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
