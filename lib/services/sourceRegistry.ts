import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SourceRegistryService {
  /**
   * Retrieves the extraction policy for a given domain within a workspace.
   */
  async getSourcePolicy(domain: string, workspaceId: string) {
    const source = await prisma.source.findFirst({
      where: {
        workspaceId,
        domain
      }
    });

    if (!source || !source.isActive) {
      return { 
        status: 'disabled', 
        mode: 'none', 
        reason: 'Source not registered or inactive for this workspace' 
      };
    }

    return {
      status: 'active',
      sourceClass: source.sourceClass, // e.g. "Crawlable Open Web", "Restricted"
      crawlMode: source.crawlMode,     // e.g. "crawl", "assist_only"
      allowedPaths: source.allowedPaths,
      blockedPaths: source.blockedPaths
    };
  }

  /**
   * Adds or updates a domain policy to the registry.
   */
  async registerSource(workspaceId: string, domain: string, sourceClass: string, crawlMode: string) {
    return prisma.source.create({
      data: {
        workspaceId,
        domain,
        sourceClass,
        crawlMode,
        allowedPaths: [],
        blockedPaths: []
      }
    });
  }
}
