# Quick Start steps
# Quick Start Guide - Events @ GU with Prisma

## ⚡ 5-Minute Setup

### Step 1: Install
\`\`\`bash
npm install
\`\`\`

### Step 2: Configure Database
Create `.env.local`:
\`\`\`env
DATABASE_URL="postgresql://postgres:password@localhost:5432/events_gu"
\`\`\`

### Step 3: Initialize
\`\`\`bash
npm run prisma:generate
npm run prisma:migrate
\`\`\`

### Step 4: Run
\`\`\`bash
npm run dev
\`\`\`

### Step 5: Access
- **Home:** http://localhost:3000
- **Admin:** http://localhost:3000/admin
- **Prisma Studio:** `npm run prisma:studio`

---

## 🗄️ Database Setup Options

### Option A: Local PostgreSQL
\`\`\`bash
# Install PostgreSQL
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql
# Windows: Download from postgresql.org

# Start PostgreSQL
# macOS: brew services start postgresql
# Ubuntu: sudo service postgresql start

# Create database
createdb events_gu

# Set DATABASE_URL
DATABASE_URL="postgresql://postgres:password@localhost:5432/events_gu"
\`\`\`

### Option B: Docker PostgreSQL
\`\`\`bash
docker run --name events-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=events_gu \
  -p 5432:5432 \
  -d postgres:15

# DATABASE_URL="postgresql://postgres:password@localhost:5432/events_gu"
\`\`\`

### Option C: Neon (Cloud)
1. Go to https://neon.tech
2. Create account and project
3. Copy connection string
4. Set as DATABASE_URL

### Option D: SQLite (Development)
\`\`\`env
DATABASE_URL="file:./prisma/dev.db"
\`\`\`

---

## 📋 Common Tasks

### Create Event
\`\`\`bash
# Via Admin Panel
1. Go to http://localhost:3000/admin
2. Click "Add Event"
3. Fill form and submit
\`\`\`

### Upload Images
\`\`\`bash
# Via Admin Panel
1. Edit event
2. Scroll to "Images" section
3. Click "Upload"
4. Select file and submit
\`\`\`

### View Database
\`\`\`bash
npm run prisma:studio
# Opens GUI at http://localhost:5555
\`\`\`

### Run Migrations
\`\`\`bash
npm run prisma:migrate
# Creates new migration if schema changed
\`\`\`

### Reset Database (Dev Only)
\`\`\`bash
npx prisma migrate reset
# Drops and recreates database
\`\`\`

---

## 🎨 What's New

### Animations
- Fade in effects on page load
- Smooth hover transitions
- Glow effects on interactive elements
- Staggered animations for lists

### Database
- PostgreSQL with Prisma ORM
- Type-safe queries
- Automatic migrations
- Visual database management

### Performance
- Indexed database queries
- Optimized API routes
- Efficient image handling
- Connection pooling ready

---

## 🔧 Troubleshooting

### "Cannot find module '@prisma/client'"
\`\`\`bash
npm run prisma:generate
npm install
\`\`\`

### "Connection refused"
- Check PostgreSQL is running
- Verify DATABASE_URL is correct
- Check credentials

### "Migration failed"
\`\`\`bash
npm run prisma:generate
npm run prisma:migrate
\`\`\`

### "Port 3000 already in use"
\`\`\`bash
npm run dev -- -p 3001
\`\`\`

---

## 📚 File Structure

\`\`\`
project/
├── app/
│   ├── page.tsx              # Home page
│   ├── admin/page.tsx        # Admin dashboard
│   ├── events/[id]/page.tsx  # Event detail
│   └── api/admin/events/     # API routes
├── services/
│   └── PrismaEventService.ts # Database service
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Migration history
├── components/
│   ├── EventCard.tsx         # Event card
│   ├── EventSlider.tsx       # Image slider
│   └── AdminEventForm.tsx    # Admin form
└── lib/
    └── prisma.ts             # Prisma client
\`\`\`

---

## 🚀 Deployment

### Vercel + Neon
1. Push code to GitHub
2. Connect to Vercel
3. Add DATABASE_URL env var
4. Deploy!

### Self-Hosted
1. Set up PostgreSQL server
2. Configure DATABASE_URL
3. Run migrations
4. Deploy application

---

## 📞 Need Help?

1. **Setup Issues:** Check `.env.local` and DATABASE_URL
2. **Database Issues:** Run `npm run prisma:studio`
3. **Migration Issues:** Run `npm run prisma:generate`
4. **General Help:** See `README_PRISMA_INTEGRATION.md`

---

**Ready to go! 🚀**




# Prisma ORM & PostgreSQL Integration Summary

## 🎯 Overview

The Events @ GU application has been successfully integrated with **Prisma ORM** and **PostgreSQL**, replacing the file-based JSON storage system. Additionally, the UI has been enhanced with smooth animations and visual effects while maintaining the original color scheme and fonts.

## ✨ Key Changes

### 1. Database Layer
**Before:** File-based JSON storage (`data/events.json`)
**After:** PostgreSQL with Prisma ORM

#### New Files Created:
- `prisma/schema.prisma` - Database schema definition
- `lib/prisma.ts` - Prisma client singleton
- `services/PrismaEventService.ts` - Prisma-based service layer

#### Database Schema:
\`\`\`
Event
├── id (CUID)
├── title
├── description
├── date
├── category
├── heroPoster
├── visible
├── createdAt
├── updatedAt
└── images (EventImage[])

EventImage
├── id (CUID)
├── filename
├── alt
├── isHero
├── uploadedAt
└── eventId (FK)
\`\`\`

### 2. API Routes Updated
All API routes now use Prisma instead of file-based storage:

- `app/api/admin/events/route.ts` - List & create events
- `app/api/admin/events/[id]/route.ts` - Get, update, delete events
- `app/api/admin/events/[id]/images/route.ts` - Upload images
- `app/api/admin/events/[id]/images/[imageId]/route.ts` - Delete images

### 3. Service Layer
**New:** `services/PrismaEventService.ts`
- `getAllEvents()` - Fetch all events with images
- `getEventById(id)` - Fetch single event
- `createEvent(data)` - Create new event
- `updateEvent(id, data)` - Update event
- `deleteEvent(id)` - Delete event
- `addImageToEvent(eventId, image)` - Add image
- `updateImage(eventId, imageId, updates)` - Update image
- `deleteImage(eventId, imageId)` - Delete image
- `setHeroPoster(eventId, imageId)` - Set hero image
- `toggleVisibility(id, visible)` - Toggle visibility

### 4. UI/UX Enhancements

#### Animations Added:
\`\`\`css
@keyframes fadeInUp      /* Fade in from bottom */
@keyframes slideInLeft   /* Slide from left */
@keyframes slideInRight  /* Slide from right */
@keyframes scaleIn       /* Scale up */
@keyframes glow          /* Pulsing glow */
\`\`\`

#### CSS Classes:
- `.animate-fade-in-up` - Fade in animation
- `.animate-slide-in-left` - Slide left animation
- `.animate-slide-in-right` - Slide right animation
- `.animate-scale-in` - Scale animation
- `.animate-glow` - Glow effect
- `.hover-lift` - Lift on hover
- `.hover-glow` - Glow on hover
- `.transition-smooth` - Smooth transitions

#### Enhanced Components:
1. **EventCard.tsx**
   - Added fade-in animation
   - Image zoom on hover
   - Smooth transitions

2. **EventSlider.tsx**
   - Animated prev/next buttons
   - Staggered thumbnail animations
   - Glow effect on active thumbnail

3. **Home Page (page.tsx)**
   - Animated title with drop shadow
   - Staggered card animations
   - Background gradient effects

4. **Event Detail Page**
   - Animated background elements
   - Smooth section transitions
   - Hover effects on cards

5. **Admin Page**
   - Animated form sections
   - Staggered event list
   - Smooth interactions

### 5. Package Updates
Added to `package.json`:
\`\`\`json
{
  "dependencies": {
    "@prisma/client": "^5.8.0"
  },
  "devDependencies": {
    "prisma": "^5.8.0"
  },
  "scripts": {
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  }
}
\`\`\`

## 🚀 Setup Instructions

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Configure Database
Create `.env.local`:
\`\`\`env
DATABASE_URL="postgresql://user:password@localhost:5432/events_gu"
\`\`\`

### 3. Initialize Database
\`\`\`bash
npm run prisma:generate
npm run prisma:migrate
\`\`\`

### 4. Start Development
\`\`\`bash
npm run dev
\`\`\`

## 📊 Migration Path

### From JSON to Prisma
The old `EventService.ts` is still available for backward compatibility, but all new code uses `PrismaEventService.ts`.

**Old Flow:**
\`\`\`
API Route → EventService → JSON File
\`\`\`

**New Flow:**
\`\`\`
API Route → PrismaEventService → Prisma Client → PostgreSQL
\`\`\`

## 🔄 Data Migration (Optional)

If you have existing events in `data/events.json`, you can migrate them:

\`\`\`typescript
// Create a migration script to import old data
import { EventService } from '@/services/EventService';
import { PrismaEventService } from '@/services/PrismaEventService';

const oldEvents = EventService.getAllEvents();
for (const event of oldEvents) {
  await PrismaEventService.createEvent({
    title: event.title,
    description: event.description,
    date: event.date,
    category: event.category,
  });
}
\`\`\`

## 🎨 Design Consistency

### Colors Preserved:
- Primary Orange: `#ff6b35`
- Secondary Yellow: `#ffd23f`
- Card Colors: Teal, Peach, Blue, Lime
- Text Colors: Light, Dark, Muted

