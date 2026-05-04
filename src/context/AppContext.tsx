import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Mode = 'Doctor' | 'Teacher' | 'Fitness Trainer' | 'Therapist' | 'Friend';
export type Tone = 'Formal' | 'Friendly' | 'Motivational' | 'Strict' | 'Sarcastic' | 'Caring';
export type Language = 'en-US' | 'hi-IN';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AppContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  tone: Tone;
  setTone: (tone: Tone) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  history: Message[];
  addMessage: (msg: Message) => void;
  clearHistory: () => void;
  isConfigured: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [mode, setModeState] = useState<Mode>('Friend');
  const [tone, setToneState] = useState<Tone>('Friendly');
  const [language, setLanguageState] = useState<Language>('en-US');
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedKey = await AsyncStorage.getItem('gemini_api_key');
        const envKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
        const finalKey = savedKey || envKey || '';

        const savedMode = await AsyncStorage.getItem('app_mode');
        const savedTone = await AsyncStorage.getItem('app_tone');
        const savedLang = await AsyncStorage.getItem('app_language');

        if (finalKey) setApiKeyState(finalKey);
        if (savedMode) setModeState(savedMode as Mode);
        if (savedTone) setToneState(savedTone as Tone);
        if (savedLang) setLanguageState(savedLang as Language);
      } catch (e) {
        console.error('Failed to load settings', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  const setApiKey = async (key: string) => {
    setApiKeyState(key);
    await AsyncStorage.setItem('gemini_api_key', key);
  };

  const setMode = async (m: Mode) => {
    setModeState(m);
    await AsyncStorage.setItem('app_mode', m);
  };

  const setTone = async (t: Tone) => {
    setToneState(t);
    await AsyncStorage.setItem('app_tone', t);
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem('app_language', lang);
  };

  const addMessage = (msg: Message) => {
    setHistory(prev => [...prev, msg].slice(-10));
  };

  const clearHistory = () => setHistory([]);

  const isConfigured = !!apiKey;

  if (!isLoaded) return null;

  return (
    <AppContext.Provider value={{
      apiKey, setApiKey,
      mode, setMode,
      tone, setTone,
      language, setLanguage,
      history, addMessage, clearHistory,
      isConfigured
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
