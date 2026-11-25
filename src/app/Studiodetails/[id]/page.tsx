
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Star,
  MapPin,
  Users,
  Clock,
  Check,
  Camera,
  ShieldCheck,
  Heart,
  Share2,
  ChevronRight,
} from "lucide-react";
import BookWorkspaceButton from "@/components/BookWorkspaceButton";
import StudioGallery from "@/components/StudioGallery";
import {
  getStudioGalleryImages,
  getStudioRecords,
  isStudioRecord,
  STUDIO_API_URL,
} from "@/lib/studio-data";
import type { StudioDetail, StudioDetailsPageProps } from "@/lib/types";

export default async function StudioDetailsPage({
  params,
}: StudioDetailsPageProps) {
  const { id } = await params;

  let studio: StudioDetail | null = null;

  try {
    const response = await fetch(`${STUDIO_API_URL}/Studios`, {
      cache: "no-store",
    });

    if (response.ok) {
      const result: unknown = await response.json();
      const studios = getStudioRecords(result);
      const matchingStudio = studios?.find(
        (item): item is StudioDetail => isStudioRecord(item) &&
          (item._id === id || item.slug === id),
      );
      studio = matchingStudio || null;
    }
  } catch (error) {
    console.error("Failed to fetch studio:", error);
  }

  if (!studio) {
    return (
      <main className="min-h-screen bg-[#FAFAFC] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6">
            <Camera size={30} />
          </div>

          <h1 className="text-3xl font-bold text-[#191724]">
            Studio not found
          </h1>

          <p className="text-gray-500 mt-3">
            This workspace may have been removed or is no longer available.
          </p>

          <Link
            href="/explore-studios"
            className="inline-flex items-center gap-2 mt-7 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            <ArrowLeft size={18} />
            Explore Studios
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFC] text-[#191724]">

      {/* PAGE CONTAINER */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16 pt-8 pb-20">

        {/* BREADCRUMB */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-purple-600">
              Home
            </Link>
            <ChevronRight size={15} />
            <Link href="/explore-studios" className="hover:text-purple-600">
              Studios
            </Link>
            <ChevronRight size={15} />
            <span className="text-gray-900 font-medium truncate">
              {studio.title}
            </span>
          </div>

          <div className="hidden sm:flex gap-3">
            <button className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2 rounded-full text-sm hover:border-purple-300 transition">
              <Share2 size={16} />
              Share
            </button>

            <button className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2 rounded-full text-sm hover:border-purple-300 transition">
              <Heart size={16} />
              Save
            </button>
          </div>
        </div>

        {/* TITLE */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-7">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-purple-600">
                {studio.categoryName || studio.category}
              </span>

              {studio.isFeatured && (
                <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                  Featured Space
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              {studio.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <MapPin size={16} />
                {studio.location.area}, {studio.location.city}
              </span>

              <span className="flex items-center gap-1.5">
                <Star size={16} className="fill-amber-400 text-amber-400" />
                <strong className="text-gray-900">{studio.rating}</strong>
                ({studio.totalReviews} reviews)
              </span>

              <span className="flex items-center gap-1.5">
                <Users size={16} />
                Up to {studio.capacity} guests
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:hidden">
            <button className="p-3 bg-white border border-gray-200 rounded-full">
              <Share2 size={18} />
            </button>
            <button className="p-3 bg-white border border-gray-200 rounded-full">
              <Heart size={18} />
            </button>
          </div>
        </div>

        <StudioGallery
          title={studio.title}
          images={getStudioGalleryImages(studio)}
        />

        {/* MAIN CONTENT + BOOKING */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-12">

            {/* DESCRIPTION */}
            <section className="border-b border-gray-200 pb-10">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold">
                  About this workspace
                </h2>

                <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                  <ShieldCheck size={17} />
                  {studio.isAvailable ? "Available" : "Currently unavailable"}
                </span>
              </div>

              <p className="text-gray-600 leading-8 text-[15px]">
                {studio.description}
              </p>

              <p className="text-gray-600 leading-8 text-[15px] mt-4">
                Discover a creative environment designed to help you bring
                your ideas to life. Whether you are planning a photography
                session, video production, podcast recording, or creative
                collaboration, this workspace offers a comfortable place
                to create something exceptional.
              </p>
            </section>

            {/* SPECIFICATIONS */}
            <section className="border-b border-gray-200 pb-10">
              <h2 className="text-2xl font-bold mb-7">
                Workspace specifications
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    label: "Guest Capacity",
                    value: `Up to ${studio.capacity} people`,
                    icon: Users,
                  },
                  {
                    label: "Space Type",
                    value: studio.categoryName || studio.category,
                    icon: Camera,
                  },
                  {
                    label: "Booking Type",
                    value: "Hourly booking",
                    icon: Clock,
                  },
                  {
                    label: "Security Deposit",
                    value: `$${Number(studio.securityDeposit || 0).toLocaleString()}`,
                    icon: ShieldCheck,
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.label} className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                        <Icon size={21} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{item.label}</p>
                        <p className="mt-1 font-semibold">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* AMENITIES */}
            <section className="border-b border-gray-200 pb-10">
              <h2 className="text-2xl font-bold mb-7">
                What this space offers
              </h2>

              {studio.amenities?.length ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {studio.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 text-gray-600"
                    >
                      <Check size={16} className="text-green-600" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No amenities have been listed for this workspace yet.
                </p>
              )}
            </section>

            {/* HOST */}
            <section className="border-b border-gray-200 pb-10">
              <h2 className="text-2xl font-bold mb-6">
                Meet your host
              </h2>

              <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
                <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-purple-100 text-xl font-bold text-purple-700">
                  {studio.host?.avatar ? (
                    <Image
                      src={studio.host.avatar}
                      alt=""
                      fill
                      unoptimized
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    (studio.host?.name || "Host").charAt(0).toUpperCase()
                  )}
                </div>

                <div className="flex-1">
                    <h3 className="text-lg font-bold">
                      {studio.host?.name || "Studio Host"}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Workspace owner · {studio.location.city}
                    </p>
                  <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                    <ShieldCheck size={16} className="text-green-600" />
                    Host profile information
                  </div>
                </div>

                {studio.host?.email && (
                  <a
                    href={`mailto:${encodeURIComponent(studio.host.email)}`}
                    className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold transition hover:border-purple-500 hover:text-purple-600"
                  >
                    Contact Host
                  </a>
                )}
              </div>
            </section>

            {/* REVIEWS */}
            <section>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
                <div>
                  <h2 className="text-2xl font-bold">
                    Reviews & experiences
                  </h2>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <Star size={17} className="fill-amber-400 text-amber-400" />
                    <strong className="text-gray-900">{studio.rating}</strong>
                    · {studio.totalReviews} reviews
                  </div>
                </div>

              </div>

              {studio.reviews?.length ? (
                <div className="space-y-6">
                {studio.reviews.map((review, index) => (
                  <article
                    key={`${review.name}-${review.date}-${index}`}
                    className="border-b border-gray-100 pb-6 last:border-0"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 rounded-full bg-[#F0EBFF] text-purple-700 flex items-center justify-center font-bold text-sm">
                        {review.name
                          .split(/\s+/)
                          .slice(0, 2)
                          .map((part) => part.charAt(0).toUpperCase())
                          .join("")}
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm">
                          {review.name}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          {review.date}
                        </p>
                      </div>

                      <div className="ml-auto flex gap-0.5">
                        {Array.from({
                          length: Math.max(0, Math.min(5, review.rating)),
                        }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className="fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 leading-7">
                      {review.comment}
                    </p>
                  </article>
                ))}
              </div>
              ) : (
                <p className="rounded-xl bg-slate-50 p-5 text-sm text-gray-500">
                  No reviews have been added for this workspace yet.
                </p>
              )}
            </section>
          </div>

          {/* RIGHT BOOKING CARD */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 bg-white border border-gray-200 rounded-3xl p-6 shadow-[0_12px_50px_rgba(20,15,40,0.06)]">

              <div className="flex items-end gap-1 mb-2">
                <span className="text-3xl font-bold">
                  ${studio.hourlyRate}
                </span>
                <span className="text-gray-500 text-sm mb-1">
                  / hour
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-7">
                <Star size={15} className="fill-amber-400 text-amber-400" />
                <strong className="text-gray-900">{studio.rating}</strong>
                ({studio.totalReviews} reviews)
              </div>

              <div className="border border-gray-200 rounded-2xl overflow-hidden mb-5">
                <div className="p-4 border-b border-gray-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Workspace
                  </p>
                  <p className="font-semibold text-sm">{studio.title}</p>
                </div>

                <div className="grid grid-cols-2">
                  <div className="p-4 border-r border-gray-200">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                      Location
                    </p>
                    <p className="text-sm font-medium">{studio.location.city}</p>
                  </div>

                  <div className="p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                      Capacity
                    </p>
                    <p className="text-sm font-medium">{studio.capacity} guests</p>
                  </div>
                </div>
              </div>

              <BookWorkspaceButton
                available={studio.isAvailable}
                studio={{
                  id: studio._id || studio.slug,
                  title: studio.title,
                  image: studio.image,
                  category: studio.categoryName || studio.category,
                  hourlyRate: studio.hourlyRate,
                  city: studio.location.city,
                  area: studio.location.area,
                }}
              />

              <p className="text-center text-xs text-gray-400 mt-4">
                A booking request will be added to your My Bookings page.
              </p>

              <div className="border-t border-gray-100 mt-6 pt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <ShieldCheck size={18} className="text-purple-600" />
                  Booking details before confirmation
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Clock size={18} className="text-purple-600" />
                  Flexible hourly booking
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Users size={18} className="text-purple-600" />
                  Space for {studio.capacity} guests
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}
