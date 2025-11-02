"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import EventCard from './EventCard';
import type { Event } from '../types/events';

type Props = {
  events: Event[];
  intervalMs?: number; // default ~15s
};

export default function EventsCarousel({ events, intervalMs = 15000 }: Props) {
  const items = useMemo(() => events.filter(Boolean), [events]);
  const [page, setPage] = useState(0); // start index for sliding window
  const [visible, setVisible] = useState(true); // for transition trigger
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);
  const timerRef = useRef<number | null>(null);
  const count = items.length;
  const pageSize = 4;
  const pageCount = Math.max(count, 1); // one position per item for continuous sliding

  useEffect(() => {
    if (count <= pageSize) return; // nothing to rotate if 4 or fewer
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, count, intervalMs]);

  const start = () => {
    stop();
    timerRef.current = window.setTimeout(() => {
      setDirection('next');
      setPage((p) => (p + 1) % Math.max(pageCount, 1));
    }, intervalMs);
  };

  const stop = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const goto = (p: number) => setPage(((p % Math.max(pageCount, 1)) + pageCount) % pageCount);
  const startIndex = page;
  const currentGroup = useMemo(() => {
    if (count <= pageSize) return items; // static
    const group: Event[] = [];
    for (let i = 0; i < pageSize; i++) {
      const idx = (startIndex + i) % count;
      group.push(items[idx]);
    }
    return group;
  }, [items, count, pageSize, startIndex]);

  // Trigger fade/slide animation on page change
  useEffect(() => {
    setVisible(false);
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [page, count]);

  const hasPages = count > pageSize;
  const onPrev = () => {
    stop();
    setDirection('prev');
    setPage((p) => (p - 1 + Math.max(pageCount, 1)) % Math.max(pageCount, 1));
    start();
  };
  const onNext = () => {
    stop();
    setDirection('next');
    setPage((p) => (p + 1) % Math.max(pageCount, 1));
    start();
  };

  return (
    <div
      className="w-full"
      onMouseEnter={stop}
      onMouseLeave={start}
      onTouchStart={(e) => {
        if (e.touches && e.touches.length > 0) {
          touchStartX.current = e.touches[0].clientX;
          touchDeltaX.current = 0;
          stop();
        }
      }}
      onTouchMove={(e) => {
        if (touchStartX.current != null && e.touches && e.touches.length > 0) {
          touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
        }
      }}
      onTouchEnd={() => {
        const dx = touchDeltaX.current;
        touchStartX.current = null;
        touchDeltaX.current = 0;
        const threshold = 50; // px
        if (Math.abs(dx) > threshold) {
          if (dx < 0) {
            setDirection('next');
            setPage((p) => (p + 1) % Math.max(pageCount, 1));
          } else {
            setDirection('prev');
            setPage((p) => (p - 1 + Math.max(pageCount, 1)) % Math.max(pageCount, 1));
          }
        }
        start();
      }}
    >
      {/* Grid of up to 4 cards */}
      <div className="relative">
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 will-change-transform transition-transform duration-500 ease-in-out ${
            visible
              ? 'translate-x-0'
              : direction === 'next'
              ? '-translate-x-6'
              : 'translate-x-6'
          }`}
        >
          {currentGroup.length > 0 ? (
            currentGroup.map((ev, i) => (
              <div key={`${ev.id}-${i}`} className="space-y-4">
                <h3 className="text-light text-lg font-medium text-center">{ev.title}</h3>
                <EventCard event={ev} isActive={true} cardColor={getCardColor((startIndex + i))} />
              </div>
            ))
          ) : (
            <div className="col-span-4 h-96 rounded-lg bg-white/10 flex items-center justify-center text-gray-400">No events</div>
          )}
        </div>
      </div>

      {/* Controls and dots (outside the cards) */}
      {hasPages && (
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/10 hover:bg-white/15 text-light border border-white/15"
            aria-label="Previous"
          >
            ‹
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to set ${i + 1}`}
                onClick={() => goto(i)}
                className={`h-2 w-2 rounded-full ${i === page ? 'bg-accent-orange' : 'bg-white/30'}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/10 hover:bg-white/15 text-light border border-white/15"
            aria-label="Next"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

function getCardColor(index: number): string {
  const colors = ['bg-card-teal', 'bg-card-peach', 'bg-card-blue', 'bg-card-lime'];
  return colors[index % colors.length];
}
