import fs from 'fs';
import path from 'path';
import { EventService } from './EventService';
import type { EventImage } from '@/types/events';

const PUBLIC_IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function uniqueFilename(original: string): string {
  const base = path.basename(original).replace(/[^a-zA-Z0-9._-]/g, '_');
  const ext = path.extname(base);
  const name = path.basename(base, ext);
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `${name}-${stamp}${ext || ''}`;
}

export async function saveEventImage(
  eventId: string,
  fileBuffer: Buffer,
  originalFilename: string,
  options?: { alt?: string; isHero?: boolean }
): Promise<EventImage | null> {
  ensureDir(PUBLIC_IMAGES_DIR);
  const filename = uniqueFilename(originalFilename || 'upload');
  const dest = path.join(PUBLIC_IMAGES_DIR, filename);
  fs.writeFileSync(dest, fileBuffer);

  const newImage = await EventService.addImageToEvent(eventId, {
    filename,
    alt: options?.alt ?? '',
    isHero: Boolean(options?.isHero),
    uploadedAt: new Date().toISOString(),
  });

  return newImage;
}

export async function deleteEventImage(eventId: string, imageId: string): Promise<boolean> {
  const event = await EventService.getEventById(eventId);
  if (!event) return false;
  const img = event.images.find(i => i.id === imageId);
  if (!img) return false;

  const filePath = path.join(PUBLIC_IMAGES_DIR, img.filename);
  const ok = await EventService.deleteImage(eventId, imageId);
  if (ok && fs.existsSync(filePath)) {
    try { fs.unlinkSync(filePath); } catch {}
  }
  return ok;
}
