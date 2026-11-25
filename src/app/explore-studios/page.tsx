import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Star, Users } from "lucide-react";
import StudioCardActions from "@/components/StudioCardActions";
import {
  getStudioRecords,
  isStudioRecord,
  studioMatchesCategory,
  STUDIO_API_URL,
} from "@/lib/studio-data";
import type { ExploreStudio, ExploreStudiosPageProps } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ExploreStudiosPage({
  searchParams,
}: ExploreStudiosPageProps) {
  const { category } = await searchParams;
  let studios: ExploreStudio[] = [];
  let error = "";

  try {
    const response = await fetch(`${STUDIO_API_URL}/Studios?available=true`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch studios (${response.status})`);
    }

    const data: unknown = await response.json();
    const results = getStudioRecords(data);

    if (!results) {
      throw new Error("The studios API returned an invalid response");
    }

    if (!results.every(isStudioRecord)) {
      throw new Error("The studios API returned invalid studio data");
    }

    studios = results.map((studio) => ({
      ...studio,
      isDatabaseRecord:
        studio.isDatabaseRecord ??
        (Boolean(studio._id) &&
          typeof studio.ownerId === "string" &&
          studio.ownerId.length > 0),
    }));
  } catch (fetchError) {
    error =
      fetchError instanceof Error
        ? fetchError.message
        : "Something went wrong while loading studios";
  }

  const visibleStudios = category
    ? studios.filter((studio) => studioMatchesCategory(studio, category))
    : studios;

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">


        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center"
          >
            <p className="font-semibold text-red-600">{error}</p>
            <p className="mt-2 text-sm text-gray-600">
              Make sure your backend server is running on port 5000.
            </p>
          </div>
        )}

        {!error && visibleStudios.length === 0 && (
          <p className="py-20 text-center text-gray-500">
            {category
              ? `No studios found in ${category}.`
              : "No studios available right now."}
          </p>
        )}

        {!error && visibleStudios.length > 0 && (
          <>
            <p className="mb-5 text-sm text-gray-500">
              Showing {visibleStudios.length}{" "}
              {visibleStudios.length === 1 ? "studio" : "studios"}
            </p>
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {visibleStudios.map((studio, index) => (
                <article
                  key={studio._id || studio.slug || `${studio.title}-${index}`}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl"
                >
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <Image
                      src={studio.image}
                      alt={studio.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-900">
                      {studio.categoryName || studio.category}
                    </span>
                    <span className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-800">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          studio.isAvailable ? "bg-emerald-500" : "bg-red-500"
                        }`}
                      />
                      {studio.isAvailable ? "Available" : "Unavailable"}
                    </span>
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-sm font-medium text-white drop-shadow">
                      <MapPin size={15} />
                      {studio.location.area}, {studio.location.city}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h2 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-purple-700">
                        {studio.title}
                      </h2>
                      <span className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-sm font-semibold text-amber-600">
                        <Star size={14} fill="currentColor" />
                        {studio.rating}
                      </span>
                    </div>
                    <p className="mb-5 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500">
                      {studio.description}
                    </p>
                    <div className="mb-5 flex items-center gap-5 border-b border-gray-100 pb-4 text-xs font-medium text-gray-500">
                      <span className="flex items-center gap-2">
                        <Users size={15} />
                        {studio.capacity} Guests
                      </span>
                      <span className="flex items-center gap-2">
                        <Star size={14} />
                        {studio.totalReviews} Reviews
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xl font-bold text-gray-900">
                        ${studio.hourlyRate}
                        <span className="text-sm font-normal text-gray-400">
                          {" "}
                          / hr
                        </span>
                      </p>
                      <Link
                        href={`/Studiodetails/${studio._id || studio.slug}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                      >
                        View Details
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </Link>
                    </div>
                    <div className="mt-4">
                      <StudioCardActions studio={studio} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
