import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export class SecurityService {
  /**
   * Generates a stable hash from request elements anonymously.
   * OWASP: Sensitive fingerprint parameters hashed without logging.
   */
  generateFingerprint(ip: string, userAgent: string, cookieUuid: string): string {
    const raw = `${ip.split('.')[0]}.${ip.split('.')[1]}.x.x-${userAgent}-${cookieUuid}`;
    return crypto.createHash('sha256').update(raw).digest('hex');
  }

  /**
   * Enforces 180 char limit and basic query shape (no regex, no SQL signatures).
   * Server-side positive input validation as per OWASP guidelines.
   */
  validateSearchQuery(query: string): boolean {
    if (!query || query.length > 180) return false;

    // Detect basic SQL injection patterns, arbitrary punctuation spam, or weird operators
    const maliciousPatterns = [
       /UNION\s+ALL/i,
       /SELECT\s+/i,
       /DROP\s+TABLE/i,
       /OR\s+1\s*=\s*1/i,
       /<script>/i,
       /;/
    ];

    for (const pattern of maliciousPatterns) {
      if (pattern.test(query)) return false;
    }

    return true;
  }

  /**
   * Checks search quota: max 3 heavy searches per 24 hours. Limit 1 for strictest scenarios.
   */
  async checkAnonymousQuota(fingerprintHash: string): Promise<boolean> {
    const now = new Date();
    const windowStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const limitRecord = await prisma.anonymousLimit.findUnique({
      where: { fingerprintHash }
    });

    if (!limitRecord) {
      await prisma.anonymousLimit.create({
        data: {
          fingerprintHash,
          windowStart,
          windowEnd: now,
          searchesUsed: 0
        }
      });
      return true;
    }

    if (limitRecord.windowEnd < windowStart) {
      await prisma.anonymousLimit.update({
        where: { fingerprintHash },
        data: {
          windowStart: now,
          windowEnd: new Date(now.getTime() + 24 * 60 * 60 * 1000),
          searchesUsed: 0,
          lastSeenAt: now
        }
      });
      return true;
    }

    // Max 3 searches per 24h
    if (limitRecord.searchesUsed >= 3) {
      return false; // Quota exceeded
    }

    // Update last seen
    await prisma.anonymousLimit.update({
      where: { fingerprintHash },
      data: { lastSeenAt: now }
    });

    return true;
  }

  /**
   * Called only after successful execution of query to deduct quota.
   */
  async incrementQuota(fingerprintHash: string) {
    await prisma.anonymousLimit.update({
      where: { fingerprintHash },
      data: {
        searchesUsed: { increment: 1 }
      }
    });
  }
}
