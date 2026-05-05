import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Dimensions,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, withSpring, withHover } from 'react-native-reanimated';
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
  Globe
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

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
  { id: 'en-US', name: 'English' },
  { id: 'hi-IN', name: 'हिन्दी' },
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
      <LinearGradient
        colors={['#000', '#0f172a']}
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
          <Text style={styles.welcomeText}>Welcome Back,</Text>
          <Text style={styles.title}>Define Persona</Text>
          {inspiration ? (
            <BlurView intensity={10} style={styles.inspirationCard}>
              <Text style={styles.inspirationText}>"{inspiration}"</Text>
            </BlurView>
          ) : null}
        </Animated.View>

        <View style={styles.content}>
          {/* Language Selection */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Globe size={16} color="rgba(255,255,255,0.4)" />
              <Text style={styles.sectionLabel}>LANGUAGE</Text>
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
          </Animated.View>

          {/* Mode Selection */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Sparkles size={16} color="rgba(255,255,255,0.4)" />
              <Text style={styles.sectionLabel}>COMPANION MODE</Text>
            </View>
            <View style={styles.modesGrid}>
              {modes.map((m, index) => (
                <TouchableOpacity
                  key={m.id}
                  onPress={() => setMode(m.id)}
                  style={styles.modeCardWrapper}
                >
                  <BlurView intensity={mode === m.id ? 40 : 10} tint="dark" style={[
                    styles.modeCard,
                    mode === m.id && { borderColor: m.color[0], borderWidth: 1.5 }
                  ]}>
                    <LinearGradient
                      colors={mode === m.id ? m.color : ['transparent', 'transparent']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.modeIconBg}
                    >
                      <m.icon size={24} color={mode === m.id ? '#fff' : 'rgba(255,255,255,0.5)'} />
                    </LinearGradient>
                    <View style={styles.modeInfo}>
                      <Text style={[styles.modeName, mode === m.id && { color: '#fff' }]}>{m.id}</Text>
                      <Text style={styles.modeDesc}>{m.desc}</Text>
                    </View>
                  </BlurView>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Tone Selection */}
          <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
             <View style={styles.sectionHeader}>
              <Zap size={16} color="rgba(255,255,255,0.4)" />
              <Text style={styles.sectionLabel}>CONVERSATION TONE</Text>
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

          <Animated.View entering={FadeInUp.delay(800)}>
            <TouchableOpacity onPress={() => router.push('/(main)/chat')} style={styles.startButton}>
              <LinearGradient
                colors={['#fff', '#f8fafc']}
                style={styles.startButtonGradient}
              >
                <Text style={styles.startButtonText}>Begin Session</Text>
                <ChevronRight size={22} color="#000" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

import { ChevronRight } from 'lucide-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    gap: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -1,
  },
  inspirationCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  inspirationText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
    fontStyle: 'italic',
    lineHeight: 20,
    textAlign: 'center',
  },
  content: {
    padding: 24,
    gap: 32,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 2,
  },
  languageToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 6,
    gap: 4,
  },
  langButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 16,
  },
  langButtonActive: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  langText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
  },
  langTextActive: {
    color: '#000',
  },
  modesGrid: {
    gap: 12,
  },
  modeCardWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  modeIconBg: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  modeInfo: {
    flex: 1,
    gap: 2,
  },
  modeName: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
  },
  modeDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    fontWeight: '500',
  },
  tonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  toneCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  toneCardActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  toneText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
  },
  toneTextActive: {
    color: '#000',
  },
  startButton: {
    height: 72,
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 8,
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
    fontWeight: '800',
  }
});
