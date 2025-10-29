"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"

export interface SliderImage {
  id: string
  src: string | null
  alt: string
}

interface EventSliderProps {
  images: SliderImage[]
  intervalMs?: number
}

export default function EventSlider({ images, intervalMs = 4000 }: EventSliderProps) {
  const validImages = useMemo(() => images.filter((img) => !!img), [images])
  const [index, setIndex] = useState(0)
  const timerRef = useRef<number | null>(null)
  const count = validImages.length

  useEffect(() => {
    if (count <= 1) return
    start()
    return stop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, count, intervalMs])

  const start = () => {
    stop()
    timerRef.current = window.setTimeout(() => {
      setIndex((i) => (i + 1) % Math.max(count, 1))
    }, intervalMs)
  }

  const stop = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const goto = (i: number) => {
    setIndex(i % Math.max(count, 1))
  }

  const current = validImages[index] ?? null

  return (
    <div className="w-full">
      <div
        className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-white/10 transition-smooth"
        onMouseEnter={stop}
        onMouseLeave={start}
      >
        {current?.src ? (
          <Image
            src={current.src || "/placeholder.svg"}
            alt={current.alt}
            fill
            className="object-cover transition-smooth duration-500 animate-fade-in-up"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-500">No image</span>
          </div>
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous"
              onClick={() => goto((index - 1 + count) % count)}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white px-3 py-2 hover:bg-black/60 transition-smooth hover:scale-110 hover-lift"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => goto((index + 1) % count)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white px-3 py-2 hover:bg-black/60 transition-smooth hover:scale-110 hover-lift"
            >
              ›
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-3 flex items-center gap-2 overflow-x-auto">
          {validImages.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => goto(i)}
              className={`relative shrink-0 w-16 h-12 rounded-md overflow-hidden border transition-smooth hover:scale-110 ${
                i === index
                  ? "border-accent-orange ring-2 ring-accent-orange/40 animate-glow"
                  : "border-white/20 hover:border-white/40"
              }`}
              aria-label={`Go to image ${i + 1}`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {img.src ? (
                <Image
                  src={img.src || "/placeholder.svg"}
                  alt={img.alt}
                  fill
                  className="object-cover transition-smooth hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-white/10" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
