import * as Speech from 'expo-speech';

// Dynamic import or safety check for native module
let ExpoSpeechRecognition: any = null;
try {
  ExpoSpeechRecognition = require('expo-speech-recognition').ExpoSpeechRecognition;
} catch (e) {
  console.warn('Speech Recognition native module not found. Voice input will be disabled.');
}

export class SpeechService {
  private isSpeaking: boolean = false;
  private isListening: boolean = false;

  constructor() {}

  speak(text: string, lang: string = 'en-US', onEnd?: () => void) {
    try {
      this.stopSpeaking();
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
      console.error('TTS Speak Error:', e);
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
        console.error("Speech Recognition Error:", event.error);
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
      console.error('STT Start Error:', error);
      onError(String(error));
    }
  }

  stopListening() {
    if (ExpoSpeechRecognition) {
      ExpoSpeechRecognition.stop();
    }
    this.isListening = false;
  }
}

export const speechService = new SpeechService();
