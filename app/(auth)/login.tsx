import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform,
  Dimensions
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../src/config/firebase';
import { Sparkles, Mail, Lock, ChevronRight } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, useSharedValue, withRepeat, withTiming, Easing, useAnimatedStyle } from 'react-native-reanimated';
import BackgroundAnimation from '../../src/components/BackgroundAnimation';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const pulse = useSharedValue(1);

  React.useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.2, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const animatedAura = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 0.5,
  }));

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Credentials required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError('Access Denied. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundAnimation />

      {/* Background Aura */}
      <View style={styles.auraWrapper}>
        <Animated.View style={[styles.auraCircle, animatedAura]} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.duration(1000)} style={styles.header}>
            <View style={styles.logoBox}>
              <Sparkles size={48} color="#fff" />
            </View>
            <Text style={styles.title}>AURA AI</Text>
            <Text style={styles.subtitle}>Enter the Intelligence Field</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(1000)} style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <BlurView intensity={20} tint="dark" style={styles.inputBlur}>
                <Mail size={20} color="rgba(255,255,255,0.4)" />
                <TextInput
                  style={styles.input}
                  placeholder="Registry Email"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                />
              </BlurView>

              <BlurView intensity={20} tint="dark" style={styles.inputBlur}>
                <Lock size={20} color="rgba(255,255,255,0.4)" />
                <TextInput
                  style={styles.input}
                  placeholder="Security Key"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </BlurView>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity 
              style={styles.actionBtn} 
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient
                colors={['#fff', '#e2e8f0']}
                style={styles.btnGradient}
              >
                {loading ? <ActivityIndicator color="#000" /> : (
                  <>
                    <Text style={styles.btnText}>INITIATE SYNC</Text>
                    <ChevronRight size={22} color="#000" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600).duration(1000)} style={styles.footer}>
            <Text style={styles.footerText}>First sync?</Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Create Aura Identity</Text>
              </TouchableOpacity>
            </Link>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  auraWrapper: {
    position: 'absolute',
    top: height * 0.15,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  auraCircle: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.4)',
    borderStyle: 'dashed',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    gap: 50,
  },
  header: {
    alignItems: 'center',
    gap: 12,
  },
  logoBox: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 54,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  formContainer: {
    gap: 24,
  },
  inputGroup: {
    gap: 16,
  },
  inputBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 68,
    borderRadius: 24,
    paddingHorizontal: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionBtn: {
    height: 72,
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 10,
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
  },
  errorText: {
    color: '#f87171',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 15,
  },
  linkText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  }
});
