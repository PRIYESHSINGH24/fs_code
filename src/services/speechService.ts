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

  async speak(text: string, lang: string = 'en-US', onEnd?: () => void) {
    try {
      console.log(`[Audio] Attempting to speak in ${lang}: ${text.substring(0, 30)}...`);
      
      // Stop any current speech
      await Speech.stop();
      
      const options = {
        language: lang,
        pitch: 1.0,
        rate: 1.0,
        onDone: () => {
          console.log('[Audio] Speech finished successfully');
          this.isSpeaking = false;
          if (onEnd) onEnd();
        },
        onStopped: () => {
          console.log('[Audio] Speech stopped');
          this.isSpeaking = false;
        },
        onError: (error: any) => {
          console.error('[Audio] Speech error:', error);
          this.isSpeaking = false;
        }
      };

      Speech.speak(text, options);
      this.isSpeaking = true;
    } catch (e) {
      console.error('[Audio] TTS Critical Error:', e);
    }
  }

  stopSpeaking() {
    try {
      Speech.stop();
      this.isSpeaking = false;
    } catch (e) {
      console.error('[Audio] Stop error:', e);
    }
  }

  async startListening(lang: string = 'en-US', onResult: (text: string) => void, onError: (err: any) => void) {
    if (!ExpoSpeechRecognition) {
      console.error('[Audio] STT not supported in this environment');
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
        console.error("[Audio] STT Error:", event.error);
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
      console.error('[Audio] STT Start Error:', error);
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
