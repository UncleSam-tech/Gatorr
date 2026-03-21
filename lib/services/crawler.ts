/**
 * Crawler engine. In production, this would use Crawlee or Playwright.
 * For this MVP, we use native fetch with generic Cheerio parsing, adhering
 * to the PRD requirement for Open Web Crawl Mode.
 */
import * as cheerio from 'cheerio';
export class CrawlerService {
  constructor() {}

  async fetchPage(url: string, workspaceId: string) {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;

      // SECURITY PATCH: Strict SSRF (Server-Side Request Forgery)
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        throw new Error('Security Error: Invalid URL protocol.');
      }
      
      // Block non-standard ports to prevent port scanning
      if (urlObj.port && !['80', '443'].includes(urlObj.port)) {
        throw new Error('Security Error: Arbitrary ports disabled.');
      }
      
      const isInternal = domain === 'localhost' || domain === '127.0.0.1' || domain === '::1' || 
                         domain.startsWith('10.') || domain.startsWith('192.168.') || 
                         domain.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./) ||
                         domain.startsWith('127.') || // 127.0.0.0/8
                         domain === '169.254.169.254' || domain === 'metadata.google.internal';
      if (isInternal) {
        throw new Error('Security Error: Unsafe internal URL requested (SSRF blocked).');
      }

      // We bypass Source Registry for generalized anonymous search in V1
      // as the query generates exact domains, but we enforce hard timeouts instead.
      // Simple fetch for crawlable open web with strict 5s timeout & size abort
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'GatorrBot/1.0 (+http://gatorr.com/bot)',
          'Accept': 'text/html,application/xhtml+xml,application/xml'
        }
      });
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
      }

      // Prevent downloading massive files (Limit to ~2MB)
      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength) > 2000000) {
         throw new Error(`Payload too large (>2MB). Request aborted.`);
      }

      const html = await response.text();
      if (html.length > 2000000) throw new Error('Payload length exceeded 2MB.');
      const snapshotId = Math.random().toString(36).substring(7); // Simulate saving raw HTML to snapshot store
      
      const parsedData = this.parseHtml(html);
      
      return {
        url,
        snapshotId,
        title: parsedData.title,
        mainText: parsedData.mainText,
        links: parsedData.links,
        timestamp: new Date()
      };
    } catch (error: any) {
      console.error(`Crawler Error for ${url}:`, error.message);
      throw error;
    }
  }

  private parseHtml(html: string) {
    const $ = cheerio.load(html);
    
    // Remove boilerplate (nav, footer, script, style)
    $('script, style, nav, footer, header, aside').remove();

    const title = $('title').text().trim();
    // basic main body text approximation
    let mainText = $('main').text() || $('article').text() || $('body').text();
    mainText = mainText.replace(/\s+/g, ' ').trim();

    const links: string[] = [];
    $('a[href]').each((_: any, el: any) => {
      links.push($(el).attr('href')!);
    });

    return { title, mainText, links };
  }
}
