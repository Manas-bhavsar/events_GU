import { NextResponse } from 'next/server';
import { EventService } from '@/services/EventService';
import { deleteEventAdmin, updateEventAdmin, setEventVisibility } from '@/services/AdminEventService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = EventService.getEventById(id);
    if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(event);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { title, description, date, category, visible } = body || {};
    const { id } = await params;
    // Try atomic admin update first
    let updated = updateEventAdmin(id, { title, description, date, category, visible });
    // Fallback to core update + visibility set
    if (!updated) {
      const updatedCore = EventService.updateEvent(id, { title, description, date, category });
      if (updatedCore && typeof visible === 'boolean') setEventVisibility(id, visible);
    }
    const fresh = EventService.getEventById(id);
    if (!fresh) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(fresh);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { title, description, date, category, visible } = body || {};
    const { id } = await params;

    // Try atomic admin update first
    let updated = updateEventAdmin(id, { title, description, date, category, visible });

    // If only visible provided and admin failed, set visibility directly
    if (!updated && typeof visible === 'boolean' && !title && !description && !date && !category) {
      const ok = setEventVisibility(id, visible);
      if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Fallback to core update for provided fields
    if (!updated && (title !== undefined || description !== undefined || date !== undefined || category !== undefined)) {
      const updatedCore = EventService.updateEvent(id, { title, description, date, category });
      if (updatedCore && typeof visible === 'boolean') setEventVisibility(id, visible);
    }

    const fresh = EventService.getEventById(id);
    if (!fresh) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(fresh);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to patch event' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ok = deleteEventAdmin(id);
    if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
