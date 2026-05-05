import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async validateKey() {
    try {
      const result = await this.model.generateContent("test");
      return !!result.response.text();
    } catch (e) {
      return false;
    }
  }

  async testConnection() {
    return this.validateKey();
  }

  async generateResponse(prompt: string, history: any[], mode: string, tone: string, language: string = 'en-US') {
    const languageInstruction = language === 'hi-IN' ? "You MUST respond ONLY in Hindi (Hindustani) script." : "Respond in English.";
    
    const systemPrompt = `You are a professional ${mode}. 
    Your personality is ${tone}. 
    ${languageInstruction}
    Keep your responses concise, friendly, and helpful. 
    Do not use complex formatting like markdown headers. Use plain text suitable for speech.`;

    const chat = this.model.startChat({
      history: history.map((m: any) => ({
        role: m.role,
        parts: [{ text: m.text }]
      })),
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    try {
      const result = await chat.sendMessage([
        { text: systemPrompt },
        { text: prompt }
      ]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini Error:", error);
      throw error;
    }
  }
}
