import { NextResponse } from 'next/server';
import { CrawlerService } from '@/lib/services/crawler';
import { ParserService } from '@/lib/services/parser';
import { ExtractionService } from '@/lib/services/extraction';
import { ScoringEngine } from '@/lib/services/scoring';
import { ClusteringService } from '@/lib/services/clustering';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = typeof body.url === 'string' ? body.url.trim() : null;
    const workspaceId = typeof body.workspaceId === 'string' ? body.workspaceId.trim() : null;

    // SECURITY PATCH: Strict type checking and length limits to prevent injections
    if (!url || !workspaceId) {
      return NextResponse.json({ error: 'Valid URL and workspaceId strings are required.' }, { status: 400 });
    }
    
    if (url.length > 2048 || workspaceId.length > 255) {
      return NextResponse.json({ error: 'Security constraint: Input length exceeds maximum allowed.' }, { status: 400 });
    }

    const crawler = new CrawlerService();
    const parser = new ParserService();
    const extractor = new ExtractionService();
    const scorer = new ScoringEngine();
    const clusterer = new ClusteringService();

    // 1. Crawl
    const crawledData = await crawler.fetchPage(url, workspaceId);

    // 2. Parse (mimics extracting multiple comments/threads)
    const chunks = parser.splitIntoComments(crawledData.mainText);

    const savedSignals = [];

    // 3. Extract & Score
    for (const chunk of chunks) {
      const extracted = await extractor.extractSignals(chunk);
      const scores = scorer.scoreSignal(extracted);

      // Only save if it's not noise (score threshold >= 40) or if a strong complaint is detected
      if (scores.totalScore >= 40 || extracted.signalType !== 'neutral') {
        const signal = await prisma.signal.create({
          data: {
            workspaceId,
            sourceUrl: url,
            originalText: chunk.substring(0, 1000), // Trim for safety
            extractedPain: extracted.extractedPain,
            extractedIntent: extracted.extractedIntent,
            signalType: extracted.signalType,
            sentiment: extracted.sentiment,
            competitor: extracted.competitor,
            
            painScore: scores.painScore,
            intentScore: scores.intentScore,
            icpFitScore: scores.icpFitScore,
            acquisitionScore: scores.acquisitionScore,
            sourceConfidence: 80, // High confidence for manual imports
          }
        });

        // 4. Cluster
        await clusterer.clusterSignal(signal.id, chunk);

        savedSignals.push(signal);
      }
    }

    return NextResponse.json({ 
      success: true, 
      processed: chunks.length, 
      saved: savedSignals.length 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
