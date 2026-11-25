"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  getStudioBookings,
  cancelStudioBooking,
} from "@/lib/bookings";
import type { StudioBooking } from "@/lib/types";

export default function MyBookingsPage() {
  const { data: session, isPending } = useSession();
  const [bookings, setBookings] = useState<StudioBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingToCancel, setBookingToCancel] = useState<StudioBooking | null>(
    null,
  );
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelBooking = async () => {
    if (!session?.user || !bookingToCancel) return;

    try {
      setIsCancelling(true);
      await cancelStudioBooking(bookingToCancel.id);
      setBookings(await getStudioBookings());
      setBookingToCancel(null);
      toast.success("Booking request cancelled.");
    } catch (cancelError) {
      console.error("Failed to cancel booking:", cancelError);
      const message =
        cancelError instanceof Error
          ? cancelError.message
          : "Unable to cancel this booking.";
      setError(message);
      toast.error(message);
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) return;

    let active = true;
    void getStudioBookings()
      .then((loadedBookings) => {
        if (!active) return;
        setBookings(loadedBookings);
        setError("");
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        console.error("Failed to load booking requests:", loadError);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load your booking requests.",
        );
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isPending, session?.user]);

  if (isPending || (session?.user && isLoading)) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#faf9f7] px-5">
        <p className="text-sm text-slate-500">Loading your bookings...</p>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-5 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
          <CalendarDays size={26} />
        </div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Sign in to view your bookings
        </h1>
        <Link
          href="/login?callbackUrl=%2Fmy-bookings"
          className="rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-800"
        >
          Sign in
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] px-4 py-12 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-700">
              Your studio plans
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              My Bookings
            </h1>
            <p className="mt-2 text-slate-500">
              Keep track of the creative spaces you’ve requested.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-purple-100 bg-white px-4 py-2 text-sm font-semibold text-purple-800 shadow-sm">
            <CalendarDays size={16} aria-hidden="true" />
            {bookings.length} {bookings.length === 1 ? "request" : "requests"}
          </div>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {!error && bookings.length === 0 && (
          <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
              <CalendarDays size={30} aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Your bookings will appear here
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Find a studio you love and select “Book Workspace Now” to add a
              booking request to your list.
            </p>
            <Link
              href="/explore-studios"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-800"
            >
              Explore studios
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </section>
        )}

        {!error && bookings.length > 0 && (
          <section className="grid gap-5 md:grid-cols-2">
            {bookings.map((booking) => (
              <article
                key={booking.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative h-56 bg-slate-100">
                  <Image
                    src={booking.image}
                    alt={booking.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm">
                    {booking.category}
                  </span>
                  <span
                    className={`absolute right-4 top-4 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ${
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
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl font-bold text-slate-900">
                      {booking.title}
                    </h2>
                    <p className="shrink-0 text-lg font-bold text-purple-800">
                      ${booking.hourlyRate}
                      <span className="text-xs font-normal text-slate-500">
                        {" "}
                        / hour
                      </span>
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={15} aria-hidden="true" />
                      {[booking.area, booking.city].filter(Boolean).join(", ")}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 size={15} aria-hidden="true" />
                      {new Date(booking.startsAt).toLocaleString()} ·{" "}
                      {booking.durationHours}{" "}
                      {booking.durationHours === 1 ? "hour" : "hours"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    Estimated total: ${booking.totalPrice}
                    {booking.securityDeposit > 0 &&
                      ` · Security deposit: $${booking.securityDeposit}`}
                  </p>
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between gap-3">
                      <Link
                        href={`/Studiodetails/${booking.studioId}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 transition hover:text-purple-900"
                      >
                        View studio
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </Link>
                      {booking.status === "Pending" && (
                        <button
                          type="button"
                          onClick={() => setBookingToCancel(booking)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                        >
                          Cancel booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
      {bookingToCancel && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isCancelling) {
              setBookingToCancel(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-booking-title"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
          >
            <h2
              id="cancel-booking-title"
              className="text-xl font-bold text-slate-900"
            >
              Cancel this booking request?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The request for {bookingToCancel.title} will be marked cancelled.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => setBookingToCancel(null)}
                className="h-11 rounded-xl border border-slate-200 font-semibold text-slate-700"
              >
                Keep booking
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleCancelBooking}
                className="h-11 rounded-xl bg-red-600 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {isCancelling ? "Cancelling..." : "Cancel request"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
