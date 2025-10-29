import { PrismaEventService } from "../services/PrismaEventService"
import EventCard from "../components/EventCard"

export default async function HomePage() {
  const events = await PrismaEventService.getAllEvents()
  const visibleEvents = events.filter((e) => e.visible === true)

  return (
    <div className="min-h-screen">
      {/* Title Section */}
      <section className="bg-title py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-orange rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-yellow rounded-full blur-3xl"></div>
        </div>
        <div className="text-center relative z-10">
          <h1 className="text-6xl font-bold text-accent-orange tracking-wide animate-fade-in-up drop-shadow-lg">
            LIFE @ GU
          </h1>
          <p className="text-text-muted mt-4 animate-slide-in-left delay-100">
            Explore vibrant events and celebrations
          </p>
        </div>
      </section>

      {/* Events Gallery Section */}
      <section className="bg-content py-16 px-8 relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-accent-orange rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Event Cards with Titles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {visibleEvents.map((event, index) => (
              <div
                key={event.id}
                className="space-y-4 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Event Title */}
                <h3 className="text-light text-lg font-medium text-center transition-smooth hover:text-accent-orange">
                  {event.title}
                </h3>
                {/* Event Card */}
                <EventCard event={event} isActive={index === 2} cardColor={getCardColor(index)} />
              </div>
            ))}
          </div>

          {visibleEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-light/60 text-lg">No events available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function getCardColor(index: number): string {
  const colors = ["bg-card-teal", "bg-card-peach", "bg-card-blue", "bg-card-lime"]
  return colors[index % colors.length]
}
