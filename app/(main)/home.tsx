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
import Animated, { 
  FadeIn, 
  FadeInDown, 
  FadeOut,
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  Easing
} from 'react-native-reanimated';
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
  ChevronRight
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import BackgroundAnimation from '../../src/components/BackgroundAnimation';

const { width, height } = Dimensions.get('window');

const modes: { id: Mode; icon: any; color: string[]; desc: string }[] = [
  { id: 'Doctor', icon: ShieldCheck, color: ['#3b82f6', '#1d4ed8'], desc: 'Professional medical diagnosis and health advice.' },
  { id: 'Teacher', icon: GraduationCap, color: ['#f59e0b', '#d97706'], desc: 'Expert academic guidance and simplified learning.' },
  { id: 'Fitness', icon: Dumbbell, color: ['#10b981', '#059669'], desc: 'Personalized workout coaching and health goals.' },
  { id: 'Therapist', icon: Heart, color: ['#ec4899', '#db2777'], desc: 'Empathetic listening and emotional support.' },
  { id: 'Friend', icon: Coffee, color: ['#8b5cf6', '#7c3aed'], desc: 'Casual, friendly chat and daily companionship.' },
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
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.15, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const animatedAura = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 0.6,
  }));

  const activeMode = modes.find(m => m.id === mode) || modes[0];
  const activeColor = activeMode.color[0];

  return (
    <View style={styles.container}>
      <BackgroundAnimation />
      
      {/* Central Pulsing Aura Ring */}
      <View style={styles.auraContainer}>
        <Animated.View style={[styles.auraRing, { borderColor: activeColor }, animatedAura]} />
        <View style={[styles.auraCore, { shadowColor: activeColor }]} />
        
        {/* Holographic Meaning Display */}
        <Animated.View 
          key={mode}
          entering={FadeInDown.duration(600)}
          exiting={FadeOut.duration(300)}
          style={styles.meaningWrapper}
        >
          <Text style={[styles.meaningTitle, { color: activeColor }]}>{mode.toUpperCase()}</Text>
          <Text style={styles.meaningText}>{activeMode.desc}</Text>
        </Animated.View>
      </View>

      <View style={styles.content}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(1000)} style={styles.header}>
          <Text style={styles.headerTag}>SYSTEM FREQUENCY</Text>
          <Text style={styles.title}>AURA AI</Text>
          <View style={styles.langSwitch}>
            {languages.map((l) => (
              <TouchableOpacity
                key={l.id}
                onPress={() => setLanguage(l.id)}
                style={[styles.langBtn, language === l.id && styles.langBtnActive]}
              >
                <Text style={[styles.langText, language === l.id && styles.langTextActive]}>{l.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Dynamic Selectors */}
        <View style={styles.selectorContainer}>
          <View style={styles.modesRow}>
            {modes.map((m, index) => (
              <Animated.View 
                key={m.id} 
                entering={FadeInDown.delay(index * 100)}
              >
                <TouchableOpacity
                  onPress={() => setMode(m.id as any)}
                  style={[styles.modeBtn, mode === m.id && { backgroundColor: m.color[0], borderColor: m.color[0] }]}
                >
                  <m.icon size={22} color={mode === m.id ? '#fff' : 'rgba(255,255,255,0.4)'} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          <View style={styles.tonesContainer}>
            <Text style={styles.sectionLabel}>TONE MODULATION</Text>
            <View style={styles.tonesGrid}>
              {tones.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => setTone(t.id)}
                  style={[styles.toneTag, tone === t.id && { borderColor: activeColor }]}
                >
                  <BlurView intensity={tone === t.id ? 40 : 10} tint="dark" style={styles.toneBlur}>
                    <Text style={[styles.toneText, tone === t.id && { color: '#fff' }]}>{t.id}</Text>
                  </BlurView>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <Animated.View entering={FadeIn.delay(800)}>
          <TouchableOpacity onPress={() => router.push('/(main)/chat')} style={styles.startAction}>
            <LinearGradient
              colors={['#fff', '#cbd5e1']}
              style={styles.startGradient}
            >
              <Text style={styles.startText}>INITIATE CONVERSATION</Text>
              <ChevronRight size={24} color="#000" />
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
  auraContainer: {
    position: 'absolute',
    top: height * 0.22,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  auraRing: {
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  auraCore: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: 'rgba(255,255,255,0.02)',
    shadowRadius: 100,
    shadowOpacity: 0.5,
  },
  meaningWrapper: {
    position: 'absolute',
    alignItems: 'center',
    width: width * 0.7,
    gap: 8,
  },
  meaningTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 4,
  },
  meaningText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    paddingBottom: 50,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    gap: 4,
  },
  headerTag: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 3,
  },
  title: {
    fontSize: 54,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -4,
  },
  langSwitch: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  langBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  langBtnActive: {
    backgroundColor: '#fff',
  },
  langText: {
    fontSize: 11,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.2)',
  },
  langTextActive: {
    color: '#000',
  },
  selectorContainer: {
    gap: 30,
  },
  modesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  modeBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tonesContainer: {
    gap: 16,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: 2,
    textAlign: 'center',
  },
  tonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  toneTag: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  toneBlur: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  toneText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.3)',
  },
  startAction: {
    height: 76,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#fff',
    shadowRadius: 20,
    shadowOpacity: 0.1,
  },
  startGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  startText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  }
});
