"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  CircleAlert,
  Plus,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getStudioBookings } from "@/lib/bookings";
import {
  getStudioRecords,
  isStudioRecord,
} from "@/lib/studio-data";
import { studioRequest } from "@/lib/studio-api";
import { isStudioAdmin } from "@/lib/studio-permissions";
import type { DashboardData } from "@/lib/types";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const [data, setData] = useState<DashboardData>({
    studios: [],
    bookings: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending || !session?.user) return;

    let active = true;
    const studioPath = isStudioAdmin(session.user) ? "/Studios" : "/my-studios";

    void Promise.all([
      studioRequest<unknown>(studioPath),
      getStudioBookings(),
    ])
      .then(([studioResponse, bookings]) => {
        const records = getStudioRecords(studioResponse);
        if (!records || !records.every(isStudioRecord)) {
          throw new Error("The studios API returned invalid studio data.");
        }
        if (!active) return;
        setData({ studios: records, bookings });
        setError("");
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        console.error("Failed to load dashboard:", loadError);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load your dashboard.",
        );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isPending, session?.user]);

  if (isPending || (session?.user && isLoading)) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-5">
        <p className="text-sm text-slate-500">Loading your dashboard...</p>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-5 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">
          Sign in to view your dashboard
        </h1>
        <Link
          href="/login?callbackUrl=%2Fdashboard"
          className="rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-800"
        >
          Sign in
        </Link>
      </main>
    );
  }

  const pendingCount = data.bookings.filter(
    (booking) => booking.status === "Pending",
  ).length;
  const isAdmin = isStudioAdmin(session.user);

  return (
    <main className="min-h-screen bg-[#faf9f7] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 rounded-3xl bg-gradient-to-br from-[#32204f] via-[#55328a] to-[#7749b5] p-7 text-white shadow-xl sm:flex-row sm:items-end sm:justify-between sm:p-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-200">
              StudioSpace overview
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome, {session.user.name || "Creator"}
            </h1>
            <p className="mt-2 text-sm text-purple-100 sm:text-base">
              Manage your spaces and keep up with your booking requests.
            </p>
          </div>
          <Link
            href="/add-studio"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-purple-800 shadow-sm transition hover:bg-purple-50"
          >
            <Plus size={17} aria-hidden="true" />
            Add a studio
          </Link>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <CircleAlert size={18} aria-hidden="true" className="mt-0.5" />
            {error}
          </div>
        )}

        <section
          aria-label="Account summary"
          className="mb-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {[
            {
              label: isAdmin ? "All studio listings" : "Your studio listings",
              value: data.studios.length,
              icon: Building2,
              href: "/my-listings",
            },
            {
              label: "Your booking requests",
              value: data.bookings.length,
              icon: CalendarDays,
              href: "/my-bookings",
            },
            {
              label: "Pending requests",
              value: pendingCount,
              icon: CalendarDays,
              href: "/my-bookings",
            },
            {
              label: "Confirmed bookings",
              value: data.bookings.filter(
                (booking) => booking.status === "Confirmed",
              ).length,
              icon: CalendarDays,
              href: "/my-bookings",
            },
          ].map(({ label, value, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <ArrowUpRight
                  size={17}
                  aria-hidden="true"
                  className="text-slate-400 transition group-hover:text-purple-700"
                />
              </div>
              <p className="mt-5 text-3xl font-bold text-slate-900">{value}</p>
              <p className="mt-1 text-sm text-slate-500">{label}</p>
            </Link>
          ))}
        </section>

        <div className="grid items-start gap-8 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {isAdmin ? "Studio listings" : "Your studios"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {isAdmin
                    ? "Recent listings across StudioSpace."
                    : "The spaces you have shared with creators."}
                </p>
              </div>
              <Link
                href="/my-listings"
                className="shrink-0 text-sm font-semibold text-purple-700 hover:text-purple-900"
              >
                View all
              </Link>
            </div>
            {data.studios.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center">
                <Building2
                  size={25}
                  aria-hidden="true"
                  className="mx-auto text-slate-400"
                />
                <p className="mt-3 font-semibold text-slate-800">
                  No studios listed yet
                </p>
                <Link
                  href="/add-studio"
                  className="mt-3 inline-flex text-sm font-semibold text-purple-700 hover:underline"
                >
                  Add your first studio
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {data.studios.slice(0, 4).map((studio) => (
                  <Link
                    key={studio._id || studio.slug}
                    href={`/Studiodetails/${studio._id || studio.slug}`}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 p-3 transition hover:border-purple-200 hover:bg-purple-50/40"
                  >
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      <Image
                        src={studio.image}
                        alt=""
                        fill
                        unoptimized
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-900">
                        {studio.title}
                      </p>
                      <p className="mt-1 truncate text-sm text-slate-500">
                        {studio.categoryName || studio.category} ·{" "}
                        {studio.location.city}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-slate-700">
                      ${studio.hourlyRate}/hr
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Recent bookings
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your latest workspace reservations.
                </p>
              </div>
              <Link
                href="/my-bookings"
                className="shrink-0 text-sm font-semibold text-purple-700 hover:text-purple-900"
              >
                View all
              </Link>
            </div>
            {data.bookings.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center">
                <CalendarDays
                  size={25}
                  aria-hidden="true"
                  className="mx-auto text-slate-400"
                />
                <p className="mt-3 font-semibold text-slate-800">
                  No booking requests yet
                </p>
                <Link
                  href="/explore-studios"
                  className="mt-3 inline-flex text-sm font-semibold text-purple-700 hover:underline"
                >
                  Explore studios
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {data.bookings.slice(0, 4).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 p-3"
                  >
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      <Image
                        src={booking.image}
                        alt=""
                        fill
                        unoptimized
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-900">
                        {booking.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {new Date(booking.startsAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        booking.status === "Pending"
                          ? "bg-amber-100 text-amber-800"
                          : booking.status === "Confirmed"
                            ? "bg-emerald-100 text-emerald-800"
                            : booking.status === "Cancelled"
                              ? "bg-slate-100 text-slate-600"
                              : "bg-sky-100 text-sky-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
