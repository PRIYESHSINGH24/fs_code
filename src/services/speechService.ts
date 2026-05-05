import * as Speech from 'expo-speech';

export class SpeechService {
  private isSpeaking: boolean = false;

  constructor() {}

  async speak(text: string, lang: string = 'en-US', onEnd?: () => void) {
    try {
      if (!text) return;
      await Speech.stop();
      
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
    } catch (e) {
      console.error('TTS Error:', e);
    }
  }

  stopSpeaking() {
    try {
      Speech.stop();
      this.isSpeaking = false;
    } catch (e) {}
  }

  // Placeholder for future STT
  async startListening(lang: string = 'en-US', onResult: (text: string) => void, onError: (err: any) => void) {
    console.warn('Speech recognition is disabled in this stable build.');
    onError('STT_DISABLED');
  }

  stopListening() {
    // Placeholder
  }
}

export const speechService = new SpeechService();
