import { EventService } from '../services/EventService';
import EventCard from '../components/EventCard';
import Navbar from '../components/Navbar';

export default async function HomePage() {
  // Keep your existing backend call exactly as it was
  const events = await EventService.getVisibleEvents();

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section with Video Background */}
      <section className="hero-section">
        {/* Video Background */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="hero-video"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay */}
        <div className="hero-overlay"></div>

        {/* Content */}
        <div className="hero-content">
          <h1 className="hero-title typewriter">
            LIFE @ GU
          </h1>
        </div>
      </section>

      {/* Auto-Scrolling Events Carousel Section */}
      <section className="bg-content py-16 px-8 overflow-hidden">
        <div className="max-w-full">
          {/* section heading */}
          <div className='text-center mb-12'>
            <h2 className="explore-heading">Explore Events</h2>
          </div>
          {/*carousel*/}
          <div className="carousel-container">
            <div className="carousel-track">
              {/* Duplicate events array for infinite scroll effect */}
              {[...events, ...events].map((event, index) => (
                <div key={`${event.id}-${index}`} className="carousel-item">
                  <h3 className="text-light text-lg font-medium text-center mb-4">
                    {event.title}
                  </h3>
                  <EventCard 
                    event={event} 
                    isActive={index === 2} 
                    cardColor={getCardColor(index)}
                  />
                </div>
              ))}
            </div>
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
