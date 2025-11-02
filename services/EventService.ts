import { Event, EventImage, EventFormData } from '../types/events';
import { prisma } from '@/lib/prisma';

function mapEvent(e: any): Event {
  return {
    id: e.id,
    title: e.title,
    description: e.description,
    date: (e.date instanceof Date ? e.date.toISOString() : e.date),
    category: e.category,
    heroPoster: e.heroPoster || '',
    images: (e.images || []).map((img: any) => ({
      id: img.id,
      filename: img.filename,
      alt: img.alt,
      isHero: Boolean(img.isHero),
      uploadedAt: (img.uploadedAt instanceof Date ? img.uploadedAt.toISOString() : img.uploadedAt),
    })),
    createdAt: (e.createdAt instanceof Date ? e.createdAt.toISOString() : e.createdAt),
    updatedAt: (e.updatedAt instanceof Date ? e.updatedAt.toISOString() : e.updatedAt),
    visible: typeof e.visible === 'boolean' ? e.visible : undefined,
  };
}

export class EventService {
  static async getAllEvents(): Promise<Event[]> {
    const list = await prisma.event.findMany({
      // Homepage and admin list don't need images; fetch lean rows
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        category: true,
        heroPoster: true,
        createdAt: true,
        updatedAt: true,
        visible: true,
      },
      orderBy: { createdAt: 'asc' },
    });
    return list.map(mapEvent);
  }

  static async getVisibleEvents(): Promise<Event[]> {
    const list = await prisma.event.findMany({
      where: { visible: true },
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        category: true,
        heroPoster: true,
        createdAt: true,
        updatedAt: true,
        visible: true,
      },
      orderBy: { createdAt: 'asc' },
    });
    return list.map(mapEvent);
  }

  static async getEventById(id: string): Promise<Event | null> {
    const e = await prisma.event.findUnique({ where: { id }, include: { images: true } });
    return e ? mapEvent(e) : null;
  }

  static async createEvent(eventData: EventFormData): Promise<Event> {
    const id = `event-${Date.now()}`;
    const created = await prisma.event.create({
      data: {
        id,
        title: eventData.title,
        description: eventData.description,
        date: new Date(eventData.date),
        category: eventData.category,
        heroPoster: '',
      },
      include: { images: true },
    });
    return mapEvent(created);
  }

  static async updateEvent(id: string, eventData: Partial<EventFormData>): Promise<Event | null> {
    const exists = await prisma.event.findUnique({ where: { id } });
    if (!exists) return null;
    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...(eventData.title !== undefined ? { title: eventData.title } : {}),
        ...(eventData.description !== undefined ? { description: eventData.description } : {}),
        ...(eventData.date !== undefined ? { date: new Date(eventData.date) } : {}),
        ...(eventData.category !== undefined ? { category: eventData.category } : {}),
      },
      include: { images: true },
    });
    return mapEvent(updated);
  }

  static async deleteEvent(id: string): Promise<boolean> {
    const exists = await prisma.event.findUnique({ where: { id } });
    if (!exists) return false;
    await prisma.event.delete({ where: { id } });
    return true;
  }

  static async addImageToEvent(eventId: string, image: Omit<EventImage, 'id'>): Promise<EventImage | null> {
    const event = await prisma.event.findUnique({ where: { id: eventId }, include: { images: true } });
    if (!event) return null;
    const newId = `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const created = await prisma.eventImage.create({
      data: {
        id: newId,
        filename: image.filename,
        alt: image.alt,
        isHero: Boolean(image.isHero),
        uploadedAt: image.uploadedAt ? new Date(image.uploadedAt) : undefined,
        event: { connect: { id: eventId } },
      },
    });
    // Set heroPoster if first image or isHero marked
    if (image.isHero || (event.images.length === 0)) {
      await prisma.event.update({ where: { id: eventId }, data: { heroPoster: created.filename } });
    }
    return {
      id: created.id,
      filename: created.filename,
      alt: created.alt,
      isHero: created.isHero,
      uploadedAt: (created.uploadedAt as Date).toISOString(),
    };
  }

  static async updateImage(eventId: string, imageId: string, updates: Partial<EventImage>): Promise<EventImage | null> {
    const exists = await prisma.eventImage.findUnique({ where: { id: imageId } });
    if (!exists) return null;
    const updated = await prisma.eventImage.update({
      where: { id: imageId },
      data: {
        ...(updates.filename !== undefined ? { filename: updates.filename } : {}),
        ...(updates.alt !== undefined ? { alt: updates.alt } : {}),
        ...(updates.isHero !== undefined ? { isHero: updates.isHero } : {}),
        ...(updates.uploadedAt !== undefined ? { uploadedAt: new Date(updates.uploadedAt) } : {}),
      },
    });
    if (updates.isHero) {
      await prisma.event.update({ where: { id: eventId }, data: { heroPoster: updated.filename } });
    }
    return {
      id: updated.id,
      filename: updated.filename,
      alt: updated.alt,
      isHero: updated.isHero,
      uploadedAt: (updated.uploadedAt as Date).toISOString(),
    };
  }

  static async deleteImage(eventId: string, imageId: string): Promise<boolean> {
    const img = await prisma.eventImage.findUnique({ where: { id: imageId } });
    if (!img) return false;
    await prisma.eventImage.delete({ where: { id: imageId } });
    // If deleted was heroPoster, set a new one
    const remaining = await prisma.eventImage.findMany({ where: { eventId } });
    const newHero = remaining[0]?.filename || '';
    if ((await prisma.event.findUnique({ where: { id: eventId } }))?.heroPoster === img.filename) {
      await prisma.event.update({ where: { id: eventId }, data: { heroPoster: newHero } });
    }
    return true;
  }

  static async setHeroPoster(eventId: string, imageId: string): Promise<boolean> {
    const img = await prisma.eventImage.findUnique({ where: { id: imageId } });
    if (!img) return false;
    await prisma.eventImage.updateMany({ where: { eventId }, data: { isHero: false } });
    await prisma.eventImage.update({ where: { id: imageId }, data: { isHero: true } });
    await prisma.event.update({ where: { id: eventId }, data: { heroPoster: img.filename } });
    return true;
  }
}
