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
import Animated, { FadeInRight, FadeInLeft } from 'react-native-reanimated';
import { useAppContext } from '../../src/context/AppContext';
import { GeminiService } from '../../src/services/geminiService';
import { speechService } from '../../src/services/speechService';
import { Mic, Send, Bot, User, Trash2 } from 'lucide-react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../src/config/firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import BackgroundAnimation from '../../src/components/BackgroundAnimation';

const { width } = Dimensions.get('window');

const MessageItem = React.memo(({ item }: { item: any }) => {
  const isUser = item.role === 'user';
  return (
    <Animated.View 
      entering={isUser ? FadeInRight.duration(500) : FadeInLeft.duration(500)}
      style={[styles.messageRow, isUser ? styles.userRow : styles.modelRow]}
    >
      {!isUser && (
        <LinearGradient colors={['#4f46e5', '#7c3aed']} style={styles.avatar}>
          <Bot size={14} color="#fff" />
        </LinearGradient>
      )}
      <View style={styles.bubbleWrapper}>
        <BlurView intensity={isUser ? 0 : 40} tint="dark" style={[styles.messageBubble, isUser ? styles.userBubble : styles.modelBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userText : styles.modelText]}>
            {item.text}
          </Text>
        </BlurView>
      </View>
      {isUser && (
        <LinearGradient colors={['#fff', '#e2e8f0']} style={styles.avatar}>
          <User size={14} color="#000" />
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
      addMessage({ role: 'model', text: 'Vibrational alignment lost. Reconnecting...' });
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
      <BackgroundAnimation />

      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <View style={styles.pulseDot} />
          <View>
            <Text style={styles.statusText}>{isTyping ? 'AURA IS VIBRATING...' : 'SYNCED'}</Text>
            <Text style={styles.modeText}>{mode} • {tone}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.headerBtn} onPress={clearHistory}>
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
        <BlurView intensity={40} tint="dark" style={styles.inputArea}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Communicate with Aura..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <View style={styles.actions}>
              <TouchableOpacity 
                style={[styles.actionBtn, isListening && styles.listeningBtn]} 
                onPress={toggleListening}
              >
                <Mic size={22} color={isListening ? '#ef4444' : 'rgba(255,255,255,0.7)'} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.sendBtn} 
                onPress={() => handleSendMessage(inputText)}
                disabled={!inputText.trim()}
              >
                <LinearGradient colors={['#fff', '#e2e8f0']} style={styles.sendBtnInner}>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4f46e5',
    shadowColor: '#4f46e5',
    shadowRadius: 10,
    shadowOpacity: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
  },
  modeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 24,
    gap: 24,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    maxWidth: '85%',
  },
  userRow: {
    alignSelf: 'flex-end',
  },
  modelRow: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  messageBubble: {
    padding: 18,
    borderRadius: 24,
  },
  userBubble: {
    backgroundColor: '#fff',
    borderBottomRightRadius: 4,
  },
  modelBubble: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '500',
  },
  userText: {
    color: '#000',
  },
  modelText: {
    color: '#fff',
  },
  inputArea: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 38 : 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 32,
    padding: 8,
    paddingLeft: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    maxHeight: 120,
    paddingVertical: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listeningBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  sendBtnInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
