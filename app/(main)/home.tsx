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
import Animated, { FadeInDown, FadeInUp, withRepeat, withTiming, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
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
        {/* Header Section */}
        <Animated.View entering={FadeInDown.duration(1000)} style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>AURA CORE ONLINE</Text>
            </View>
            <View style={styles.langContainer}>
              {languages.map((l) => (
                <TouchableOpacity
                  key={l.id}
                  onPress={() => setLanguage(l.id)}
                  style={[styles.langItem, language === l.id && styles.langItemActive]}
                >
                  <Text style={[styles.langText, language === l.id && styles.langTextActive]}>{l.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Text style={styles.title}>AURA AI</Text>
        </Animated.View>

        {/* The Unified Command Panel */}
        <Animated.View entering={FadeInDown.delay(300).duration(1000)} style={styles.panelContainer}>
          <BlurView intensity={25} tint="dark" style={styles.panel}>
            <View style={styles.panelSection}>
              <Text style={styles.sectionTitle}>SELECT FREQUENCY</Text>
              <View style={styles.modesGrid}>
                {modes.map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    onPress={() => setMode(m.id as any)}
                    style={[styles.modeItem, mode === m.id && styles.modeItemActive]}
                  >
                    <View style={[styles.iconBox, mode === m.id && { backgroundColor: m.color[0] }]}>
                      <m.icon size={20} color={mode === m.id ? '#fff' : 'rgba(255,255,255,0.4)'} />
                    </View>
                    <Text style={[styles.modeLabel, mode === m.id && styles.modeLabelActive]}>{m.id}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.panelSection}>
              <Text style={styles.sectionTitle}>ADJUST TONE</Text>
              <View style={styles.tonesGrid}>
                {tones.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    onPress={() => setTone(t.id)}
                    style={[styles.toneBtn, tone === t.id && styles.toneBtnActive]}
                  >
                    <Text style={[styles.toneLabel, tone === t.id && styles.toneLabelActive]}>{t.id}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </BlurView>
        </Animated.View>

        {/* Action Button */}
        <Animated.View entering={FadeInUp.delay(600).duration(1000)}>
          <TouchableOpacity onPress={() => router.push('/(main)/chat')} style={styles.mainBtn}>
            <LinearGradient
              colors={['#fff', '#e2e8f0']}
              style={styles.btnGradient}
            >
              <Text style={styles.btnText}>INITIATE SEQUENCE</Text>
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
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 60,
    justifyContent: 'space-between',
  },
  header: {
    gap: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  statusText: {
    fontSize: 9,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1.5,
  },
  langContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  langItem: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  langItemActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  langText: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.4)',
  },
  langTextActive: {
    color: '#000',
  },
  title: {
    fontSize: 56,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -3,
  },
  panelContainer: {
    flex: 1,
    marginVertical: 40,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  panel: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-around',
  },
  panelSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 2,
    textAlign: 'center',
  },
  modesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  modeItem: {
    alignItems: 'center',
    gap: 8,
    width: (width - 120) / 3,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  modeLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.4)',
  },
  modeLabelActive: {
    color: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 20,
  },
  tonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  toneBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  toneBtnActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  toneLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.4)',
  },
  toneLabelActive: {
    color: '#000',
  },
  mainBtn: {
    height: 76,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#fff',
    shadowRadius: 20,
    shadowOpacity: 0.1,
  },
  btnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  btnText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  }
});
