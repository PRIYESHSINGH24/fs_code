import * as Speech from 'expo-speech';
import { ExpoSpeechRecognition } from 'expo-speech-recognition';

export class SpeechService {
  private isSpeaking: boolean = false;
  private isListening: boolean = false;

  constructor() {}

  speak(text: string, lang: string = 'en-US', onEnd?: () => void) {
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
  }

  stopSpeaking() {
    Speech.stop();
    this.isSpeaking = false;
  }

  async startListening(lang: string = 'en-US', onResult: (text: string) => void, onError: (err: any) => void) {
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

      const resultListener = ExpoSpeechRecognition.addListener("result", (event) => {
        const transcript = event.results[0]?.transcript;
        if (transcript) {
          onResult(transcript);
        }
      });

      const errorListener = ExpoSpeechRecognition.addListener("error", (event) => {
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
    ExpoSpeechRecognition.stop();
    this.isListening = false;
  }
}

export const speechService = new SpeechService();
