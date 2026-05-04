import * as Speech from 'expo-speech';

export class SpeechService {
  private isSpeaking: boolean = false;

  constructor() {}

  speak(text: string, lang: string = 'en-US', onEnd?: () => void) {
    this.stopSpeaking();
    
    // expo-speech uses slightly different language codes sometimes, 
    // but en-US and hi-IN are usually fine.
    Speech.speak(text, {
      language: lang,
      onDone: () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      },
      onStopped: () => {
        this.isSpeaking = false;
      },
      onError: (error) => {
        console.error('Speech error:', error);
        this.isSpeaking = false;
      }
    });
    this.isSpeaking = true;
  }

  stopSpeaking() {
    Speech.stop();
    this.isSpeaking = false;
  }

  // Note: Standard Expo doesn't have a built-in cross-platform STT library anymore.
  // We recommend using @react-native-voice/voice or expo-speech-recognition for production.
  // For now, this is a placeholder.
  startListening(lang: string = 'en-US', onResult: (text: string) => void, onError: (err: any) => void) {
    console.warn("Speech recognition requires native configuration. Please install @react-native-voice/voice.");
    onError("Speech recognition not yet configured for native.");
  }

  stopListening() {
    // Placeholder
  }
}

export const speechService = new SpeechService();
