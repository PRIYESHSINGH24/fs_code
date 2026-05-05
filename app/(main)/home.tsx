import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Dimensions,
  Platform
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

const modes: { id: Mode; icon: any; color: string[] }[] = [
  { id: 'Doctor', icon: ShieldCheck, color: ['#60a5fa', '#3b82f6'] },
  { id: 'Teacher', icon: GraduationCap, color: ['#fbbf24', '#f59e0b'] },
  { id: 'Fitness', icon: Dumbbell, color: ['#34d399', '#10b981'] },
  { id: 'Therapist', icon: Heart, color: ['#f472b6', '#ec4899'] },
  { id: 'Friend', icon: Coffee, color: ['#a78bfa', '#8b5cf6'] },
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
  const router = useRouter();

  return (
    <View style={styles.container}>
      <BackgroundAnimation />
      
      <View style={styles.content}>
        {/* Header - Very Compact */}
        <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
          <View style={styles.topRow}>
            <View>
              <Text style={styles.welcomeText}>AURA SYSTEM</Text>
              <Text style={styles.title}>Aether</Text>
            </View>
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
        </Animated.View>

        <View style={styles.mainContainer}>
          {/* Mode Selection - 2 Column Grid to save space */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Sparkles size={12} color="rgba(255,255,255,0.4)" />
              <Text style={styles.sectionLabel}>PERSONA FREQUENCY</Text>
            </View>
            <View style={styles.modesGrid}>
              {modes.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  onPress={() => setMode(m.id as any)}
                  style={[styles.modeCardWrapper, { width: (width - 60) / 2 }]}
                >
                  <BlurView intensity={mode === m.id ? 60 : 15} tint="dark" style={[
                    styles.modeCard,
                    mode === m.id && { borderColor: m.color[0], borderWidth: 1 }
                  ]}>
                    <LinearGradient
                      colors={mode === m.id ? m.color : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.05)']}
                      style={styles.modeIconBg}
                    >
                      <m.icon size={18} color={mode === m.id ? '#fff' : 'rgba(255,255,255,0.4)'} />
                    </LinearGradient>
                    <Text style={[styles.modeName, mode === m.id && { color: '#fff' }]}>{m.id}</Text>
                  </BlurView>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Tone Selection - Compact Horizontal or Wrap */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
             <View style={styles.sectionHeader}>
              <Zap size={12} color="rgba(255,255,255,0.4)" />
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

        {/* Action Button - Centered and High Visibility */}
        <Animated.View entering={FadeInUp.delay(600)} style={styles.footer}>
          <TouchableOpacity onPress={() => router.push('/(main)/chat')} style={styles.startButton}>
            <LinearGradient
              colors={['#fff', '#cbd5e1']}
              style={styles.startButtonGradient}
            >
              <Text style={styles.startButtonText}>Initiate Session</Text>
              <ChevronRight size={20} color="#000" />
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
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    paddingBottom: 50,
    justifyContent: 'space-between',
  },
  header: {
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '900',
    letterSpacing: 3,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -2,
    marginTop: -4,
  },
  languageToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 3,
    gap: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
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
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.3)',
  },
  langTextActive: {
    color: '#000',
  },
  mainContainer: {
    gap: 32,
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
    fontSize: 9,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 2.5,
  },
  modesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  modeCardWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  modeIconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeName: {
    fontSize: 14,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.4)',
  },
  tonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toneCard: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  toneCardActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  toneText: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.4)',
  },
  toneTextActive: {
    color: '#000',
  },
  footer: {
    alignItems: 'center',
  },
  startButton: {
    height: 68,
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#fff',
    shadowRadius: 15,
    shadowOpacity: 0.1,
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
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  }
});
