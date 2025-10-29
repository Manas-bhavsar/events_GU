import { PrismaEventService } from "../../../services/PrismaEventService"
import { notFound } from "next/navigation"
import fs from "fs"
import path from "path"
import EventSlider from "../../../components/EventSlider"

export async function generateStaticParams() {
  const events = await PrismaEventService.getAllEvents()
  return events.map((e) => ({ id: e.id }))
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await PrismaEventService.getEventById(id)
  if (!event || event.visible !== true) return notFound()

  const poster = (event.heroPoster || "").replace(/^[@\s]+/, "")

  const resolvePublicPath = (filename: string) => {
    const publicDir = path.join(process.cwd(), "public")
    const inImages = path.join(publicDir, "images", filename)
    const atRoot = path.join(publicDir, filename)
    if (filename && fs.existsSync(inImages)) return `/images/${filename}`
    if (filename && fs.existsSync(atRoot)) return `/${filename}`
    return null
  }

  const heroSrc = resolvePublicPath(poster)

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0b0b0f] to-[#141824] py-12 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-orange rounded-full blur-3xl animate-glow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-yellow rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        <header className="text-center space-y-4 animate-fade-in-up">
          <p className="uppercase tracking-[0.35em] text-accent-orange/80 text-sm">Gandhinagar University </p>
          <h1 className="text-5xl md:text-6xl font-extrabold text-accent-orange drop-shadow-[0_2px_12px_rgba(255,115,0,0.35)]">
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 animate-slide-in-left">
            <span className="px-3 py-1 rounded-full bg-white/10 text-light text-sm border border-white/10 transition-smooth hover:bg-white/20">
              {new Date(event.date).toLocaleDateString()}
            </span>
            <span className="px-3 py-1 rounded-full bg-accent-orange/15 text-accent-orange text-sm border border-accent-orange/40 transition-smooth hover:bg-accent-orange/25">
              {event.category}
            </span>
          </div>
        </header>

        {/* Slider: autoplay and manual selection */}
        <section className="rounded-xl p-2 md:p-3 bg-white/5 border border-white/10 shadow-[0_0_40px_-12px_rgba(255,115,0,0.25)] animate-scale-in hover-glow transition-smooth">
          <EventSlider
            images={(event.images || []).map((img) => ({
              id: img.id,
              src: resolvePublicPath(img.filename),
              alt: img.alt || event.title,
            }))}
            intervalMs={4000}
          />
        </section>

        <section className="grid md:grid-cols-3 gap-6 animate-slide-in-right">
          <div className="md:col-span-2 rounded-xl border border-white/10 bg-white/5 p-6 space-y-3 transition-smooth hover:bg-white/10 hover:border-white/20">
            <h2 className="text-2xl font-semibold text-light">About</h2>
            <p className="text-light/90 leading-relaxed">{event.description}</p>
          </div>
          <aside className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4 transition-smooth hover:bg-white/10 hover:border-white/20">
            <h3 className="text-lg font-semibold text-light">Event Info</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-light/70">Date</span>
                <span className="text-light font-medium">{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-light/70">Category</span>
                <span className="text-accent-orange font-medium">{event.category}</span>
              </div>
            </div>
            <div className="pt-2 flex gap-3">
              <a
                href="#"
                className="px-4 py-2 rounded-lg bg-accent-orange text-black font-semibold hover:bg-[#ff974d] transition-smooth hover-lift"
              >
                Register
              </a>
              <a
                href="#"
                className="px-4 py-2 rounded-lg border border-white/15 text-light hover:bg-white/10 transition-smooth"
              >
                Contact
              </a>
            </div>
          </aside>
        </section>
      </div>
    </div>
  )
}
