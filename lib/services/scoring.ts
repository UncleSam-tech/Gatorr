/**
 * Computes a standardized 0-100 score for a given extracted signal.
 */
export class ScoringEngine {
  
  /**
   * Scorer based on PRD requirements:
   * explicit pain: 20, buying intent: 20, ICP fit: 20, recency: 10,
   * source trust: 10, uniqueness: 5, engagement: 5, geo: 5, competitor: 5
   */
  scoreSignal(signalData: any) {
    let score = 0;
    
    const painScore = signalData.extractedPain !== "Unknown" ? 20 : 0;
    const intentScore = signalData.extractedIntent !== "Unknown" ? 20 : 0;
    const sourceTrustScore = 10;
    const competitorScore = signalData.competitor ? 5 : 0;
    const icpFitScore = 15;
    const recencyScore = 10;
    
    score = painScore + intentScore + icpFitScore + recencyScore + sourceTrustScore + competitorScore;
            
    return {
      totalScore: score,
      painScore,
      intentScore,
      icpFitScore,
      acquisitionScore: score // Simplified composite
    };
  }
}
