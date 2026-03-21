import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function sanitizeCsvField(field: string | null): string {
  if (!field) return '""';
  // Escape inner quotes
  let cleaned = field.replace(/"/g, '""');
  // SECURITY PATCH: Mitigate CSV Formula Injection by prepending a single quote
  // if the field starts with a formula character (=, +, -, @)
  if (/^[=+\-@]/.test(cleaned)) {
    cleaned = "'" + cleaned;
  }
  return `"${cleaned}"`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');
    const format = searchParams.get('format') || 'csv';

    // SECURITY: Input validation
    if (!workspaceId || typeof workspaceId !== 'string') {
      return NextResponse.json({ error: 'Valid workspaceId is required' }, { status: 400 });
    }

    const signals = await prisma.signal.findMany({
      where: { workspaceId },
      orderBy: { acquisitionScore: 'desc' }
    });

    if (format === 'json') {
      return NextResponse.json({ signals });
    }

    // Generate CSV securely
    if (format === 'csv') {
      const headers = ['ID', 'Source URL', 'Pain Score', 'Intent Score', 'Acquisition Score', 'Original Text', 'Pain Info', 'Intent Info'];
      const rows = signals.map((s: any) => [
        s.id,
        s.sourceUrl,
        s.painScore,
        s.intentScore,
        s.acquisitionScore,
        sanitizeCsvField(s.originalText),
        sanitizeCsvField(s.extractedPain),
        sanitizeCsvField(s.extractedIntent)
      ]);

      const csvContent = [headers.join(','), ...rows.map((r: any[]) => r.join(','))].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="gatorr_signals_export.csv"'
        }
      });
    }

    return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