### Fonts Preserved:
- Sans: Geist
- Mono: Geist Mono
- Fallback: Arial, Helvetica

### Features Preserved:
- Event gallery with 4-column grid
- Event detail pages with image slider
- Admin dashboard with CRUD operations
- Image upload and management
- Event visibility toggle

## 📈 Performance Improvements

1. **Database Indexing**
   - `visible` field indexed for faster queries
   - `date` field indexed for sorting
   - `eventId` indexed for image lookups

2. **Query Optimization**
   - Prisma includes relations automatically
   - Efficient pagination support
   - Connection pooling ready

3. **Type Safety**
   - Full TypeScript support
   - Auto-generated types from schema
   - Compile-time error checking

## 🔐 Security Enhancements

1. **SQL Injection Prevention**
   - Prisma uses parameterized queries
   - No raw SQL concatenation

2. **Data Validation**
   - Schema validation at database level
   - Type checking at application level

3. **Cascade Deletes**
   - Images automatically deleted with events
   - Referential integrity maintained

## 📚 Documentation Files

- `PRISMA_SETUP.md` - Detailed setup guide
- `README_PRISMA_INTEGRATION.md` - Comprehensive documentation
- `.env.local.example` - Environment template
- `INTEGRATION_SUMMARY.md` - This file

## 🛠️ Useful Commands

