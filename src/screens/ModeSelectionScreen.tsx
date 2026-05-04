import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext, Mode, Tone, Language } from '../context/AppContext';
import { 
  User, 
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
  { id: 'Doctor', icon: ShieldCheck, color: '#60a5fa', desc: 'Secure medical advice' },
  { id: 'Teacher', icon: GraduationCap, color: '#facc15', desc: 'Patient learning assistant' },
  { id: 'Fitness Trainer', icon: Dumbbell, color: '#4ade80', desc: 'Actionable workout steps' },
  { id: 'Therapist', icon: Heart, color: '#f472b6', desc: 'Empathetic listener' },
  { id: 'Friend', icon: Coffee, color: '#fb923c', desc: 'Casual relatable chat' },
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Persona</Text>
          <Text style={styles.subtitle}>SELECT YOUR COMPANION</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>MODE</Text>
            <View style={styles.languageToggle}>
              {languages.map((l) => (
                <TouchableOpacity
                  key={l.id}
                  onPress={() => setLanguage(l.id)}
                  style={[
                    styles.langButton,
                    language === l.id && styles.langButtonActive
                  ]}
                >
                  <Text style={[
                    styles.langText,
                    language === l.id && styles.langTextActive
                  ]}>
                    {l.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.modesGrid}>
            {modes.map((m) => (
              <TouchableOpacity
                key={m.id}
                onPress={() => setMode(m.id)}
                style={[
                  styles.modeCard,
                  mode === m.id && styles.modeCardActive
                ]}
              >
                <View style={styles.modeIconContainer}>
                  <m.icon size={20} color={m.color} />
                </View>
                <View style={styles.modeTextContainer}>
                  <Text style={styles.modeName}>{m.id}</Text>
                  <Text style={styles.modeDesc}>{m.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>TONE</Text>
          <View style={styles.tonesGrid}>
            {tones.map((t) => (
              <TouchableOpacity
                key={t.id}
                onPress={() => setTone(t.id)}
                style={[
                  styles.toneCard,
                  tone === t.id && styles.toneCardActive
                ]}
              >
                <t.icon size={20} color={tone === t.id ? 'white' : 'rgba(255,255,255,0.2)'} />
                <Text style={[
                  styles.toneText,
                  tone === t.id && styles.toneTextActive
                ]}>
                  {t.id}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity onPress={onNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Initialize Session</Text>
          <Sparkles size={20} color="black" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: 24,
    gap: 32,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: 'white',
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 2,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'between',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 2,
    flex: 1,
  },
  languageToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  langButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  langButtonActive: {
    backgroundColor: 'white',
  },
  langText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
  },
  langTextActive: {
    color: 'black',
  },
  modesGrid: {
    gap: 12,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: 16,
  },
  modeCardActive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  modeIconContainer: {
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  modeTextContainer: {
    flex: 1,
  },
  modeName: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  modeDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  tonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  toneCard: {
    width: '31%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: 8,
  },
  toneCardActive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  toneText: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 1,
  },
  toneTextActive: {
    color: 'white',
  },
  nextButton: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 10,
    marginBottom: 40,
  },
  nextButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '700',
  }
});
