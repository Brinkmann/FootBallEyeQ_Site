"use client";

import { useCallback, useMemo, useState, type KeyboardEvent, type TouchEvent } from "react";
import LazyMedia from "./LazyMedia";

export type CarouselSlide = {
  image: string;
  title: string;
  description: string;
};

type MediaCarouselProps = {
  slides: CarouselSlide[];
};

export function MediaCarousel({ slides }: MediaCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = slides.length;

  const goTo = useCallback((index: number) => {
    if (index < 0) {
      setActiveIndex(total - 1);
      return;
    }
    if (index >= total) {
      setActiveIndex(0);
      return;
    }
    setActiveIndex(index);
  }, [total]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1);
    }
  };

  const handleTouch = useMemo(() => {
    let startX: number | null = null;

    return {
      onTouchStart: (event: TouchEvent<HTMLDivElement>) => {
        startX = event.touches[0]?.clientX ?? null;
      },
      onTouchEnd: (event: TouchEvent<HTMLDivElement>) => {
        if (startX === null) return;
        const deltaX = event.changedTouches[0]?.clientX - startX;
        if (Math.abs(deltaX) > 40) {
          goTo(deltaX < 0 ? activeIndex + 1 : activeIndex - 1);
        }
        startX = null;
      }
    };
  }, [activeIndex, goTo]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Training media carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="outline-none"
      {...handleTouch}
    >
      <div className="relative">
        {slides.map((slide, index) => (
          <article
            key={slide.title}
            aria-roledescription="slide"
            aria-label={`${slide.title} (${index + 1} of ${total})`}
            aria-hidden={index !== activeIndex}
            className={index === activeIndex ? "block" : "hidden"}
          >
            <LazyMedia
              src={slide.image}
              alt={slide.title}
              className="rounded-2xl shadow-lg"
              wrapperClassName="aspect-[16/9]"
            />
            <div className="mt-4 text-center">
              <h3 className="text-xl font-semibold text-gray-900">{slide.title}</h3>
              <p className="text-gray-600 mt-2 max-w-3xl mx-auto">{slide.description}</p>
            </div>
          </article>
        ))}

        <div className="absolute inset-y-1/2 flex w-full justify-between px-2">
          <button
            type="button"
            className="rounded-full bg-white/90 shadow p-3 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D72C16]"
            onClick={() => goTo(activeIndex - 1)}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            type="button"
            className="rounded-full bg-white/90 shadow p-3 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D72C16]"
            onClick={() => goTo(activeIndex + 1)}
            aria-label="Next slide"
          >
            →
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2" aria-label="Slide indicators">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            className={`h-3 w-3 rounded-full ${
              index === activeIndex ? "bg-[#D72C16]" : "bg-gray-300"
            }`}
            onClick={() => goTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-pressed={index === activeIndex}
          />
        ))}
      </div>
    </div>
  );
}

export default MediaCarousel;
