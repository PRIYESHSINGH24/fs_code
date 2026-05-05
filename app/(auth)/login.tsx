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
import { Sparkles, Mail, Lock, LogIn, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInDown, SlideInBottom } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Mesh Gradient */}
      <LinearGradient
        colors={['#0f172a', '#1e1b4b', '#312e81']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Animated Glowing Orbs */}
      <Animated.View entering={FadeIn.delay(500).duration(2000)} style={[styles.orb, styles.orb1]} />
      <Animated.View entering={FadeIn.delay(800).duration(2000)} style={[styles.orb, styles.orb2]} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.duration(1000)} style={styles.header}>
            <View style={styles.logoWrapper}>
              <LinearGradient
                colors={['#818cf8', '#c084fc']}
                style={styles.logoGradient}
              >
                <Sparkles size={40} color="#fff" />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Gemini AI</Text>
            <Text style={styles.subtitle}>Your intelligence, evolved.</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(1000)} style={styles.formContainer}>
            <BlurView intensity={20} tint="dark" style={styles.glassCard}>
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Mail size={18} color="rgba(255,255,255,0.5)" />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Lock size={18} color="rgba(255,255,255,0.5)" />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity 
                style={styles.loginButton} 
                onPress={handleLogin}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#fff', '#e2e8f0']}
                  style={styles.buttonGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <>
                      <Text style={styles.loginButtonText}>Sign In</Text>
                      <ChevronRight size={20} color="#000" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </BlurView>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600).duration(1000)} style={styles.footer}>
            <Text style={styles.footerText}>New here?</Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.signupLink}>Create an account</Text>
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
  orb: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    opacity: 0.15,
  },
  orb1: {
    top: -width * 0.2,
    right: -width * 0.2,
    backgroundColor: '#818cf8',
  },
  orb2: {
    bottom: -width * 0.1,
    left: -width * 0.3,
    backgroundColor: '#c084fc',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 40,
  },
  header: {
    alignItems: 'center',
    gap: 12,
  },
  logoWrapper: {
    padding: 4,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
  },
  formContainer: {
    borderRadius: 32,
    overflow: 'hidden',
  },
  glassCard: {
    padding: 24,
    gap: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  inputGroup: {
    gap: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 64,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  loginButton: {
    height: 64,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 8,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loginButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
  },
  errorText: {
    color: '#f87171',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 15,
  },
  signupLink: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  }
});
