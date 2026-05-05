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
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown } from 'react-native-reanimated';
import BackgroundAnimation from '../../src/components/BackgroundAnimation';

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
      <BackgroundAnimation />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.duration(1000)} style={styles.header}>
            <View style={styles.logoWrapper}>
              <View style={styles.logoIcon}>
                <Sparkles size={40} color="#fff" />
              </View>
            </View>
            <Text style={styles.title}>AURA AI</Text>
            <Text style={styles.subtitle}>Conversational Brilliance.</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(1000)} style={styles.formContainer}>
            <BlurView intensity={30} tint="dark" style={styles.glassCard}>
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
                <View style={styles.buttonInner}>
                  {loading ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <>
                      <Text style={styles.loginButtonText}>Enter Aura</Text>
                      <ChevronRight size={20} color="#000" />
                    </>
                  )}
                </View>
              </TouchableOpacity>
            </BlurView>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600).duration(1000)} style={styles.footer}>
            <Text style={styles.footerText}>New to the experience?</Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.signupLink}>Create Account</Text>
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
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4f46e5',
    shadowRadius: 20,
    shadowOpacity: 0.5,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -2,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
    letterSpacing: 1,
  },
  formContainer: {
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  glassCard: {
    padding: 24,
    gap: 20,
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
    backgroundColor: '#fff',
    marginTop: 8,
  },
  buttonInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loginButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '800',
  },
  errorText: {
    color: '#f87171',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 15,
  },
  signupLink: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  }
});
