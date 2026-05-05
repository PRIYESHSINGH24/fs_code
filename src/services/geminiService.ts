import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private fallbackModel: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Using Gemini 2.5 series (Current Standard in 2026)
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    this.fallbackModel = this.genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
  }

  async validateKey() {
    try {
      const result = await this.model.generateContent("test");
      return !!result.response.text();
    } catch (e) {
      try {
        const fallbackResult = await this.fallbackModel.generateContent("test");
        return !!fallbackResult.response.text();
      } catch (err) {
        return false;
      }
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

    const chatHistory = history.map((m: any) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    try {
      const chat = this.model.startChat({
        history: chatHistory,
        generationConfig: { maxOutputTokens: 500 },
      });

      const result = await chat.sendMessage([
        { text: systemPrompt },
        { text: prompt }
      ]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.warn("Gemini 2.5 Flash failed, trying Pro...", error);
      
      try {
        const chatFallback = this.fallbackModel.startChat({
          history: chatHistory,
          generationConfig: { maxOutputTokens: 500 },
        });

        const resultFallback = await chatFallback.sendMessage([
          { text: systemPrompt },
          { text: prompt }
        ]);
        const responseFallback = await resultFallback.response;
        return responseFallback.text();
      } catch (fallbackError) {
        console.error("Gemini 2.5 Pro Error:", fallbackError);
        throw fallbackError;
      }
    }
  }
}
