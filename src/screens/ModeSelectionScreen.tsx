import React from 'react';
import { useAppContext, Mode, Tone, Language } from '../context/AppContext';
import { User, GraduationCap, Dumbbell, Heart, Coffee, ShieldCheck, Smile, Flame, Target, Languages, Sparkles, Zap } from 'lucide-react';
import { motion } from 'motion/react';

const modes: { id: Mode; icon: any; color: string; desc: string }[] = [
  { id: 'Doctor', icon: ShieldCheck, color: 'text-blue-400', desc: 'Secure medical advice' },
  { id: 'Teacher', icon: GraduationCap, color: 'text-yellow-400', desc: 'Patient learning assistant' },
  { id: 'Fitness Trainer', icon: Dumbbell, color: 'text-green-400', desc: 'Actionable workout steps' },
  { id: 'Therapist', icon: Heart, color: 'text-pink-400', desc: 'Empathetic listener' },
  { id: 'Friend', icon: Coffee, color: 'text-orange-400', desc: 'Casual relatable chat' },
];

const tones: { id: Tone; icon: any }[] = [
  { id: 'Formal', icon: Target },
  { id: 'Friendly', icon: Smile },
  { id: 'Motivational', icon: Flame },
  { id: 'Strict', icon: ShieldCheck },
  { id: 'Sarcastic', icon: Zap },
  { id: 'Caring', icon: Heart },
];

const languages: { id: Language; name: string }[] = [
  { id: 'en-US', name: 'English' },
  { id: 'hi-IN', name: 'Hindi' },
];

export const ModeSelectionScreen: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const { mode, setMode, tone, setTone, language, setLanguage } = useAppContext();

  return (
    <div className="flex flex-col min-h-screen p-6 text-white justify-center">
      <div className="max-w-md mx-auto w-full space-y-12">
        {/* Header */}
        <header className="text-center space-y-3">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight text-glow"
          >
            Persona
          </motion.h1>
          <p className="text-white/40 text-sm font-medium tracking-widest uppercase">Select your companion</p>
        </header>

        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Mode</h2>
              <div className="flex glass p-1 rounded-full border-white/5">
                {languages.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLanguage(l.id)}
                    className={`px-4 py-1.5 text-[10px] uppercase font-bold rounded-full transition-all ${
                      language === l.id ? 'bg-white text-black shadow-xl' : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {modes.map((m, i) => (
                <motion.button
                  key={m.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMode(m.id)}
                  className={`group flex items-center gap-4 p-5 rounded-3xl border transition-all duration-500 overflow-hidden relative ${
                    mode === m.id 
                      ? 'bg-white/10 border-white/20 shadow-2xl shadow-white/5 ring-1 ring-white/10' 
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                  }`}
                >
                  {mode === m.id && (
                    <motion.div 
                      layoutId="active-bg"
                      className="absolute inset-0 bg-gradient-to-r from-white/[0.05] to-transparent"
                    />
                  )}
                  <div className={`p-3.5 rounded-2xl bg-black/50 border border-white/5 transition-transform group-hover:scale-110 ${m.color}`}>
                    <m.icon className="w-5 h-5" />
                  </div>
                  <div className="text-left relative z-10">
                    <div className="font-bold text-lg tracking-tight">{m.id}</div>
                    <div className="text-xs text-white/40 font-medium">{m.desc}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 px-2">Tone</h2>
            <div className="grid grid-cols-3 gap-3">
              {tones.map((t) => (
                <motion.button
                  key={t.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTone(t.id)}
                  className={`flex flex-col items-center justify-center gap-3 p-4 rounded-3xl border transition-all ${
                    tone === t.id 
                      ? 'bg-white/10 border-white/20' 
                      : 'bg-white/[0.02] border-white/5'
                  }`}
                >
                  <t.icon className={`w-5 h-5 ${tone === t.id ? 'text-white' : 'text-white/20'}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${tone === t.id ? 'text-white' : 'text-white/30'}`}>{t.id}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            className="w-full py-5 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3"
          >
            <span>Initialize Session</span>
            <Sparkles className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
