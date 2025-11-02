import { Event, EventFormData } from '../types/events';
import { EventService } from './EventService';
import { prisma } from '@/lib/prisma';

export async function createEventAdmin(
  eventData: EventFormData,
  options?: { visible?: boolean }
): Promise<Event> {
  const created = await EventService.createEvent(eventData);

  if (typeof options?.visible === 'boolean') {
    await prisma.event.update({
      where: { id: created.id },
      data: { visible: options.visible },
    });
    const fresh = await EventService.getEventById(created.id);
    return fresh as Event;
  }

  return created;
}

export async function updateEventAdmin(
  id: string,
  updates: Partial<EventFormData> & { visible?: boolean }
): Promise<Event | null> {
  const exists = await prisma.event.findUnique({ where: { id } });
  if (!exists) return null;

  await prisma.event.update({
    where: { id },
    data: {
      ...(updates.title !== undefined ? { title: updates.title } : {}),
      ...(updates.description !== undefined ? { description: updates.description } : {}),
      ...(updates.date !== undefined ? { date: new Date(updates.date) } : {}),
      ...(updates.category !== undefined ? { category: updates.category } : {}),
      ...(typeof updates.visible === 'boolean' ? { visible: updates.visible } : {}),
    },
  });

  return await EventService.getEventById(id);
}

export async function deleteEventAdmin(id: string): Promise<boolean> {
  return await EventService.deleteEvent(id);
}

export async function setEventVisibility(id: string, visible: boolean): Promise<boolean> {
  const exists = await prisma.event.findUnique({ where: { id } });
  if (!exists) return false;
  await prisma.event.update({ where: { id }, data: { visible } });
  return true;
}
