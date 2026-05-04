import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { GeminiService } from '../services/geminiService';
import { speechService } from '../services/speechService';
import { buildSystemInstruction } from '../utils/promptBuilder';
import { 
  Mic, 
  MicOff, 
  Settings2, 
  Trash2, 
  ArrowLeft, 
  Volume2, 
  Sparkles,
  Send
} from 'lucide-react-native';

export const VoiceAssistantScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { apiKey, mode, tone, language, history, addMessage, clearHistory } = useAppContext();
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState<string>('SYSTEM READY');
  const [textInput, setTextInput] = useState('');
  const flatListRef = useRef<FlatList>(null);
  
  const gemini = useRef(new GeminiService(apiKey));

  const handleStartListening = () => {
    speechService.stopSpeaking();
    setIsSpeaking(false);
    setIsListening(true);
    setStatus('LISTENING');

    speechService.startListening(
      language,
      (text) => {
        setIsListening(false);
        handleUserMessage(text);
      },
      (err) => {
        setIsListening(false);
        setStatus('VOICE UNAVAILABLE');
        setTimeout(() => setStatus('SYSTEM READY'), 2000);
      }
    );
  };

  const handleStopListening = () => {
    speechService.stopListening();
    setIsListening(false);
    setStatus('SYSTEM READY');
  };

  const handleUserMessage = async (text: string) => {
    if (!text.trim()) return;

    addMessage({ role: 'user', text });
    setIsThinking(true);
    setStatus('THINKING');
    setTextInput('');

    try {
      const systemInstruction = buildSystemInstruction(mode, tone, language);
      const chatHistory = history.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await gemini.current.generateResponse(text, chatHistory, systemInstruction);
      
      if (response) {
        addMessage({ role: 'model', text: response });
        setIsThinking(false);
        setIsSpeaking(true);
        setStatus('SPEAKING');
        
        speechService.speak(response, language, () => {
          setIsSpeaking(false);
          setStatus('SYSTEM READY');
        });
      }
    } catch (error) {
      setIsThinking(false);
      setStatus('OFFLINE');
      setTimeout(() => setStatus('SYSTEM READY'), 2000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.headerButton}>
            <ArrowLeft size={20} color="rgba(255,255,255,0.6)" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{mode}</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusSubtext}>{tone} • {language === 'hi-IN' ? 'Hindi' : 'English'}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={clearHistory} style={styles.headerButton}>
            <Trash2 size={20} color="rgba(255,255,255,0.6)" />
          </TouchableOpacity>
        </View>

        {/* Chat Area */}
        <FlatList
          ref={flatListRef}
          data={history}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.chatList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Sparkles size={48} color="rgba(255,255,255,0.2)" />
              </View>
              <Text style={styles.emptyTitle}>Initiated</Text>
              <Text style={styles.emptySubtitle}>Start your conversation by typing below or tapping the mic.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={[
              styles.messageWrapper,
              item.role === 'user' ? styles.userWrapper : styles.modelWrapper
            ]}>
              <View style={[
                styles.messageBubble,
                item.role === 'user' ? styles.userBubble : styles.modelBubble
              ]}>
                <Text style={[
                  styles.messageText,
                  item.role === 'user' ? styles.userText : styles.modelText
                ]}>
                  {item.text}
                </Text>
              </View>
            </View>
          )}
          ListFooterComponent={isThinking ? (
            <View style={styles.thinkingBubble}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : null}
        />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.statusLabel}>{status}</Text>
          
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={textInput}
              onChangeText={setTextInput}
              placeholder="Message Gemini..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              onSubmitEditing={() => handleUserMessage(textInput)}
            />
            {textInput.trim() ? (
              <TouchableOpacity 
                onPress={() => handleUserMessage(textInput)}
                style={styles.sendButton}
              >
                <Send size={20} color="black" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                onPress={isListening ? handleStopListening : handleStartListening}
                style={[styles.micButton, isListening && styles.micButtonActive]}
              >
                {isListening ? <MicOff size={24} color="white" /> : <Mic size={24} color="white" />}
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.configRow}>
             <TouchableOpacity style={styles.configButton}>
                <Volume2 size={16} color="rgba(255,255,255,0.2)" />
                <Text style={styles.configButtonText}>AUDIO</Text>
             </TouchableOpacity>
             <TouchableOpacity onPress={onBack} style={styles.configButton}>
                <Settings2 size={16} color="rgba(255,255,255,0.2)" />
                <Text style={styles.configButtonText}>CONFIG</Text>
             </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerButton: {
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
  },
  statusSubtext: {
    fontSize: 8,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 1,
  },
  chatList: {
    padding: 20,
    paddingBottom: 40,
    gap: 20,
  },
  messageWrapper: {
    flexDirection: 'row',
    width: '100%',
  },
  userWrapper: {
    justifyContent: 'flex-end',
  },
  modelWrapper: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 24,
  },
  userBubble: {
    backgroundColor: 'white',
    borderBottomRightRadius: 4,
  },
  modelBubble: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: 'black',
    fontWeight: '500',
  },
  modelText: {
    color: 'rgba(255,255,255,0.9)',
  },
  thinkingBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 24,
    borderBottomLeftRadius: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    gap: 12,
  },
  emptyIconContainer: {
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  emptySubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    maxWidth: 240,
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 0 : 20,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    gap: 20,
  },
  statusLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    letterSpacing: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 32,
    padding: 6,
    paddingLeft: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  textInput: {
    flex: 1,
    color: 'white',
    fontSize: 15,
    height: 48,
  },
  sendButton: {
    width: 44,
    height: 44,
    backgroundColor: 'white',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonActive: {
    backgroundColor: '#ef4444',
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginBottom: 10,
  },
  configButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  configButtonText: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: 2,
  }
});
;
