export class SpeechService {
  private synthesis: SpeechSynthesis;
  private recognition: any;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.synthesis = window.speechSynthesis;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
    
    // Load voices
    this.loadVoices();
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  private loadVoices() {
    this.voices = this.synthesis.getVoices();
  }

  speak(text: string, lang: string = 'en-US', onEnd?: () => void) {
    this.synthesis.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    
    // Pick a voice if available
    if (this.voices.length > 0) {
      // Try to find a voice that matches the language
      const preferred = this.voices.find(v => v.lang.startsWith(lang.split('-')[0]) && (v.name.includes('Google') || v.name.includes('Natural'))) 
        || this.voices.find(v => v.lang.startsWith(lang.split('-')[0]))
        || this.voices.find(v => v.name.includes('Google') || v.name.includes('Natural')) 
        || this.voices[0];
      
      utterance.voice = preferred;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    
    this.synthesis.speak(utterance);
  }

  stopSpeaking() {
    this.synthesis.cancel();
  }

  startListening(lang: string = 'en-US', onResult: (text: string) => void, onError: (err: any) => void) {
    if (!this.recognition) {
      onError("Speech recognition not supported in this browser.");
      return;
    }

    this.recognition.lang = lang;

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    this.recognition.onerror = (event: any) => {
      onError(event.error);
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.error("Recognition start error:", e);
    }
  }

  stopListening() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}

export const speechService = new SpeechService();
