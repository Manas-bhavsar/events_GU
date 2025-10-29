"use client"

import type { Event } from "../types/events"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface EventCardProps {
  event: Event
  isActive?: boolean
  cardColor: string
}

export default function EventCard({ event, isActive = false, cardColor }: EventCardProps) {
  const poster = (event.heroPoster || "").replace(/^[@\s]+/, "")
  const [imgSrc, setImgSrc] = useState(`/images/${poster}`)
  const [showFallback, setShowFallback] = useState(false)

  return (
    <Link
      href={`/events/${event.id}`}
      className={`
      ${cardColor} 
      ${isActive ? "border-card-active" : ""} 
      rounded-lg p-6 h-96 cursor-pointer transition-smooth hover-lift hover-glow
      flex flex-col justify-center items-center
      animate-fade-in-up
      group
    `}
    >
      {/* Hero Poster Area */}
      <div className="w-full h-64 flex items-center justify-center relative overflow-hidden rounded-lg">
        {poster ? (
          <div className="w-full h-full relative rounded-lg overflow-hidden">
            {!showFallback ? (
              <Image
                src={imgSrc || "/placeholder.svg"}
                alt={event.title}
                fill
                className="object-cover transition-smooth group-hover:scale-110 duration-500"
                onError={() => {
                  if (imgSrc !== `/${poster}`) {
                    setImgSrc(`/${poster}`)
                  } else {
                    setShowFallback(true)
                  }
                }}
              />
            ) : (
              <div className="w-full h-full bg-white/20 rounded-lg flex items-center justify-center absolute inset-0">
                <span className="text-lg font-medium text-gray-700">{poster}</span>
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
  )
}
