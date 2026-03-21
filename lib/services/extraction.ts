import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Uses a hybrid Rules + LLM approach to extract pain points, wishes,
 * and purchase intent from parsed public comments.
 */
export class ExtractionService {

  async extractSignals(text: string) {
    // 1. First attempt to use the Gemini API if configured
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `Analyze this text and extract pain points and purchase intent. Respond in STRICT JSON format with exactly these string fields: "extractedPain" (specific problems the user is facing, or "Unknown"), "extractedIntent" (likelihood of purchasing a solution or switching, or "Unknown"), "signalType" ("complaint", "neutral", "praise"), "sentiment" ("positive", "negative", "neutral"), and "competitor" (string explicitly mentioned rival software, or null). Text: "${text}"`;
        
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            extractedPain: parsed.extractedPain || "Unknown",
            extractedIntent: parsed.extractedIntent || "Unknown",
            signalType: parsed.signalType || "neutral",
            sentiment: parsed.sentiment || "neutral",
            competitor: parsed.competitor || null
          };
        }
      } catch (error) {
        console.error("Gemini AI extraction failed. Falling back to rule engine.", error);
      }
    }

    // 2. Fallback rule engine (if no API string or failure)
    const keywords = ['wish', 'hate', 'terrible', 'alternative to', 'switching', 'expensive', 'sucks'];
    const lowerText = text.toLowerCase();
    const hasExplicitPain = keywords.some(k => lowerText.includes(k));

    return {
      extractedPain: this.simulateLlmExtraction(text, "pain"),
      extractedIntent: this.simulateLlmExtraction(text, "intent"),
      signalType: hasExplicitPain ? "complaint" : "neutral",
      sentiment: hasExplicitPain ? "negative" : "neutral",
      competitor: this.extractPattern(text, /(vs|alternative to|better than)\s+([A-Za-z0-9]+)/i)
    };
  }

  private simulateLlmExtraction(text: string, type: string) {
    if (type === "pain" && text.toLowerCase().includes("terrible")) return "User hates current tool UX.";
    if (type === "intent" && text.toLowerCase().includes("switching")) return "Actively seeking alternatives.";
    return "Unknown";
  }

  private extractPattern(text: string, regex: RegExp) {
    const match = text.match(regex);
    return match ? match[2] : null;
  }
}
