export interface EventImage {
  id: string;
  filename: string;
  alt: string;
  isHero: boolean;
  uploadedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  heroPoster: string; // filename of the hero image
  images: EventImage[];
  createdAt: string;
  updatedAt: string;
  visible?: boolean;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  category: string;
}
