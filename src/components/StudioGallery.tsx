"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { StudioGalleryProps } from "@/lib/types";

export default function StudioGallery({ title, images }: StudioGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  if (!activeImage) return null;

  const move = (offset: number) => {
    setActiveIndex((index) => (index + offset + images.length) % images.length);
  };

  return (
    <section
      aria-label={`${title} image gallery`}
      className="mb-12 overflow-hidden rounded-3xl bg-slate-100"
    >
      <div className="relative h-[300px] sm:h-[440px]">
        <Image
          src={activeImage}
          alt={`${title} gallery image ${activeIndex + 1}`}
          fill
          priority
          unoptimized
          sizes="(max-width: 768px) 100vw, 80vw"
          className="object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous studio image"
              className="absolute left-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow transition hover:bg-white"
            >
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next studio image"
              className="absolute right-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow transition hover:bg-white"
            >
              <ChevronRight size={22} aria-hidden="true" />
            </button>
            <span className="absolute bottom-4 right-4 rounded-full bg-slate-950/70 px-3 py-1.5 text-xs font-semibold text-white">
              {activeIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto p-3">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              aria-label={`Show gallery image ${index + 1}`}
              aria-current={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg ${
                index === activeIndex
                  ? "ring-2 ring-purple-600 ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt=""
                fill
                unoptimized
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
