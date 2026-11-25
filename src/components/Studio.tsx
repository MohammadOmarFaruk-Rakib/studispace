
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StudioCardActions from "@/components/StudioCardActions";
import {
  getStudioRecords,
  isStudioRecord,
  studioMatchesCategory,
  STUDIO_API_URL,
} from "@/lib/studio-data";
import {
  ArrowUpRight,
  MapPin,
  Star,
  Users,
} from "lucide-react";
import type {
  StudioCardProps,
  StudioCardStudio,
  StudiosProps,
} from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

export default function Studios({
  category,
  featuredOnly = false,
}: StudiosProps) {
  const [studios, setStudios] = useState<StudioCardStudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const loadStudios = useCallback(async () => {
    try {
      const endpoint = featuredOnly
        ? "/featured-studios"
        : category
          ? "/Studios"
          : "/Studios?limit=6&sort=rating";
      const response = await fetch(
        `${STUDIO_API_URL}${endpoint}`,
        { cache: "no-store" },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch studios (${response.status})`);
      }

      const data: unknown = await response.json();
      const records = getStudioRecords(data);
      if (!records || !records.every(isStudioRecord)) {
        throw new Error("The studios API returned invalid studio data");
      }

      setStudios(
        records.map((studio) => ({
          ...studio,
          isDatabaseRecord:
            studio.isDatabaseRecord ??
            (Boolean(studio._id) &&
              typeof studio.ownerId === "string" &&
              studio.ownerId.length > 0),
        })),
      );
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }, [category, featuredOnly]);

  const visibleStudios = useMemo(
    () =>
      studios.filter(
        (studio) =>
          (!featuredOnly || studio.isFeatured === true) &&
          (!category || studioMatchesCategory(studio, category)),
      ),
    [category, featuredOnly, studios],
  );

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (active) return loadStudios();
    });
    window.addEventListener("studios:changed", loadStudios);
    return () => {
      active = false;
      window.removeEventListener("studios:changed", loadStudios);
    };
  }, [loadStudios]);

  // GSAP Animation
  useEffect(() => {
    if (
      loading ||
      error ||
      visibleStudios.length === 0 ||
      !cardsRef.current ||
      !sectionRef.current
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".studio-card",
        {
          y: 50,
          opacity: 0,
          scale: 0.97,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, error, visibleStudios]);

  // Reusable Studio Card
  const StudioCard = ({ studio }: StudioCardProps) => (
    <article className="studio-card group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white transition-[border-color,box-shadow,translate] duration-500 hover:-translate-y-2 hover:border-purple-200 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">

      {/* Studio Image */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={studio.image}
          alt={studio.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

        {/* Category */}
        <span className="absolute left-5 top-5 rounded-full border border-white/30 bg-white/90 px-4 py-2 text-xs font-semibold text-gray-900 shadow-sm backdrop-blur-md">
          {studio.category}
        </span>

        {/* Availability */}
        <span className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-white/30 bg-white/90 px-3 py-2 text-xs font-semibold text-gray-800 shadow-sm backdrop-blur-md">
          <span
            className={`h-2 w-2 rounded-full ${
              studio.isAvailable
                ? "bg-emerald-500"
                : "bg-red-500"
            }`}
          />

          {studio.isAvailable ? "Available" : "Unavailable"}
        </span>

        {/* Location */}
        <div className="absolute bottom-5 left-5">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <MapPin size={15} />
            {studio.location.area}, {studio.location.city}
          </div>
        </div>
      </div>

      {/* Studio Content */}
      <div className="p-6">

        {/* Title and Rating */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-purple-600">
            {studio.title}
          </h3>

          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5 text-sm font-semibold text-amber-600">
            <Star size={14} fill="currentColor" />
            {studio.rating}
          </div>
        </div>

        {/* Description */}
        <p className="mb-5 line-clamp-2 min-h-10 text-sm leading-6 text-gray-500">
          {studio.description}
        </p>

        {/* Extra Details */}
        <div className="mb-5 flex items-center gap-5 border-b border-gray-100 pb-5 text-xs font-medium text-gray-500">
          <span className="flex items-center gap-2">
            <Users size={15} />
            {studio.capacity} Guests
          </span>

          <span className="flex items-center gap-2">
            <Star size={14} />
            {studio.totalReviews} Reviews
          </span>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-gray-400">
              Starting from
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              ${studio.hourlyRate}

              <span className="text-sm font-normal text-gray-400">
                {" "}/ hr
              </span>
            </p>
          </div>

          <Link
            href={`/Studiodetails/${studio._id || studio.slug}`}
            className="group/btn inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-600/20"
          >
            View Details

            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
            />
          </Link>
        </div>
        <div className="mt-4">
          <StudioCardActions studio={studio} />
        </div>
      </div>
    </article>
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white px-5 py-24 text-gray-900 md:px-10 lg:px-16"
    >
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-purple-100/60 blur-[130px]" />

      <div className="pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-blue-100/60 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl">

        {/* Section Heading */}
        <div>
          <h1 className="container mx-auto pb-10 pt-10 text-center text-4xl text-black">
            {category ? `${category}` : "Featured Studios"}
          </h1>
        </div>

        {/* Loading */}
        {loading && (
          <div className="cursor-pointer grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[410px] animate-pulse rounded-2xl border border-gray-200 bg-gray-100"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
            <p className="font-semibold text-red-600">{error}</p>

            <p className="mt-2 text-sm text-gray-500">
              Make sure your backend server is running on port 5000.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && visibleStudios.length === 0 && (
          <p className="py-20 text-center text-gray-500">
            {category
              ? `No studios found in ${category}.`
              : "No studios available right now."}
          </p>
        )}

        {/* First 6 Studio Cards */}
        {!loading && !error && visibleStudios.length > 0 && (
          <>
            <div
              ref={cardsRef}
              className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3"
            >
              {(category ? visibleStudios : visibleStudios.slice(0, 6)).map(
                (studio, index) => (
                  <StudioCard
                    key={
                      studio._id || studio.slug || `${studio.title}-${index}`
                    }
                    studio={studio}
                  />
                ),
              )}
            </div>

            {/* See All Studios */}
            {!category && (
              <div className="mt-14 flex justify-center">
                <Link
                  href="/explore-studios"
                  className="group inline-flex items-center gap-3 rounded-full bg-purple-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-purple-600/15 transition-all duration-300 hover:-translate-y-1 hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-600/25"
                >
                  See All Studios

                  <ArrowUpRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
