import React from 'react';
import { useAppContext, Mode, Tone, Language } from '../context/AppContext';
import { User, GraduationCap, Dumbbell, Heart, Coffee, ShieldCheck, Smile, Flame, Target, Languages } from 'lucide-react';
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
  { id: 'Sarcastic', icon: Coffee },
  { id: 'Caring', icon: Heart },
];

const languages: { id: Language; name: string }[] = [
  { id: 'en-US', name: 'English' },
  { id: 'hi-IN', name: 'Hindi' },
];

export const ModeSelectionScreen: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const { mode, setMode, tone, setTone, language, setLanguage } = useAppContext();

  return (
    <div className="flex flex-col min-h-screen p-6 bg-[#050505] text-white">
      <div className="flex-1 max-w-sm mx-auto w-full space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-white/40">Select Mode</h2>
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
              {languages.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLanguage(l.id)}
                  className={`px-3 py-1 text-[10px] uppercase tracking-tighter font-bold rounded-lg transition-all ${
                    language === l.id ? 'bg-white text-black shadow-lg shadow-black/20' : 'text-white/40'
                  }`}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {modes.map((m) => (
              <motion.button
                key={m.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  mode === m.id ? 'bg-white/10 border-white/40 shadow-lg shadow-white/5' : 'bg-white/5 border-white/5'
                }`}
              >
                <div className={`p-3 rounded-xl bg-black/40 ${m.color}`}>
                  <m.icon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">{m.id}</div>
                  <div className="text-xs text-white/40">{m.desc}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-white/40">Select Tone</h2>
          <div className="grid grid-cols-2 gap-3">
            {tones.map((t) => (
              <motion.button
                key={t.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTone(t.id)}
                className={`flex items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${
                  tone === t.id ? 'bg-white/10 border-white/40' : 'bg-white/5 border-white/5'
                }`}
              >
                <t.icon className={`w-4 h-4 ${tone === t.id ? 'text-white' : 'text-white/40'}`} />
                <span className={`text-sm font-medium ${tone === t.id ? 'text-white' : 'text-white/40'}`}>{t.id}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <button
            onClick={onNext}
            className="w-full py-4 bg-white text-black font-semibold rounded-2xl hover:bg-white/90 transition-all"
          >
            Start Assistant
          </button>
          <button
            onClick={onBack}
            className="w-full py-4 bg-transparent text-white/40 font-medium rounded-2xl hover:text-white/60 transition-all text-sm"
          >
            Change API Key
          </button>
        </div>
      </div>
    </div>
  );
};
