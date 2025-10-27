import { Event, EventImage, EventFormData } from '../types/events';
import fs from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'events.json');

export class EventService {
  private static readData(): { events: Event[] } {
    try {
      const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading events data:', error);
      return { events: [] };
    }
  }

  private static writeData(data: { events: Event[] }): void {
    try {
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error writing events data:', error);
      throw new Error('Failed to save data');
    }
  }

  static getAllEvents(): Event[] {
    const data = this.readData();
    return data.events;
  }

  static getEventById(id: string): Event | null {
    const events = this.getAllEvents();
    return events.find(event => event.id === id) || null;
  }

  static createEvent(eventData: EventFormData): Event {
    const events = this.getAllEvents();
    const newEvent: Event = {
      id: `event-${Date.now()}`,
      ...eventData,
      heroPoster: '',
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    events.push(newEvent);
    this.writeData({ events });
    return newEvent;
  }

  static updateEvent(id: string, eventData: Partial<EventFormData>): Event | null {
    const events = this.getAllEvents();
    const eventIndex = events.findIndex(event => event.id === id);
    
    if (eventIndex === -1) return null;
    
    events[eventIndex] = {
      ...events[eventIndex],
      ...eventData,
      updatedAt: new Date().toISOString()
    };
    
    this.writeData({ events });
    return events[eventIndex];
  }

  static deleteEvent(id: string): boolean {
    const events = this.getAllEvents();
    const filteredEvents = events.filter(event => event.id !== id);
    
    if (filteredEvents.length === events.length) return false;
    
    this.writeData({ events: filteredEvents });
    return true;
  }

  static addImageToEvent(eventId: string, image: Omit<EventImage, 'id'>): EventImage | null {
    const events = this.getAllEvents();
    const eventIndex = events.findIndex(event => event.id === eventId);
    
    if (eventIndex === -1) return null;
    
    const newImage: EventImage = {
      ...image,
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    events[eventIndex].images.push(newImage);
    
    // If this is the first image or marked as hero, set it as hero poster
    if (image.isHero || events[eventIndex].images.length === 1) {
      events[eventIndex].heroPoster = newImage.filename;
    }
    
    events[eventIndex].updatedAt = new Date().toISOString();
    this.writeData({ events });
    return newImage;
  }

  static updateImage(eventId: string, imageId: string, updates: Partial<EventImage>): EventImage | null {
    const events = this.getAllEvents();
    const eventIndex = events.findIndex(event => event.id === eventId);
    
    if (eventIndex === -1) return null;
    
    const imageIndex = events[eventIndex].images.findIndex(img => img.id === imageId);
    if (imageIndex === -1) return null;
    
    events[eventIndex].images[imageIndex] = {
      ...events[eventIndex].images[imageIndex],
      ...updates
    };
    
    // If this image is marked as hero, update the hero poster
    if (updates.isHero) {
      events[eventIndex].heroPoster = events[eventIndex].images[imageIndex].filename;
    }
    
    events[eventIndex].updatedAt = new Date().toISOString();
    this.writeData({ events });
    return events[eventIndex].images[imageIndex];
  }

  static deleteImage(eventId: string, imageId: string): boolean {
    const events = this.getAllEvents();
    const eventIndex = events.findIndex(event => event.id === eventId);
    
    if (eventIndex === -1) return false;
    
    const imageIndex = events[eventIndex].images.findIndex(img => img.id === imageId);
    if (imageIndex === -1) return false;
    
    const deletedImage = events[eventIndex].images[imageIndex];
    events[eventIndex].images.splice(imageIndex, 1);
    
    // If the deleted image was the hero poster, set a new one
    if (events[eventIndex].heroPoster === deletedImage.filename) {
      if (events[eventIndex].images.length > 0) {
        events[eventIndex].heroPoster = events[eventIndex].images[0].filename;
      } else {
        events[eventIndex].heroPoster = '';
      }
    }
    
    events[eventIndex].updatedAt = new Date().toISOString();
    this.writeData({ events });
    return true;
  }

  static setHeroPoster(eventId: string, imageId: string): boolean {
    const events = this.getAllEvents();
    const eventIndex = events.findIndex(event => event.id === eventId);
    
    if (eventIndex === -1) return false;
    
    const image = events[eventIndex].images.find(img => img.id === imageId);
    if (!image) return false;
    
    // Reset all images' isHero flag
    events[eventIndex].images.forEach(img => img.isHero = false);
    
    // Set the selected image as hero
    image.isHero = true;
    events[eventIndex].heroPoster = image.filename;
    events[eventIndex].updatedAt = new Date().toISOString();
    
    this.writeData({ events });
    return true;
  }
}
