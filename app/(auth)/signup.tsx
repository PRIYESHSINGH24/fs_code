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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../src/config/firebase';
import { UserPlus, Mail, Lock, ArrowLeft, ChevronRight } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, useSharedValue, withRepeat, withTiming, Easing, useAnimatedStyle } from 'react-native-reanimated';
import BackgroundAnimation from '../../src/components/BackgroundAnimation';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const pulse = useSharedValue(1);

  React.useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.2, { duration: 3500, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const animatedAura = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 0.4,
  }));

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Required fields missing');
      return;
    }
    if (password !== confirmPassword) {
      setError('Key mismatch detected');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError('Registration Failed. Retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundAnimation />

      <View style={styles.auraWrapper}>
        <Animated.View style={[styles.auraCircle, animatedAura]} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>

          <Animated.View entering={FadeInDown.duration(1000)} style={styles.header}>
            <Text style={styles.title}>IDENTITY</Text>
            <Text style={styles.subtitle}>Begin your digital genesis</Text>
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

              <BlurView intensity={20} tint="dark" style={styles.inputBlur}>
                <Lock size={20} color="rgba(255,255,255,0.4)" />
                <TextInput
                  style={styles.input}
                  placeholder="Verify Key"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </BlurView>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity 
              style={styles.actionBtn} 
              onPress={handleSignup}
              disabled={loading}
            >
              <LinearGradient
                colors={['#fff', '#e2e8f0']}
                style={styles.btnGradient}
              >
                {loading ? <ActivityIndicator color="#000" /> : (
                  <>
                    <Text style={styles.btnText}>CONFIRM GENESIS</Text>
                    <ChevronRight size={22} color="#000" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600).duration(1000)} style={styles.footer}>
            <Text style={styles.footerText}>Already synced?</Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Sign In</Text>
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
    top: height * 0.1,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  auraCircle: {
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.3)',
    borderStyle: 'dashed',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    gap: 40,
  },
  backBtn: {
    position: 'absolute',
    top: 60,
    left: 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginTop: 60,
    gap: 8,
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
    gap: 20,
  },
  inputGroup: {
    gap: 14,
  },
  inputBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    borderRadius: 22,
    paddingHorizontal: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
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
