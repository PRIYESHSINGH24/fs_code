import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet
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
  Zap
} from 'lucide-react-native';

const modes: { id: Mode; icon: any; color: string; desc: string }[] = [
  { id: 'Doctor', icon: ShieldCheck, color: '#60a5fa', desc: 'Medical advice' },
  { id: 'Teacher', icon: GraduationCap, color: '#facc15', desc: 'Learning assistant' },
  { id: 'Fitness Trainer', icon: Dumbbell, color: '#4ade80', desc: 'Workout steps' },
  { id: 'Therapist', icon: Heart, color: '#f472b6', desc: 'Empathetic listener' },
  { id: 'Friend', icon: Coffee, color: '#fb923c', desc: 'Casual chat' },
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

  // NETWORKING: Fetch example
  React.useEffect(() => {
    const fetchInspiration = async () => {
      try {
        const response = await fetch('https://api.quotable.io/random?tags=motivational');
        const data = await response.json();
        if (data.content) setInspiration(data.content);
      } catch (e) {
        setInspiration('Voice your thoughts, shape your future.');
      }
    };
    fetchInspiration();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.delay(100)} style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Persona</Text>
          <Text style={styles.subtitle}>CHOOSE YOUR COMPANION</Text>
          {inspiration ? (
            <Text style={styles.inspirationText}>"{inspiration}"</Text>
          ) : null}
        </View>

        {/* Mode Selection */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>MODE</Text>
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

          <View style={styles.modesGrid}>
            {modes.map((m) => (
              <TouchableOpacity
                key={m.id}
                onPress={() => setMode(m.id)}
                style={[styles.modeCard, mode === m.id && styles.modeCardActive]}
              >
                <View style={styles.modeIconContainer}>
                  <m.icon size={18} color={m.color} />
                </View>
                <Text style={styles.modeName}>{m.id}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Tone Selection */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <Text style={styles.sectionLabel}>TONE</Text>
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

        {/* Bottom Button */}
        <Animated.View entering={FadeInUp.delay(400)}>
          <TouchableOpacity onPress={() => router.push('/(main)/chat')} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Start Conversation</Text>
            <Sparkles size={20} color="black" />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
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
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: 'white',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 3,
  },
  inspirationText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.2)',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: 2,
  },
  languageToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 2,
  },
  langButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  langButtonActive: {
    backgroundColor: 'white',
  },
  langText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.3)',
  },
  langTextActive: {
    color: 'black',
  },
  modesGrid: {
    gap: 8,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: 12,
  },
  modeCardActive: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  modeIconContainer: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  tonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toneCard: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  toneCardActive: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  toneText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.3)',
  },
  toneTextActive: {
    color: 'black',
  },
  nextButton: {
    backgroundColor: 'white',
    height: 64,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  nextButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '700',
  }
});