\`\`\`bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm start                  # Start production server

# Database
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Run migrations
npm run prisma:studio      # Open Prisma Studio

# Linting
npm run lint               # Run ESLint
\`\`\`

## 🐛 Common Issues & Solutions

### Issue: "DATABASE_URL not set"
**Solution:** Create `.env.local` with DATABASE_URL

### Issue: "Connection refused"
**Solution:** Ensure PostgreSQL is running and credentials are correct

### Issue: "Migration failed"
**Solution:** Check schema.prisma syntax and run `npm run prisma:generate`

### Issue: "Prisma Client not found"
**Solution:** Run `npm run prisma:generate`

## 🎓 Learning Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Basics](https://www.postgresql.org/docs/current/tutorial.html)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Tailwind CSS Animations](https://tailwindcss.com/docs/animation)

## ✅ Checklist for Deployment

- [ ] Install dependencies: `npm install`
- [ ] Set DATABASE_URL in environment
- [ ] Run migrations: `npm run prisma:migrate`
- [ ] Test locally: `npm run dev`
- [ ] Build: `npm run build`
- [ ] Deploy to Vercel/hosting
- [ ] Verify database connection in production
- [ ] Test admin panel
- [ ] Test event creation/editing
- [ ] Test image uploads

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review Prisma docs: https://www.prisma.io/docs/
3. Check PostgreSQL logs
4. Verify environment variables

---

**Integration completed successfully! 🎉**

The application now has:
- ✅ Prisma ORM with PostgreSQL
- ✅ Beautiful animations and effects
- ✅ Maintained original design
- ✅ Full type safety
- ✅ Production-ready database


prisma integration 
# Prisma Setup Guide

This project uses Prisma ORM with PostgreSQL for database management.

## Installation & Setup

### 1. Install Dependencies
\`\`\`bash
npm install
# or
pnpm install
\`\`\`

### 2. Configure Database URL

Create a `.env.local` file in the root directory:

\`\`\`env
DATABASE_URL="postgresql://user:password@localhost:5432/events_gu"
\`\`\`

**Options:**
- **Local PostgreSQL**: `postgresql://user:password@localhost:5432/dbname`
- **Neon (Vercel)**: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`
- **SQLite (Development)**: `file:./prisma/dev.db`

### 3. Generate Prisma Client
\`\`\`bash
npm run prisma:generate
\`\`\`

### 4. Run Migrations
\`\`\`bash
npm run prisma:migrate
\`\`\`

This will:
- Create the database schema
- Create `Event` and `EventImage` tables
- Set up relationships and indexes

### 5. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

## Database Schema

### Event Table
- `id`: Unique identifier (CUID)
- `title`: Event title
- `description`: Event description
- `date`: Event date
- `category`: Event category
- `heroPoster`: Hero image filename
- `visible`: Visibility flag
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
- `images`: Related EventImage records

### EventImage Table
- `id`: Unique identifier (CUID)
- `filename`: Image filename
- `alt`: Alt text for accessibility
- `isHero`: Whether this is the hero image
- `uploadedAt`: Upload timestamp
- `eventId`: Foreign key to Event
- `event`: Related Event record

## Useful Commands

\`\`\`bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open Prisma Studio (GUI for database)
npm run prisma:studio

# View database schema
npx prisma db push

# Reset database (development only)
npx prisma migrate reset
\`\`\`

## Migration Workflow

When you modify `prisma/schema.prisma`:

1. Update the schema file
2. Run `npm run prisma:migrate`
3. Name your migration (e.g., "add_new_field")
4. Prisma will generate and apply the migration

## Troubleshooting

### Connection Issues
- Verify DATABASE_URL is correct
- Check PostgreSQL is running
- Ensure database exists

### Migration Errors
- Check for syntax errors in schema.prisma
- Review migration files in `prisma/migrations/`
- Use `npx prisma db push` to sync schema

### Prisma Client Issues
- Run `npm run prisma:generate` to regenerate client
- Clear node_modules and reinstall if needed
\`\`\`
</parameter>
