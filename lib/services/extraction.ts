/**
 * Uses a hybrid Rules + LLM approach to extract pain points, wishes,
 * and purchase intent from parsed public comments.
 */
export class ExtractionService {

  async extractSignals(text: string) {
    // 1. First-pass rule engine (fast keyword match)
    const keywords = ['wish', 'hate', 'terrible', 'alternative to', 'switching', 'expensive', 'sucks'];
    const lowerText = text.toLowerCase();
    const hasExplicitPain = keywords.some(k => lowerText.includes(k));

    // 2. Mocking the LLM call for the MVP 
    return {
      extractedPain: this.simulateLlmExtraction(text, "pain"),
      extractedIntent: this.simulateLlmExtraction(text, "intent"),
      signalType: hasExplicitPain ? "complaint" : "neutral",
      sentiment: "negative",
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
