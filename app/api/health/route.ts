import { NextResponse } from 'next/server';

// Health check endpoint useful for cron jobs to keep Render instances awake
export async function GET() {
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() }, { status: 200 });
}
