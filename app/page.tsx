import { EventService } from '../services/EventService';
import EventsCarousel from '../components/EventsCarousel';


export default async function HomePage() {
  const events = await EventService.getVisibleEvents();

  return (
    <div className="min-h-screen">

      {/* Title Section */}
      <section className="bg-title py-28 md:py-36">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-accent-orange tracking-wide">
            LIFE @ GU
          </h1>
        </div>
      </section>

      {/* Events Gallery Section */}
      <section className="bg-content py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <EventsCarousel events={events} intervalMs={15000} />
        </div>
      </section>
    </div>
  );
}