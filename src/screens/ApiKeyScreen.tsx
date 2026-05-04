import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { GeminiService } from '../services/geminiService';
import { Key, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ApiKeyScreen: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { apiKey, setApiKey } = useAppContext();
  const [input, setInput] = useState(apiKey);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleValidate = async () => {
    if (!input) return;
    setIsValidating(true);
    setError(null);

    const service = new GeminiService(input);
    const valid = await service.validateKey();
    
    if (valid) {
      setApiKey(input);
      onNext();
    } else {
      setError("Invalid API Key. Please check and try again.");
    }
    setIsValidating(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#050505] text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-4">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome</h1>
          <p className="text-white/60">Enter your Gemini API Key to get started</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter API Key"
              className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-center tracking-widest"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleValidate}
            disabled={!input || isValidating}
            className="w-full py-4 bg-white text-black font-semibold rounded-2xl hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isValidating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Configure App</span>
                <CheckCircle2 className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-center text-white/40">
          Your key is stored locally and never sent to our servers.
        </p>
      </motion.div>
    </div>
  );
};
