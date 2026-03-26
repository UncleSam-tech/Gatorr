import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { SecurityService } from '@/lib/services/security';
import { CrawlerService } from '@/lib/services/crawler';
import { ParserService } from '@/lib/services/parser';
import { ExtractionService } from '@/lib/services/extraction';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = typeof body.query === 'string' ? body.query.trim() : '';
    const cookieUuid = typeof body.cookieUuid === 'string' ? body.cookieUuid : 'anonymous-' + Date.now();
    
    // 1. Validation Setup
    const security = new SecurityService();

    if (!security.validateSearchQuery(query)) {
      return NextResponse.json({ error: 'Invalid or overly complex query rejected by positive validation policy.' }, { status: 400 });
    }

    // Retrieve IPs mapped properly (or simulating with fallback)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('remote-addr') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // 2. Anonymous Quota Hashing
    const fingerprintHash = security.generateFingerprint(ip, userAgent, cookieUuid);

    const canSearch = await security.checkAnonymousQuota(fingerprintHash);
    if (!canSearch) {
      return NextResponse.json({ error: 'Anonymous search quota exceeded (3 heavy searches per 24h).' }, { status: 429 });
    }

    // 3. Cache Match Check
    const queryHash = crypto.createHash('sha1').update(query.toLowerCase()).digest('hex');
    const cached = await prisma.resultCache.findUnique({ where: { queryHash } });
    
    if (cached && cached.expiresAt > new Date()) {
      return new NextResponse(cached.responseJson, { 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // 4. Budgeted Search Execution
    // Create the search run log (1 DB write)
    const run = await prisma.searchRun.create({
      data: {
        fingerprintHash,
        queryText: query,
        queryHash,
        status: 'processing',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 day TTL
      }
    });

    const crawler = new CrawlerService();
    const parser = new ParserService();
    const extractor = new ExtractionService();

    // We build comprehensive discovery using both specialized endpoints and universal meta-search.
    const encodedQuery = encodeURIComponent(query);
    const intentQuery = encodeURIComponent(`${query} "alternative" OR "issue" OR "review"`);
    const seedUrls = [
      `https://old.reddit.com/search?q=${encodedQuery}`,                                     // Reddit Discussions
      `https://hn.algolia.com/api/v1/search?query=${encodedQuery}`,                          // Hacker News JSON
      `https://github.com/search?q=${encodedQuery}&type=issues`,                             // GitHub Issues
      `https://html.duckduckgo.com/html/?q=${intentQuery}`,                                  // Open Web meta-search via DDG
      `https://news.google.com/rss/search?q=${encodedQuery}+when:1y&hl=en-US&gl=US&ceid=US:en`, // Google News Search (XML)
      `https://api.stackexchange.com/2.3/search?order=desc&sort=relevance&intitle=${encodedQuery}&site=stackoverflow` // StackOverflow JSON
    ];
    
    let savedCount = 0;
    const finalResults = [];

    // Fetch budget: at most 5 pages.
    for (const seedUrl of seedUrls.slice(0, 5)) {
      let crawledData;
      try {
        crawledData = await crawler.fetchPage(seedUrl, 'anon-workspace-bypassed');
      } catch (err) {
        console.warn(`Crawler failed for seed ${seedUrl}:`, err);
        continue; // Skip this seed and try the next one
      }
      
      const chunks = parser.splitIntoComments(crawledData.mainText);
      
      for (const chunk of chunks) {
        // Result Storage Budget: Max 10 results saved per request
        if (savedCount >= 10) break;

        const extracted = await extractor.extractSignals(chunk);
        
        if (extracted.signalType !== 'neutral') {
          const result = await prisma.searchResult.create({
            data: {
              searchRunId: run.id,
              title: `Signal extracted from ${new URL(seedUrl).hostname}`,
              sourceUrl: seedUrl,
              domain: new URL(seedUrl).hostname,
              snippet: chunk.substring(0, 500),
              summary: extracted.extractedPain || 'Unmet need detected',
              signalType: extracted.signalType || 'Unknown',
              competitor: extracted.competitor,
              painScore: 20,
              intentScore: 20,
              acquisitionScore: 40,
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
          });
          finalResults.push(result);
          savedCount++;
        }
      }
    }

    // End Search Run + Increment Quota limit
    await prisma.searchRun.update({
      where: { id: run.id },
      data: { status: 'completed', finishedAt: new Date(), resultCount: savedCount }
    });
    
    await security.incrementQuota(fingerprintHash);

    // Write JSON Cache
    const jsonResponse = JSON.stringify({ success: true, cached: false, data: finalResults });
    await prisma.resultCache.create({
      data: {
        queryHash,
        normalizedQuery: query.toLowerCase(),
        responseJson: jsonResponse,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h cache TTL
      }
    });

    return new NextResponse(jsonResponse, { 
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
