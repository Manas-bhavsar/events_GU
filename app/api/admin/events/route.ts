import { NextResponse } from 'next/server';
import { EventService } from '@/services/EventService';
import { createEventAdmin } from '@/services/AdminEventService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const events = EventService.getAllEvents();
    return NextResponse.json({ events });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, date, category, visible } = body || {};
    const created = createEventAdmin({ title, description, date, category }, { visible });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
