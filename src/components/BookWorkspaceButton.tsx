"use client";

import { useState, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  LoaderCircle,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { saveStudioBooking } from "@/lib/bookings";
import type { BookWorkspaceButtonProps } from "@/lib/types";

export default function BookWorkspaceButton({
  studio,
  available,
}: BookWorkspaceButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [isBooking, setIsBooking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [durationHours, setDurationHours] = useState("2");

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const openBooking = () => {
    if (!session?.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    setIsModalOpen(true);
  };

  const handleBook = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session?.user) {
      setIsModalOpen(false);
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    const duration = Number(durationHours);
    if (!bookingDate || !startTime || !Number.isInteger(duration) || duration < 1 || duration > 24) {
      toast.error("Choose a date, start time, and duration from 1 to 24 hours.");
      return;
    }

    if (new Date(`${bookingDate}T${startTime}`).getTime() <= Date.now()) {
      toast.error("Choose a future booking time.");
      return;
    }

    setIsBooking(true);
    try {
      await saveStudioBooking({
        studioId: studio.id,
        startsAt: new Date(`${bookingDate}T${startTime}`).toISOString(),
        durationHours: duration,
      });
      toast.success("Booking request sent and saved as pending.");
      setIsModalOpen(false);
      router.push("/my-bookings");
    } catch (error) {
      console.error("Failed to save booking request:", error);
      toast.error(
        error instanceof Error ? error.message : "Unable to save this booking.",
      );
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <>
      <button
        type="button"
        disabled={!available || isBooking || isPending}
        onClick={openBooking}
        className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition shadow-lg shadow-purple-600/20"
      >
        {isBooking ? (
          <LoaderCircle size={19} className="animate-spin" aria-hidden="true" />
        ) : (
          <CalendarDays size={19} aria-hidden="true" />
        )}
        {!available
          ? "Currently unavailable"
          : isBooking
            ? "Saving request..."
            : "Book Workspace Now"}
        {!isBooking && <ArrowUpRight size={17} aria-hidden="true" />}
      </button>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isBooking) {
              setIsModalOpen(false);
            }
          }}
        >
          <form
            onSubmit={handleBook}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-700">
                  Booking request
                </p>
                <h2
                  id="booking-modal-title"
                  className="mt-2 text-2xl font-bold text-slate-900"
                >
                  Choose your session
                </h2>
                <p className="mt-1 text-sm text-slate-500">{studio.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isBooking}
                aria-label="Close booking dialog"
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block space-y-2 text-sm font-medium text-slate-700">
                Session date
                <input
                  type="date"
                  required
                  min={today}
                  value={bookingDate}
                  onChange={(event) => setBookingDate(event.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-purple-500"
                />
              </label>
              <label className="block space-y-2 text-sm font-medium text-slate-700">
                Start time
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-purple-500"
                />
              </label>
              <label className="block space-y-2 text-sm font-medium text-slate-700">
                Duration
                <span className="relative block">
                  <Clock3
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <select
                    value={durationHours}
                    onChange={(event) => setDurationHours(event.target.value)}
                    className="h-12 w-full appearance-none rounded-xl border border-slate-200 pl-10 pr-3 outline-none focus:border-purple-500"
                  >
                    {Array.from({ length: 24 }, (_, index) => index + 1).map(
                      (hours) => (
                        <option key={hours} value={hours}>
                          {hours} {hours === 1 ? "hour" : "hours"}
                        </option>
                      ),
                    )}
                  </select>
                </span>
              </label>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl bg-purple-50 px-4 py-3 text-sm">
              <span className="text-slate-600">Estimated total</span>
              <strong className="text-lg text-purple-800">
                ${studio.hourlyRate * Number(durationHours)}
              </strong>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Your request will be saved securely and appear as Pending in My
              Bookings.
            </p>
            <button
              type="submit"
              disabled={isBooking}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-purple-700 font-semibold text-white hover:bg-purple-800 disabled:opacity-60"
            >
              {isBooking && <LoaderCircle size={17} className="animate-spin" />}
              Send booking request
            </button>
          </form>
        </div>
      )}
    </>
  );
}
