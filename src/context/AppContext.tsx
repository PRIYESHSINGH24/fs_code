import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [apiKey, setApiKeyState] = useState<string>(process.env.GEMINI_API_KEY || localStorage.getItem('gemini_api_key') || '');
  const [mode, setMode] = useState<Mode>((localStorage.getItem('app_mode') as Mode) || 'Friend');
  const [tone, setTone] = useState<Tone>((localStorage.getItem('app_tone') as Tone) || 'Friendly');
  const [language, setLanguageState] = useState<Language>((localStorage.getItem('app_language') as Language) || 'en-US');
  const [history, setHistory] = useState<Message[]>([]);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  useEffect(() => {
    localStorage.setItem('app_mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('app_tone', tone);
  }, [tone]);

  const addMessage = (msg: Message) => {
    setHistory(prev => [...prev, msg].slice(-10)); // Keep last 10 messages for context
  };

  const clearHistory = () => setHistory([]);

  const isConfigured = !!apiKey;

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
