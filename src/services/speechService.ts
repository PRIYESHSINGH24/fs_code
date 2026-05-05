import * as Speech from 'expo-speech';

// Extremely safe dynamic import
let ExpoSpeechRecognition: any = null;
try {
  // Use a lazy requirement to prevent bundle-time crashes
  const module = require('expo-speech-recognition');
  if (module && module.ExpoSpeechRecognition) {
    ExpoSpeechRecognition = module.ExpoSpeechRecognition;
  }
} catch (e) {
  // Fallback silently during development
}

export class SpeechService {
  private isSpeaking: boolean = false;
  private isListening: boolean = false;

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
          this.isSpeaking = false;
        }
      });
      this.isSpeaking = true;
    } catch (e) {
      // Ignore TTS errors in dev
    }
  }

  stopSpeaking() {
    try {
      Speech.stop();
      this.isSpeaking = false;
    } catch (e) {}
  }

  async startListening(lang: string = 'en-US', onResult: (text: string) => void, onError: (err: any) => void) {
    if (!ExpoSpeechRecognition) {
      onError('NATIVE_MODULE_MISSING');
      return;
    }

    if (this.isListening) return;

    try {
      const result = await ExpoSpeechRecognition.requestPermissionsAsync();
      if (!result.granted) {
        onError('Permission denied');
        return;
      }

      this.isListening = true;
      
      ExpoSpeechRecognition.start({
        lang: lang,
        interimResults: false,
        maxAlternatives: 1,
        continuous: false,
      });

      const resultListener = ExpoSpeechRecognition.addListener("result", (event: any) => {
        const transcript = event.results[0]?.transcript;
        if (transcript) {
          onResult(transcript);
        }
      });

      const errorListener = ExpoSpeechRecognition.addListener("error", (event: any) => {
        onError(event.error);
      });

      const endListener = ExpoSpeechRecognition.addListener("end", () => {
        this.isListening = false;
        resultListener.remove();
        errorListener.remove();
        endListener.remove();
      });

    } catch (error) {
      this.isListening = false;
      onError(String(error));
    }
  }

  stopListening() {
    try {
      if (ExpoSpeechRecognition) {
        ExpoSpeechRecognition.stop();
      }
    } catch (e) {}
    this.isListening = false;
  }
}

export const speechService = new SpeechService();
