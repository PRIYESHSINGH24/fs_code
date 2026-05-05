import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAppContext, Mode, Tone, Language } from '../../src/context/AppContext';
import { 
  GraduationCap, 
  Dumbbell, 
  Heart, 
  Coffee, 
  ShieldCheck, 
  Smile, 
  Flame, 
  Target, 
  Sparkles,
  Zap,
  Globe,
  ChevronRight
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import BackgroundAnimation from '../../src/components/BackgroundAnimation';

const { width, height } = Dimensions.get('window');

const modes: { id: Mode; icon: any; color: string[]; desc: string }[] = [
  { id: 'Doctor', icon: ShieldCheck, color: ['#3b82f6', '#1d4ed8'], desc: 'Professional Medical Care' },
  { id: 'Teacher', icon: GraduationCap, color: ['#f59e0b', '#d97706'], desc: 'Expert Learning Guidance' },
  { id: 'Fitness Trainer', icon: Dumbbell, color: ['#10b981', '#059669'], desc: 'Elite Physical Coaching' },
  { id: 'Therapist', icon: Heart, color: ['#ec4899', '#db2777'], desc: 'Deep Emotional Support' },
  { id: 'Friend', icon: Coffee, color: ['#8b5cf6', '#7c3aed'], desc: 'Casual Daily Companion' },
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
  { id: 'en-US', name: 'EN' },
  { id: 'hi-IN', name: 'HI' },
];

export default function HomeScreen() {
  const { mode, setMode, tone, setTone, language, setLanguage } = useAppContext();
  const [inspiration, setInspiration] = React.useState('');
  const router = useRouter();

  React.useEffect(() => {
    const fetchInspiration = async () => {
      try {
        const response = await fetch('https://api.quotable.io/random?tags=motivational');
        const data = await response.json();
        if (data.content) setInspiration(data.content);
      } catch (e) {
        setInspiration('Think limitlessly, converse intelligently.');
      }
    };
    fetchInspiration();
  }, []);

  return (
    <View style={styles.container}>
      <BackgroundAnimation />
      
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
          <Text style={styles.welcomeText}>Welcome to the Future,</Text>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Aura Pulse</Text>
            <View style={styles.languageToggle}>
              {languages.map((l) => (
                <TouchableOpacity
                  key={l.id}
                  onPress={() => setLanguage(l.id)}
                  style={[styles.langButton, language === l.id && styles.langButtonActive]}
                >
                  <Text style={[styles.langText, language === l.id && styles.langTextActive]}>{l.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {inspiration ? (
            <BlurView intensity={20} tint="dark" style={styles.inspirationCard}>
              <Text style={styles.inspirationText}>"{inspiration}"</Text>
            </BlurView>
          ) : null}
        </Animated.View>

        <View style={styles.mainGrid}>
          {/* Mode Selection */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Sparkles size={14} color="rgba(255,255,255,0.4)" />
              <Text style={styles.sectionLabel}>CORE FREQUENCY</Text>
            </View>
            <View style={styles.modesGrid}>
              {modes.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  onPress={() => setMode(m.id)}
                  style={styles.modeCardWrapper}
                >
                  <BlurView intensity={mode === m.id ? 60 : 15} tint="dark" style={[
                    styles.modeCard,
                    mode === m.id && { borderColor: m.color[0], borderWidth: 1.5 }
                  ]}>
                    <LinearGradient
                      colors={mode === m.id ? m.color : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.05)']}
                      style={styles.modeIconBg}
                    >
                      <m.icon size={20} color={mode === m.id ? '#fff' : 'rgba(255,255,255,0.4)'} />
                    </LinearGradient>
                    <Text style={[styles.modeName, mode === m.id && { color: '#fff' }]}>{m.id}</Text>
                  </BlurView>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Tone Selection */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
             <View style={styles.sectionHeader}>
              <Zap size={14} color="rgba(255,255,255,0.4)" />
              <Text style={styles.sectionLabel}>VIBRATIONAL TONE</Text>
            </View>
            <View style={styles.tonesGrid}>
              {tones.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => setTone(t.id)}
                  style={[styles.toneCard, tone === t.id && styles.toneCardActive]}
                >
                  <Text style={[styles.toneText, tone === t.id && styles.toneTextActive]}>{t.id}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInUp.delay(600)}>
          <TouchableOpacity onPress={() => router.push('/(main)/chat')} style={styles.startButton}>
            <LinearGradient
              colors={['#fff', '#e2e8f0']}
              style={styles.startButtonGradient}
            >
              <Text style={styles.startButtonText}>Initiate Sequence</Text>
              <ChevronRight size={22} color="#000" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    gap: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '700',
    letterSpacing: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -2,
  },
  languageToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 3,
    gap: 2,
  },
  langButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  langButtonActive: {
    backgroundColor: '#fff',
  },
  langText: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.4)',
  },
  langTextActive: {
    color: '#000',
  },
  inspirationCard: {
    marginTop: 12,
    padding: 14,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  inspirationText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    fontStyle: 'italic',
    lineHeight: 18,
    textAlign: 'center',
  },
  mainGrid: {
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 2,
  },
  modesGrid: {
    gap: 8,
  },
  modeCardWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  modeIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeName: {
    fontSize: 16,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.5)',
  },
  tonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toneCard: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  toneCardActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  toneText: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.4)',
  },
  toneTextActive: {
    color: '#000',
  },
  startButton: {
    height: 72,
    borderRadius: 24,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  startButtonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '900',
  }
});
