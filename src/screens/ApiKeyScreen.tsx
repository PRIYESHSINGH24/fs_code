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
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { GeminiService } from '../services/geminiService';
import { Key, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react-native';

export const ApiKeyScreen: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { apiKey, setApiKey } = useAppContext();
  const [inputValue, setInputValue] = useState(apiKey);
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!inputValue.trim()) return;
    
    setStatus('testing');
    setError('');
    
    try {
      const gemini = new GeminiService(inputValue);
      const isValid = await gemini.testConnection();
      
      if (isValid) {
        setStatus('success');
        setApiKey(inputValue);
        setTimeout(onNext, 1000);
      } else {
        setStatus('error');
        setError('Invalid API Key');
      }
    } catch (err) {
      setStatus('error');
      setError('Connection failed');
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
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <View style={styles.iconCircle}>
                <Sparkles size={40} color="white" />
              </View>
              <Text style={styles.title}>Gemini Voice</Text>
              <Text style={styles.subtitle}>SECURE AI ACCESS</Text>
            </View>

            {/* Input Section */}
            <View style={styles.form}>
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
                  autoCorrect={false}
                />
              </View>

              {status === 'error' && (
                <View style={styles.errorContainer}>
                  <AlertCircle size={14} color="#ef4444" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <TouchableOpacity 
                onPress={handleVerify}
                disabled={status === 'testing' || status === 'success'}
                style={[
                  styles.button,
                  status === 'success' && styles.buttonSuccess
                ]}
              >
                {status === 'testing' ? (
                  <ActivityIndicator color="black" />
                ) : status === 'success' ? (
                  <CheckCircle2 size={24} color="white" />
                ) : (
                  <Text style={styles.buttonText}>Configure Session</Text>
                )}
              </TouchableOpacity>
              
              <Text style={styles.footerText}>
                Your key is stored locally and never shared.
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

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
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 60,
  },
  logoContainer: {
    alignItems: 'center',
    gap: 16,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 4,
  },
  form: {
    width: '100%',
    gap: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    paddingHorizontal: 20,
    height: 64,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 12,
  },
  inputWrapperError: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  inputWrapperSuccess: {
    borderColor: '#22c55e',
    backgroundColor: 'rgba(34, 197, 94, 0.05)',
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    height: '100%',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 4,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
  },
  button: {
    backgroundColor: 'white',
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  buttonSuccess: {
    backgroundColor: '#22c55e',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '700',
  },
  footerText: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 18,
  }
});
