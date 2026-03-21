/**
 * Text parsing service to clean HTML text into consumable data chunks
 * suitable for LLM extraction and clustering.
 */

export class ParserService {
  /**
   * Cleans text to remove boilerplate and normalize.
   */
  cleanText(rawText: string): string {
    // Basic deduplication of whitespaces
    return rawText.replace(/\s+/g, ' ').trim();
  }

  /**
   * Approximates thread hierarchy / comment separation if the raw text 
   * has standard delimiter patterns. For MVP, we pass whole text chunks.
   */
  splitIntoComments(rawText: string): string[] {
    // In a real implementation with cheerio, we'd grab specific `.comment` elements.
    // Here we simulate it by splitting on common structural boundaries or just wrapping whole text.
    return [this.cleanText(rawText)];
  }

  /**
   * Normalizes timestamps extracted from text.
   */
  normalizeTimestamp(rawTime: string): Date {
    const parsed = new Date(rawTime);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }
}
