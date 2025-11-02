/* Prisma seed script: imports data/events.json into PostgreSQL.
   Images are stored as filenames only; actual files live in public/ or public/images.
*/
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const jsonPath = path.join(process.cwd(), 'data', 'events.json');
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Data file not found at ${jsonPath}`);
  }
  const raw = fs.readFileSync(jsonPath, 'utf8');
  const parsed = JSON.parse(raw || '{}');
  const events = Array.isArray(parsed.events) ? parsed.events : [];

  console.log(`Seeding ${events.length} events...`);

  for (const ev of events) {
    const {
      id,
      title,
      description,
      date,
      category,
      heroPoster = '',
      location = null,
      visible = null,
      createdAt,
      updatedAt,
      images = [],
    } = ev || {};

    if (!id || !title || !description || !date || !category) {
      console.warn(`Skipping event with missing required fields: ${id}`);
      continue;
    }

    // Upsert Event without images first
    await prisma.event.upsert({
      where: { id },
      create: {
        id,
        title,
        description,
        date: new Date(date),
        category,
        heroPoster,
        location: location ?? undefined,
        visible: typeof visible === 'boolean' ? visible : undefined,
        createdAt: createdAt ? new Date(createdAt) : undefined,
        updatedAt: updatedAt ? new Date(updatedAt) : undefined,
      },
      update: {
        title,
        description,
        date: new Date(date),
        category,
        heroPoster,
        location: location ?? undefined,
        visible: typeof visible === 'boolean' ? visible : undefined,
        // If updatedAt exists in JSON use it, else let DB auto set via @updatedAt when app updates later
        updatedAt: updatedAt ? new Date(updatedAt) : undefined,
      },
    });

    // Upsert each image
    for (const img of images) {
      const {
        id: imageId,
        filename,
        alt = '',
        isHero = false,
        uploadedAt,
      } = img || {};
      if (!imageId || !filename) {
        console.warn(`  Skipping image with missing fields on event ${id}`);
        continue;
      }
      await prisma.eventImage.upsert({
        where: { id: imageId },
        create: {
          id: imageId,
          filename,
          alt,
          isHero: Boolean(isHero),
          uploadedAt: uploadedAt ? new Date(uploadedAt) : undefined,
          event: { connect: { id } },
        },
        update: {
          filename,
          alt,
          isHero: Boolean(isHero),
          uploadedAt: uploadedAt ? new Date(uploadedAt) : undefined,
          event: { connect: { id } },
        },
      });
    }

    console.log(`  Upserted event ${id} with ${images.length} image(s)`);
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
