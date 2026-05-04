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
  const [status, setStatus] = useState<string>('System Ready');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const gemini = useRef(new GeminiService(apiKey));

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [history, isThinking]);

  // ... (rest of logic remains same, just updating UI)

  const handleStartListening = () => {
    speechService.stopSpeaking();
    setIsSpeaking(false);
    setIsListening(true);
    setStatus('LISTENING');

    speechService.startListening(
      language,
      (text) => {
        setIsListening(false);
        handleUserMessage(text);
      },
      (err) => {
        setIsListening(false);
        setStatus('INTERRUPTED');
        setTimeout(() => setStatus('SYSTEM READY'), 2000);
      }
    );
  };

  const handleStopListening = () => {
    speechService.stopListening();
    setIsListening(false);
    setStatus('SYSTEM READY');
  };

  const handleUserMessage = async (text: string) => {
    if (!text.trim()) return;

    addMessage({ role: 'user', text });
    setIsThinking(true);
    setStatus('THINKING');

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
        setStatus('SPEAKING');
        
        speechService.speak(response, language, () => {
          setIsSpeaking(false);
          setStatus('SYSTEM READY');
        });
      }
    } catch (error) {
      setIsThinking(false);
      setStatus('OFFLINE');
      setTimeout(() => setStatus('SYSTEM READY'), 2000);
    }
  };

  return (
    <div className="flex flex-col h-screen text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-8 glass-dark z-20">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={onBack} 
          className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5"
        >
          <ArrowLeft className="w-5 h-5 text-white/60" />
        </motion.button>
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold tracking-tight text-glow">{mode}</h2>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">{tone} • {language === 'hi-IN' ? 'Hindi' : 'English'}</span>
          </div>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={clearHistory} 
          className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5"
        >
          <Trash2 className="w-5 h-5 text-white/60" />
        </motion.button>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-8 py-8 space-y-8 scrollbar-hide mask-gradient"
      >
        <AnimatePresence initial={false}>
          {history.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6"
            >
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="p-8 rounded-[40px] bg-white/5 border border-white/10"
              >
                <Sparkles className="w-12 h-12 text-white/30" />
              </motion.div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Initiated</h3>
                <p className="text-white/30 text-sm max-w-[240px] mx-auto leading-relaxed">
                  Start your conversation by tapping the sphere below.
                </p>
              </div>
            </motion.div>
          )}

          {history.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] px-6 py-5 rounded-[32px] ${
                msg.role === 'user' 
                  ? 'bg-white text-black font-medium rounded-br-none shadow-2xl' 
                  : 'glass-dark border border-white/10 rounded-bl-none text-white/90'
              }`}>
                <p className="text-sm leading-relaxed tracking-wide">{msg.text}</p>
              </div>
            </motion.div>
          ))}

          {isThinking && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-start"
            >
              <div className="glass-dark border border-white/5 px-6 py-5 rounded-[32px] rounded-bl-none">
                <div className="flex gap-2">
                  <motion.span 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} 
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-1.5 h-1.5 bg-white rounded-full" 
                  />
                  <motion.span 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} 
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="w-1.5 h-1.5 bg-white rounded-full" 
                  />
                  <motion.span 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} 
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="w-1.5 h-1.5 bg-white rounded-full" 
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Bar */}
      <footer className="px-8 pb-14 pt-8 glass-dark relative z-20">
        <div className="flex flex-col items-center gap-10">
          <div className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-black h-4 transition-all duration-300">
            {status}
          </div>

          <div className="relative group">
            {/* Ambient Pulse */}
            <AnimatePresence>
              {(isListening || isThinking || isSpeaking) && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 2, 1], opacity: [0, 0.2, 0] }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="absolute inset-0 bg-white rounded-full blur-3xl"
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />
              )}
            </AnimatePresence>

            {/* Main Interactive Sphere */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={isListening ? handleStopListening : handleStartListening}
              className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center transition-all duration-700 shadow-2xl overflow-hidden ${
                isListening 
                  ? 'bg-red-500 shadow-red-500/40 ring-4 ring-red-500/20' 
                  : (isThinking || isSpeaking)
                    ? 'bg-white shadow-white/40 ring-4 ring-white/20'
                    : 'bg-white/10 border border-white/20 hover:bg-white/20 shadow-white/5'
              }`}
            >
              {isListening ? (
                <MicOff className="w-10 h-10 text-white" />
              ) : (isThinking || isSpeaking) ? (
                <Loader2 className="w-10 h-10 text-black animate-spin" />
              ) : (
                <Mic className="w-10 h-10 text-white" />
              )}
              
              {/* Inner Glow Effect */}
              {isListening && (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"
                />
              )}
            </motion.button>
          </div>
          
          <div className="flex items-center gap-12">
             <button className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 hover:text-white transition-all group">
                <Volume2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Audio</span>
             </button>
             <button onClick={onBack} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 hover:text-white transition-all group">
                <Settings2 className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                <span>Config</span>
             </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
