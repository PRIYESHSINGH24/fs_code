import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;
  private model: string = "gemini-3-flash-preview";

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateResponse(
    prompt: string,
    history: { role: "user" | "model"; parts: { text: string }[] }[],
    systemInstruction: string
  ) {
    try {
      const chat = this.ai.chats.create({
        model: this.model,
        config: {
          systemInstruction,
        },
        history,
      });

      const result = await chat.sendMessage({
        message: prompt,
      });

      return result.text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  async validateKey() {
    try {
      // Just a simple check call
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: "Hi",
      });
      return !!response.text;
    } catch (error) {
      return false;
    }
  }
}
