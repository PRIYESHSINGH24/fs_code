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
  Keyboard
} from 'react-native';
import Animated, { FadeInRight, FadeInLeft } from 'react-native-reanimated';
import { useAppContext } from '../../src/context/AppContext';
import { GeminiService } from '../../src/services/geminiService';
import { speechService } from '../../src/services/speechService';
import { Mic, Send, ArrowLeft, Bot, User, Trash2 } from 'lucide-react-native';
import { collection, addDoc, serverTimestamp, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../src/config/firebase';

const MessageItem = React.memo(({ item }: { item: any }) => {
  const isUser = item.role === 'user';
  return (
    <Animated.View 
      entering={isUser ? FadeInRight : FadeInLeft}
      style={[styles.messageRow, isUser ? styles.userRow : styles.modelRow]}
    >
      {!isUser && (
        <View style={styles.avatar}>
          <Bot size={16} color="#60a5fa" />
        </View>
      )}
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.modelBubble]}>
        <Text style={[styles.messageText, isUser ? styles.userText : styles.modelText]}>
          {item.text}
        </Text>
      </View>
      {isUser && (
        <View style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
          <User size={16} color="#fff" />
        </View>
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

  // LOAD CLOUD HISTORY
  useEffect(() => {
    if (user) {
      const loadCloudHistory = async () => {
        try {
          const q = query(
            collection(db, 'conversations'), 
            where('userId', '==', user.uid),
            orderBy('createdAt', 'asc')
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            // Mapping cloud history to local state if needed
          });
        } catch (e) {
          console.error('Firestore load error', e);
        }
      };
      loadCloudHistory();
    }
  }, [user]);

  const handleSendMessage = useCallback(async (text: string) => {
    const message = text || inputText;
    if (!message.trim() || isTyping) return;

    const userMsg = { role: 'user' as const, text: message };
    addMessage(userMsg);
    setInputText('');
    setIsTyping(true);
    Keyboard.dismiss();

    // SAVE TO CLOUD (Firestore)
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

      // Speak the response
      speechService.speak(response, language);

      // SAVE RESPONSE TO CLOUD
      if (user) {
        await addDoc(collection(db, 'conversations'), {
          userId: user.uid,
          role: 'model',
          text: response,
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      addMessage({ role: 'model', text: 'Sorry, I encountered an error. Please check your connection.' });
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
      speechService.startListening(
        language,
        (text) => {
          setIsListening(false);
          handleSendMessage(text);
        },
        (err) => {
          setIsListening(false);
          console.error('STT Error', err);
        }
      );
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={styles.container}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.statusText}>{isTyping ? 'GEMINI IS TYPING...' : 'SYSTEM READY'}</Text>
          <Text style={styles.modeText}>{mode} • {tone}</Text>
        </View>
        <TouchableOpacity onPress={clearHistory}>
          <Trash2 size={20} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={history}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <MessageItem item={item} />}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />

      <View style={styles.inputArea}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Message Gemini..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity 
            style={[styles.actionBtn, isListening && styles.listeningBtn]} 
            onPress={toggleListening}
          >
            <Mic size={20} color={isListening ? '#ef4444' : '#fff'} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#fff' }]} 
            onPress={() => handleSendMessage(inputText)}
            disabled={!inputText.trim()}
          >
            <Send size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#4ade80',
    letterSpacing: 2,
  },
  modeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  listContent: {
    padding: 20,
    gap: 16,
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
    borderRadius: 16,
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  messageBubble: {
    padding: 14,
    borderRadius: 20,
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
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: '#000',
  },
  modelText: {
    color: '#fff',
  },
  inputArea: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 30,
    padding: 6,
    paddingLeft: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    maxHeight: 100,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  listeningBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#ef4444',
    borderWidth: 1,
  },
});
