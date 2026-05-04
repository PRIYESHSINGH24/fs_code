import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { GeminiService } from '../services/geminiService';
import { speechService } from '../services/speechService';
import { buildSystemInstruction } from '../utils/promptBuilder';
import { Mic, MicOff, Settings2, Trash2, ArrowLeft, Volume2, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const VoiceAssistantScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { apiKey, mode, tone, language, history, addMessage, clearHistory } = useAppContext();
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState<string>('Ready to talk');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const gemini = useRef(new GeminiService(apiKey));

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleStartListening = () => {
    speechService.stopSpeaking();
    setIsSpeaking(false);
    setIsListening(true);
    setStatus('Listening...');

    speechService.startListening(
      language,
      (text) => {
        setIsListening(false);
        handleUserMessage(text);
      },
      (err) => {
        setIsListening(false);
        setStatus('Error: ' + err);
        setTimeout(() => setStatus('Ready to talk'), 3000);
      }
    );
  };

  const handleStopListening = () => {
    speechService.stopListening();
    setIsListening(false);
    setStatus('Ready to talk');
  };

  const handleUserMessage = async (text: string) => {
    if (!text.trim()) return;

    addMessage({ role: 'user', text });
    setIsThinking(true);
    setStatus('Thinking...');

    try {
      const systemInstruction = buildSystemInstruction(mode, tone, language);
      const chatHistory = history.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await gemini.current.generateResponse(text, chatHistory, systemInstruction);
      
      if (response) {
        addMessage({ role: 'model', text: response });
        setIsThinking(false);
        setIsSpeaking(true);
        setStatus('Speaking...');
        
        speechService.speak(response, language, () => {
          setIsSpeaking(false);
          setStatus('Ready to talk');
        });
      }
    } catch (error) {
      setIsThinking(false);
      setStatus('API Error occurred');
      setTimeout(() => setStatus('Ready to talk'), 3000);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-white/5 bg-black/50 backdrop-blur-md">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-all">
          <ArrowLeft className="w-5 h-5 text-white/60" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-sm font-bold tracking-tight">{mode}</span>
          <span className="text-[10px] uppercase tracking-widest text-white/40">{tone} Mode</span>
        </div>
        <button onClick={clearHistory} className="p-2 hover:bg-white/10 rounded-full transition-all">
          <Trash2 className="w-5 h-5 text-white/60" />
        </button>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-hide"
      >
        <AnimatePresence initial={false}>
          {history.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-4"
            >
              <div className="p-4 rounded-3xl bg-white/5 border border-white/10">
                <Sparkles className="w-8 h-8 text-white/40" />
              </div>
              <p className="text-white/40 text-sm max-w-[200px]">
                Tap the microphone and say something to start
              </p>
            </motion.div>
          )}

          {history.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-4 rounded-3xl ${
                msg.role === 'user' 
                  ? 'bg-white text-black rounded-tr-none' 
                  : 'bg-white/5 border border-white/10 rounded-tl-none'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </motion.div>
          ))}

          {isThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white/5 border border-white/10 p-4 rounded-3xl rounded-tl-none flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Bar */}
      <footer className="p-8 pb-12 bg-gradient-to-t from-black via-black to-transparent">
        <div className="flex flex-col items-center gap-6">
          <div className="text-xs uppercase tracking-[0.2em] text-white/40 font-semibold h-4">
            {status}
          </div>

          <div className="relative">
            <AnimatePresence>
              {(isListening || isThinking || isSpeaking) && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0.15 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="absolute inset-0 bg-white rounded-full blur-2xl"
                  transition={{ repeat: Infinity, duration: 1.5, repeatType: 'reverse' }}
                />
              )}
            </AnimatePresence>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={isListening ? handleStopListening : handleStartListening}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                isListening 
                  ? 'bg-red-500 scale-110 shadow-[0_0_30px_rgba(239,68,68,0.4)]' 
                  : 'bg-white text-black hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)]'
              }`}
            >
              {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </motion.button>
          </div>
          
          <div className="flex gap-8">
             <button className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-all">
                <Volume2 className="w-3 h-3" />
                <span>Audio Engine</span>
             </button>
             <button onClick={onBack} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-all">
                <Settings2 className="w-3 h-3" />
                <span>Persona Settings</span>
             </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
