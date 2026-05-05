import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../config/firebase';

export type Mode = 'Doctor' | 'Teacher' | 'Fitness Trainer' | 'Therapist' | 'Friend';
export type Tone = 'Formal' | 'Friendly' | 'Motivational' | 'Strict' | 'Sarcastic' | 'Caring';
export type Language = 'en-US' | 'hi-IN';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AppContextType {
  user: User | null;
  apiKey: string;
  setApiKey: (key: string) => Promise<void>;
  mode: Mode;
  setMode: (mode: Mode) => void;
  tone: Tone;
  setTone: (tone: Tone) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  history: Message[];
  addMessage: (msg: Message) => void;
  clearHistory: () => void;
  isLoaded: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [apiKey, setApiKeyState] = useState<string>('');
  const [mode, setModeState] = useState<Mode>('Friend');
  const [tone, setToneState] = useState<Tone>('Friendly');
  const [language, setLanguageState] = useState<Language>('en-US');
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // AUTHENTICATION (Firebase)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // LOAD SETTINGS (AsyncStorage)
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedKey = await SecureStore.getItemAsync('gemini_api_key');
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
    await SecureStore.setItemAsync('gemini_api_key', key);
  };

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
    AsyncStorage.setItem('app_mode', m);
  }, []);

  const setTone = useCallback((t: Tone) => {
    setToneState(t);
    AsyncStorage.setItem('app_tone', t);
  }, []);

  const setLanguage = useCallback((l: Language) => {
    setLanguageState(l);
    AsyncStorage.setItem('app_language', l);
  }, []);

  const addMessage = useCallback((msg: Message) => {
    setHistory(prev => [...prev, msg]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // PERFORMANCE OPTIMIZATION (useMemo)
  const contextValue = useMemo(() => ({
    user,
    apiKey,
    setApiKey,
    mode,
    setMode,
    tone,
    setTone,
    language,
    setLanguage,
    history,
    addMessage,
    clearHistory,
    isLoaded
  }), [user, apiKey, mode, tone, language, history, isLoaded, setMode, setTone, setLanguage, addMessage, clearHistory]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
