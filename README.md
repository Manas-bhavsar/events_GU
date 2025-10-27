# LIFE @ GU - Event Gallery

A simple event gallery website for your college, featuring a clean homepage that displays events loaded directly from a JSON file.

## Features

### Public Homepage
- **Modern Design**: Clean, minimalist design matching the provided mockup
- **Event Cards**: Beautiful event cards with hero posters and color patterns
- **Responsive Layout**: Works perfectly on desktop and mobile devices
- **Color Variables**: All colors and styles are defined as CSS variables for easy customization
- **JSON Data**: Events loaded directly from JSON file for simple management

## Project Structure

```
├── app/
│   ├── globals.css           # Global styles with CSS variables
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Public homepage
├── components/
│   └── EventCard.tsx         # Event card component
├── data/
│   └── events.json           # Events data storage
├── services/
│   └── EventService.ts       # Data service layer
└── types/
    └── events.ts             # TypeScript interfaces
```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Homepage: `http://localhost:3000` (or 3001 if 3000 is in use)

## Sample Data

The application comes with 3 sample events:
- Annual Cultural Festival
- Tech Innovation Summit  
- Sports Championship Finals

Each event includes sample images with descriptive filenames.

## Managing Events

To add, edit, or remove events, simply edit the `data/events.json` file:

```json
{
  "events": [
    {
      "id": "event-1",
      "title": "Event Title",
      "description": "Event description",
      "date": "2024-03-15",
      "location": "Event Location",
      "category": "Event Category",
      "heroPoster": "hero-image.jpg",
      "images": [
        {
          "id": "img-1-1",
          "filename": "image.jpg",
          "alt": "Image description",
          "isHero": true,
          "uploadedAt": "2024-03-10T10:00:00Z"
        }
      ],
      "createdAt": "2024-03-10T09:00:00Z",
      "updatedAt": "2024-03-10T09:00:00Z"
    }
  ]
}
```

## Customization

### Colors and Styles
All colors are defined as CSS variables in `app/globals.css`:

```css
:root {
  --header-bg: #2a2a2a;
  --title-bg: #f5f5f5;
  --content-bg: #1a1a1a;
  --accent-orange: #ff6b35;
  --accent-yellow: #ffd23f;
  /* ... more variables */
}
```

### Adding New Event Categories
Edit the category options in the JSON file or update the EventCard component to handle new categories.

## Technologies Used

- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React 19**: Latest React features
- **Node.js**: Server-side functionality