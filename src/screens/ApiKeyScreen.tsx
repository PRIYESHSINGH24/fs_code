import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { GeminiService } from '../services/geminiService';
import { Key, CheckCircle2, AlertCircle } from 'lucide-react-native';

export const ApiKeyScreen: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { apiKey, setApiKey } = useAppContext();
  const [input, setInput] = useState(apiKey);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleValidate = async () => {
    if (!input) return;
    setIsValidating(true);
    setError(null);

    try {
      const service = new GeminiService(input);
      const valid = await service.validateKey();
      
      if (valid) {
        await setApiKey(input);
        onNext();
      } else {
        setError("Invalid API Key. Please check and try again.");
      }
    } catch (e) {
      setError("An error occurred during validation.");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Key size={32} color="white" />
          </View>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Enter your Gemini API Key to get started</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Enter API Key"
            placeholderTextColor="#666"
            secureTextEntry
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {error && (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color="#f87171" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleValidate}
            disabled={!input || isValidating}
            style={[styles.button, (!input || isValidating) && styles.buttonDisabled]}
          >
            {isValidating ? (
              <ActivityIndicator color="black" />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Configure App</Text>
                <CheckCircle2 size={20} color="black" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          Your key is stored locally and never sent to our servers.
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
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
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 20,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 2,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(248,113,113,0.1)',
    padding: 12,
    borderRadius: 12,
  },
  errorText: {
    color: '#f87171',
    fontSize: 14,
  },
  button: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginTop: 20,
  }
});
