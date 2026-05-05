import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '../../src/context/AppContext';
import { GeminiService } from '../../src/services/geminiService';
import { Key, CheckCircle2, AlertCircle, LogOut, ShieldCheck } from 'lucide-react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../src/config/firebase';

export default function SettingsScreen() {
  const { apiKey, setApiKey } = useAppContext();
  const [inputValue, setInputValue] = useState(apiKey);
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleVerify = async () => {
    if (!inputValue.trim()) return;
    
    setStatus('testing');
    setError('');
    
    try {
      const gemini = new GeminiService(inputValue);
      const isValid = await gemini.testConnection();
      
      if (isValid) {
        setStatus('success');
        await setApiKey(inputValue);
        Alert.alert('Success', 'Gemini API Key configured successfully!');
        setTimeout(() => setStatus('idle'), 2000);
      } else {
        setStatus('error');
        setError('Invalid API Key');
      }
    } catch (err) {
      setStatus('error');
      setError('Connection failed');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('/(auth)/login');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inner}
        >
          <View style={styles.content}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <ShieldCheck size={20} color="#fff" />
                <Text style={styles.sectionTitle}>API Configuration</Text>
              </View>
              
              <View style={[
                styles.inputWrapper,
                status === 'error' && styles.inputWrapperError,
                status === 'success' && styles.inputWrapperSuccess
              ]}>
                <Key size={20} color="rgba(255,255,255,0.4)" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Gemini API Key"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  value={inputValue}
                  onChangeText={(val) => {
                    setInputValue(val);
                    if (status !== 'idle') setStatus('idle');
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              {status === 'error' && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity 
                onPress={handleVerify}
                disabled={status === 'testing'}
                style={styles.button}
              >
                {status === 'testing' ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.buttonText}>Update Key</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account</Text>
              <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
                <LogOut size={20} color="#ef4444" />
                <Text style={styles.logoutText}>Sign Out of Application</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

// Reuse same component name for consistency
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  inner: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    gap: 32,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 12,
  },
  inputWrapperError: {
    borderColor: '#ef4444',
  },
  inputWrapperSuccess: {
    borderColor: '#22c55e',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#fff',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: -8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.1)',
    gap: 12,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: '600',
  }
});
