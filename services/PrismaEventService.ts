import { prisma } from "@/lib/prisma"
import type { Event, EventImage, EventFormData } from "@/types/events"

export class PrismaEventService {
  static async getAllEvents(): Promise<Event[]> {
    const events = await prisma.event.findMany({
      include: { images: true },
      orderBy: { createdAt: "desc" },
    })
    return events.map((e) => ({
      ...e,
      date: e.date.toISOString(),
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
    }))
  }

  static async getEventById(id: string): Promise<Event | null> {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { images: true },
    })
    if (!event) return null
    return {
      ...event,
      date: event.date.toISOString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    }
  }

  static async createEvent(eventData: EventFormData): Promise<Event> {
    const event = await prisma.event.create({
      data: {
        title: eventData.title,
        description: eventData.description,
        date: new Date(eventData.date),
        category: eventData.category,
        heroPoster: "",
        visible: true,
      },
      include: { images: true },
    })
    return {
      ...event,
      date: event.date.toISOString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    }
  }

  static async updateEvent(id: string, eventData: Partial<EventFormData>): Promise<Event | null> {
    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(eventData.title && { title: eventData.title }),
        ...(eventData.description && { description: eventData.description }),
        ...(eventData.date && { date: new Date(eventData.date) }),
        ...(eventData.category && { category: eventData.category }),
      },
      include: { images: true },
    })
    return {
      ...event,
      date: event.date.toISOString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    }
  }

  static async deleteEvent(id: string): Promise<boolean> {
    try {
      await prisma.event.delete({ where: { id } })
      return true
    } catch {
      return false
    }
  }

  static async addImageToEvent(eventId: string, image: Omit<EventImage, "id">): Promise<EventImage | null> {
    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event) return null

    const newImage = await prisma.eventImage.create({
      data: {
        filename: image.filename,
        alt: image.alt,
        isHero: image.isHero || false,
        eventId,
      },
    })

    if (image.isHero || !event.heroPoster) {
      await prisma.event.update({
        where: { id: eventId },
        data: { heroPoster: newImage.filename },
      })
    }

    return {
      ...newImage,
      uploadedAt: newImage.uploadedAt.toISOString(),
    }
  }

  static async updateImage(eventId: string, imageId: string, updates: Partial<EventImage>): Promise<EventImage | null> {
    const image = await prisma.eventImage.update({
      where: { id: imageId },
      data: {
        ...(updates.alt && { alt: updates.alt }),
        ...(typeof updates.isHero === "boolean" && { isHero: updates.isHero }),
      },
    })

    if (updates.isHero) {
      await prisma.event.update({
        where: { id: eventId },
        data: { heroPoster: image.filename },
      })
    }

    return {
      ...image,
      uploadedAt: image.uploadedAt.toISOString(),
    }
  }

  static async deleteImage(eventId: string, imageId: string): Promise<boolean> {
    try {
      const image = await prisma.eventImage.findUnique({ where: { id: imageId } })
      if (!image) return false

      await prisma.eventImage.delete({ where: { id: imageId } })

      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: { images: true },
      })

      if (event && event.heroPoster === image.filename) {
        const newHero = event.images.length > 0 ? event.images[0].filename : ""
        await prisma.event.update({
          where: { id: eventId },
          data: { heroPoster: newHero },
        })
      }

      return true
    } catch {
      return false
    }
  }

  static async setHeroPoster(eventId: string, imageId: string): Promise<boolean> {
    try {
      const image = await prisma.eventImage.findUnique({ where: { id: imageId } })
      if (!image) return false

      await prisma.eventImage.updateMany({
        where: { eventId },
        data: { isHero: false },
      })

      await prisma.eventImage.update({
        where: { id: imageId },
        data: { isHero: true },
      })

      await prisma.event.update({
        where: { id: eventId },
        data: { heroPoster: image.filename },
      })

      return true
    } catch {
      return false
    }
  }

  static async toggleVisibility(id: string, visible: boolean): Promise<Event | null> {
    const event = await prisma.event.update({
      where: { id },
      data: { visible },
      include: { images: true },
    })
    return {
      ...event,
      date: event.date.toISOString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    }
  }
}
