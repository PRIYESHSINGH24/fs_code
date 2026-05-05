import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Dimensions
} from 'react-native';
import Animated, { FadeInRight, FadeInLeft, SlideInBottom } from 'react-native-reanimated';
import { useAppContext } from '../../src/context/AppContext';
import { GeminiService } from '../../src/services/geminiService';
import { speechService } from '../../src/services/speechService';
import { Mic, Send, Bot, User, Trash2, Info } from 'lucide-react-native';
import { collection, addDoc, serverTimestamp, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../src/config/firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const MessageItem = React.memo(({ item }: { item: any }) => {
  const isUser = item.role === 'user';
  return (
    <Animated.View 
      entering={isUser ? FadeInRight.duration(400) : FadeInLeft.duration(400)}
      style={[styles.messageRow, isUser ? styles.userRow : styles.modelRow]}
    >
      {!isUser && (
        <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.avatar}>
          <Bot size={14} color="#fff" />
        </LinearGradient>
      )}
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.modelBubble]}>
        <Text style={[styles.messageText, isUser ? styles.userText : styles.modelText]}>
          {item.text}
        </Text>
      </View>
      {isUser && (
        <LinearGradient colors={['#6366f1', '#4f46e5']} style={styles.avatar}>
          <User size={14} color="#fff" />
        </LinearGradient>
      )}
    </Animated.View>
  );
});

export default function ChatScreen() {
  const { apiKey, mode, tone, language, history, addMessage, clearHistory, user } = useAppContext();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const gemini = useMemo(() => new GeminiService(apiKey), [apiKey]);

  const handleSendMessage = useCallback(async (text: string) => {
    const message = text || inputText;
    if (!message.trim() || isTyping) return;

    const userMsg = { role: 'user' as const, text: message };
    addMessage(userMsg);
    setInputText('');
    setIsTyping(true);
    Keyboard.dismiss();

    if (user) {
      try {
        await addDoc(collection(db, 'conversations'), {
          userId: user.uid,
          role: 'user',
          text: message,
          createdAt: serverTimestamp()
        });
      } catch (e) {
        console.error('Firestore save error', e);
      }
    }

    try {
      const response = await gemini.generateResponse(message, history, mode, tone, language);
      const modelMsg = { role: 'model' as const, text: response };
      addMessage(modelMsg);
      speechService.speak(response, language);

      if (user) {
        await addDoc(collection(db, 'conversations'), {
          userId: user.uid,
          role: 'model',
          text: response,
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      addMessage({ role: 'model', text: 'Connection lost. Please check your settings.' });
    } finally {
      setIsTyping(false);
    }
  }, [inputText, isTyping, gemini, history, mode, tone, language, addMessage, user]);

  const toggleListening = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      speechService.startListening(language, (text) => {
        setIsListening(false);
        handleSendMessage(text);
      }, () => setIsListening(false));
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#000', '#0f172a']} style={StyleSheet.absoluteFill} />
      
      {/* Dynamic Background Pattern (Subtle dots) */}
      <View style={styles.pattern} />

      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <View style={styles.statusDot} />
          <View>
            <Text style={styles.statusText}>{isTyping ? 'GEMINI IS THINKING...' : 'LIVE SESSION'}</Text>
            <Text style={styles.modeText}>{mode} • {tone}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.clearBtn} onPress={clearHistory}>
          <Trash2 size={18} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={history}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <MessageItem item={item} />}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        showsVerticalScrollIndicator={false}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <BlurView intensity={30} tint="dark" style={styles.inputArea}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask anything..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <View style={styles.actions}>
              <TouchableOpacity 
                style={[styles.actionBtn, isListening && styles.listeningBtn]} 
                onPress={toggleListening}
              >
                <Mic size={20} color={isListening ? '#ef4444' : 'rgba(255,255,255,0.6)'} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.sendBtn} 
                onPress={() => handleSendMessage(inputText)}
                disabled={!inputText.trim() && !isListening}
              >
                <LinearGradient colors={['#fff', '#e2e8f0']} style={styles.sendBtnGradient}>
                  <Send size={18} color="#000" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  pattern: {
    position: 'absolute',
    width: width,
    height: '100%',
    opacity: 0.05,
    backgroundColor: 'transparent',
    // In a real app we'd use a small SVG pattern here
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowRadius: 4,
    shadowOpacity: 0.5,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1.5,
  },
  modeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
  },
  clearBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 20,
    gap: 20,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    maxWidth: '85%',
  },
  userRow: {
    alignSelf: 'flex-end',
  },
  modelRow: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBubble: {
    padding: 16,
    borderRadius: 24,
  },
  userBubble: {
    backgroundColor: '#fff',
    borderBottomRightRadius: 4,
  },
  modelBubble: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  userText: {
    color: '#000',
  },
  modelText: {
    color: '#fff',
  },
  inputArea: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 28,
    padding: 6,
    paddingLeft: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    maxHeight: 120,
    paddingVertical: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listeningBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  sendBtnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
