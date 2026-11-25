"use client";

import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { HeroProps } from "@/lib/types";

import "swiper/css";
import "swiper/css/pagination";

export default function Hero({ images, delay = 3000 }: HeroProps) {
  return (
    <section className="mx-auto mt-10 w-full max-w-7xl px-4 md:px-6">
      <Swiper
        modules={[Autoplay, Pagination]}
        loop
        speed={1000}
        autoplay={{
          delay,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true }}
        className="h-[560px] w-full overflow-hidden rounded-3xl shadow-2xl shadow-slate-900/20 ring-1 ring-black/5 md:h-[720px] [&_.swiper-pagination]:!bottom-8 [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:bg-white/50 [&_.swiper-pagination-bullet]:opacity-100 [&_.swiper-pagination-bullet-active]:w-7 [&_.swiper-pagination-bullet-active]:rounded-full [&_.swiper-pagination-bullet-active]:bg-white"
      >
        {images.map((img, index) => (
          <SwiperSlide key={img.src}>
            <div className="relative h-full w-full">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                priority={index === 0}
                quality={90}
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
              />

              {/* Gradient, যাতে text পরিষ্কার দেখা যায় */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

              {/* Text + CTA */}
              <div className="relative z-10 flex h-full items-center">
                <div className="w-full px-8 md:px-14">
                  <div className="max-w-2xl text-white">
                    {img.eyebrow && (
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400 md:text-sm">
                        {img.eyebrow}
                      </p>
                    )}

                    <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
                      {img.title}
                    </h1>

                    {img.subtitle && (
                      <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
                        {img.subtitle}
                      </p>
                    )}

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <Link
                        href="/explore-studios"
                        className="rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-black-400 hover:text-black"
                      >
                        Explore Studios
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
