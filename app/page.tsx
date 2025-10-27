import { EventService } from '../services/EventService';
import EventCard from '../components/EventCard';


export default function HomePage() {
  const events = EventService.getAllEvents().filter(e => e.visible === true);

  return (
    <div className="min-h-screen">

      {/* Title Section */}
      <section className="bg-title py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-accent-orange tracking-wide">
            LIFE @ GU
          </h1>
        </div>
      </section>

      {/* Events Gallery Section */}
      <section className="bg-content py-16 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Event Cards with Titles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {events.map((event, index) => (
              <div key={event.id} className="space-y-4">
                {/* Event Title */}
                <h3 className="text-light text-lg font-medium text-center">
                  {event.title}
                </h3>
                {/* Event Card */}
                <EventCard 
                  event={event} 
                  isActive={index === 2} 
                  cardColor={getCardColor(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function getCardColor(index: number): string {
  const colors = ['bg-card-teal', 'bg-card-peach', 'bg-card-blue', 'bg-card-lime'];
  return colors[index % colors.length];
}