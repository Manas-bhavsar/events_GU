'use client';

import { Event } from '../types/events';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface EventCardProps {
  event: Event;
  isActive?: boolean;
  cardColor: string;
}

export default function EventCard({ event, isActive = false, cardColor }: EventCardProps) {
  const poster = (event.heroPoster || '').replace(/^[@\s]+/, '');
  const [imgSrc, setImgSrc] = useState(`/images/${poster}`);
  const [showFallback, setShowFallback] = useState(false);
  return (
    <Link href={`/events/${event.id}`} className={`
      ${cardColor} 
      ${isActive ? 'border-card-active' : ''} 
      rounded-lg p-6 h-96 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg
      flex flex-col justify-center items-center
    `}>
      {/* Hero Poster Area */}
      <div className="w-full h-64 flex items-center justify-center">
        {poster ? (
          <div className="w-full h-full relative rounded-lg overflow-hidden">
            {!showFallback ? (
              <Image
                src={imgSrc}
                alt={event.title}
                fill
                className="object-cover"
                onError={() => {
                  // Try falling back to root-level public path if /images/ is missing
                  if (imgSrc !== `/${poster}`) {
                    setImgSrc(`/${poster}`);
                  } else {
                    setShowFallback(true);
                  }
                }}
              />
            ) : (
              <div className="w-full h-full bg-white/20 rounded-lg flex items-center justify-center absolute inset-0">
                <span className="text-lg font-medium text-gray-700">
                  {poster}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-lg text-gray-500">No image</span>
          </div>
        )}
      </div>
    </Link>
  );
}
