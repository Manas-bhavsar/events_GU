import fs from "fs"
import path from "path"
import { PrismaEventService } from "./PrismaEventService"
import type { EventImage } from "@/types/events"

const PUBLIC_IMAGES_DIR = path.join(process.cwd(), "public", "images")

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function uniqueFilename(original: string): string {
  const base = path.basename(original).replace(/[^a-zA-Z0-9._-]/g, "_")
  const ext = path.extname(base)
  const name = path.basename(base, ext)
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  return `${name}-${stamp}${ext || ""}`
}

export async function savePrismaEventImage(
  eventId: string,
  fileBuffer: Buffer,
  originalFilename: string,
  options?: { alt?: string; isHero?: boolean },
): Promise<EventImage | null> {
  ensureDir(PUBLIC_IMAGES_DIR)
  const filename = uniqueFilename(originalFilename || "upload")
  const dest = path.join(PUBLIC_IMAGES_DIR, filename)
  fs.writeFileSync(dest, fileBuffer)

  const newImage = await PrismaEventService.addImageToEvent(eventId, {
    filename,
    alt: options?.alt ?? "",
    isHero: Boolean(options?.isHero),
    uploadedAt: new Date().toISOString(),
  })

  return newImage
}

export async function deletePrismaEventImage(eventId: string, imageId: string): Promise<boolean> {
  const event = await PrismaEventService.getEventById(eventId)
  if (!event) return false
  const img = event.images.find((i) => i.id === imageId)
  if (!img) return false

  const filePath = path.join(PUBLIC_IMAGES_DIR, img.filename)
  const ok = await PrismaEventService.deleteImage(eventId, imageId)
  if (ok && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath)
    } catch {}
  }
  return ok
}

// Keep old functions for backward compatibility
export async function saveEventImage(
  eventId: string,
  fileBuffer: Buffer,
  originalFilename: string,
  options?: { alt?: string; isHero?: boolean },
): Promise<EventImage | null> {
  return savePrismaEventImage(eventId, fileBuffer, originalFilename, options)
}

export function deleteEventImage(eventId: string, imageId: string): boolean {
  // This is now async, but kept for compatibility
  deletePrismaEventImage(eventId, imageId)
  return true
}
