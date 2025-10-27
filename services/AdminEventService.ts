import fs from 'fs';
import path from 'path';
import { Event, EventFormData } from '../types/events';
import { EventService } from './EventService';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'events.json');

function readData(): { events: Event[] } {
  try {
    const raw = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { events: [] };
  }
}

function writeData(data: { events: Event[] }): void {
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
}

export function createEventAdmin(
  eventData: EventFormData,
  options?: { visible?: boolean }
): Event {
  const created = EventService.createEvent(eventData);

  // Apply visibility if provided
  if (typeof options?.visible === 'boolean') {
    const data = readData();
    const idx = data.events.findIndex(e => e.id === created.id);
    if (idx !== -1) {
      data.events[idx].visible = options.visible;
      data.events[idx].updatedAt = new Date().toISOString();
      writeData({ events: data.events });
      return data.events[idx];
    }
  }

  return created;
}

export function updateEventAdmin(
  id: string,
  updates: Partial<EventFormData> & { visible?: boolean }
): Event | null {
  const data = readData();
  const idx = data.events.findIndex(e => e.id === id);
  if (idx === -1) return null;

  // Only assign defined fields to avoid clobbering
  const current = data.events[idx];
  const next: Event = {
    ...current,
    ...(updates.title !== undefined ? { title: updates.title } : {}),
    ...(updates.description !== undefined ? { description: updates.description } : {}),
    ...(updates.date !== undefined ? { date: updates.date } : {}),
    ...(updates.category !== undefined ? { category: updates.category } : {}),
    ...(typeof updates.visible === 'boolean' ? { visible: updates.visible } : {}),
    updatedAt: new Date().toISOString(),
  };

  data.events[idx] = next;
  writeData({ events: data.events });
  return next;
}

export function deleteEventAdmin(id: string): boolean {
  return EventService.deleteEvent(id);
}

export function setEventVisibility(id: string, visible: boolean): boolean {
  const data = readData();
  const idx = data.events.findIndex(e => e.id === id);
  if (idx === -1) return false;
  data.events[idx].visible = visible;
  data.events[idx].updatedAt = new Date().toISOString();
  writeData({ events: data.events });
  return true;
}
