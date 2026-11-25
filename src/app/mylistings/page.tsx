"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { studioRequest } from "@/lib/studio-api";
import { getStudioRecords, isStudioRecord } from "@/lib/studio-data";
import { isStudioAdmin } from "@/lib/studio-permissions";
import StudioCardActions from "@/components/StudioCardActions";
import toast from "react-hot-toast";
import {
  Plus,
  MapPin,
  Users,
  Trash2,
  Building2,
  Star,
  Search,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  ImageIcon,
  RotateCw,
} from "lucide-react";
import type {
  StudioListing,
  StudioListingFilter,
  StudioListingFilterOption,
} from "@/lib/types";

function isListingRecord(value: unknown): value is StudioListing {
  return isStudioRecord(value) && typeof value._id === "string";
}

const FILTERS: StudioListingFilterOption[] = [
  { key: "all", label: "All" },
  { key: "available", label: "Available" },
  { key: "unavailable", label: "Unavailable" },
  { key: "featured", label: "Featured" },
];

const getLocation = (location: StudioListing["location"]) =>
  [location.area, location.city, location.country]
    .filter(Boolean)
    .join(", ") || "Location not provided";

export default function MyListingsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const isAdmin = isStudioAdmin(session?.user);

  const [studios, setStudios] = useState<StudioListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudio, setSelectedStudio] = useState<StudioListing | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StudioListingFilter>("all");

  // ========================================
  // Fetch
  // ========================================

  const loadStudios = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError("");

      const result = await studioRequest<unknown>(
        isAdmin ? "/Studios" : "/my-studios",
        {
          signal,
          headers: { Accept: "application/json" },
        },
      );
      const records = getStudioRecords(result);
      if (!records || !records.every(isListingRecord)) {
        throw new Error("The studios API returned invalid studio data");
      }

      setStudios(records);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    const controller = new AbortController();
    void Promise.resolve().then(() => {
      if (!controller.signal.aborted) {
        return loadStudios(controller.signal);
      }
    });
    return () => controller.abort();
  }, [session, isPending, isAdmin, router, loadStudios]);

  // ========================================
  // Delete
  // ========================================

  const handleDelete = async () => {
    const canManageSelected =
      isAdmin || selectedStudio?.ownerId === session?.user?.id;
    if (!canManageSelected || !selectedStudio) return;

    try {
      setDeleting(true);

      await studioRequest(`/Studio/${encodeURIComponent(selectedStudio._id)}`, {
        method: "DELETE",
      });

      setStudios((prev) => prev.filter((s) => s._id !== selectedStudio._id));
      toast.success("Studio listing deleted successfully");
      setSelectedStudio(null);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to delete studio");
    } finally {
      setDeleting(false);
    }
  };

  // Close modal with Escape key
  useEffect(() => {
    if (!selectedStudio) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !deleting) setSelectedStudio(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedStudio, deleting]);

  // ========================================
  // Derived data
  // ========================================

  const stats = useMemo(
    () => ({
      total: studios.length,
      featured: studios.filter((s) => s.isFeatured).length,
      available: studios.filter((s) => s.isAvailable !== false).length,
    }),
    [studios]
  );

  const visibleStudios = useMemo(() => {
    const q = query.trim().toLowerCase();

    return studios.filter((s) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "available" && s.isAvailable !== false) ||
        (filter === "unavailable" && s.isAvailable === false) ||
        (filter === "featured" && !!s.isFeatured);

      if (!matchesFilter) return false;
      if (!q) return true;

      const haystack = [s.title, s.categoryName, s.category, getLocation(s.location)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [studios, query, filter]);

  // ========================================
  // Loading (skeleton)
  // ========================================

  if (isPending || (session?.user && loading)) {
    return (
      <main className="min-h-screen bg-stone-50 px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="mb-10 h-10 w-64 rounded-xl bg-stone-200" />
          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-white" />
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-white" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-5 text-center">
        <h1 className="text-2xl font-semibold text-stone-900">
          Sign in to view your studio listings
        </h1>
        <Link
          href="/login?callbackUrl=%2Fmylistings"
          className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-900"
        >
          Sign in
        </Link>
      </main>
    );
  }

  // ========================================
  // Page
  // ========================================

  const statCards = [
    {
      label: "Total Listings",
      value: stats.total,
      icon: Building2,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Featured",
      value: stats.featured,
      icon: Star,
      tone: "bg-amber-50 text-amber-600",
    },
    {
      label: "Available",
      value: stats.available,
      icon: CheckCircle2,
      tone: "bg-sky-50 text-sky-600",
    },
  ];

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              {isAdmin ? "Studio Management" : "Your Studio Listings"}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              {isAdmin ? "All Studio Listings" : "My Listings"}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-stone-500 sm:text-base">
              {isAdmin
                ? "Review and manage every studio listing in one place."
                : "View and manage the studios you have added."}
            </p>
          </div>

          <Link
            href="/add-studio"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-900 active:scale-[0.98]"
          >
            <Plus size={18} />
            Add New Studio
          </Link>
        </header>

        {/* Stats */}
        <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {statCards.map(({ label, value, icon: Icon, tone }) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm"
            >
              <div>
                <p className="text-sm font-medium text-stone-500">{label}</p>
                <p className="mt-1 text-3xl font-bold text-stone-900">{value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>
                <Icon size={22} />
              </div>
            </div>
          ))}
        </section>

        {/* Toolbar */}
        <section className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Your Studios</h2>
            <p className="mt-1 text-sm text-stone-500">
              Showing {visibleStudios.length} of {studios.length}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, category, location..."
                className="h-11 w-full rounded-xl border border-stone-200 bg-white pl-10 pr-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 sm:w-72"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto rounded-xl border border-stone-200 bg-white p-1">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                    filter === f.key
                      ? "bg-emerald-800 text-white shadow-sm"
                      : "text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle size={19} className="shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => loadStudios()}
              className="inline-flex items-center gap-2 self-start rounded-lg bg-white px-3 py-1.5 font-semibold text-red-700 shadow-sm ring-1 ring-red-200 transition hover:bg-red-100 sm:self-auto"
            >
              <RotateCw size={14} />
              Retry
            </button>
          </div>
        )}

        {/* Empty: no studios at all */}
        {!error && studios.length === 0 && (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Building2 size={36} />
            </div>
            <h3 className="mt-6 text-xl font-bold text-stone-900">No studios listed yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
              Add your creative space to share it with people looking for their next production location.
            </p>
            <Link
              href="/add-studio"
              className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-800 px-6 text-sm font-semibold text-white transition hover:bg-emerald-900"
            >
              <Plus size={18} />
              Create Your First Listing
            </Link>
          </div>
        )}

        {/* Empty: filter/search returned nothing */}
        {!error && studios.length > 0 && visibleStudios.length === 0 && (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
            <p className="font-semibold text-stone-800">No studios match your filters</p>
            <p className="mt-1 text-sm text-stone-500">Try a different search or filter.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
              className="mt-5 text-sm font-semibold text-emerald-700 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Cards */}
        {visibleStudios.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleStudios.map((studio) => {
              const unavailable = studio.isAvailable === false;
                const canManageStudio =
                  isAdmin || studio.ownerId === session?.user?.id;

              return (
                <article
                  key={studio._id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/70 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-900/5"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden bg-stone-100">
                    {studio.image ? (
                      <img
                        src={studio.image}
                        alt={studio.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-stone-400">
                        <ImageIcon size={40} />
                      </div>
                    )}

                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      {studio.isFeatured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-amber-950 shadow-sm">
                          <Star size={12} fill="currentColor" />
                          Featured
                        </span>
                      )}
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${
                          unavailable ? "bg-stone-900 text-white" : "bg-emerald-500 text-white"
                        }`}
                      >
                        {unavailable ? "Unavailable" : "Available"}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 rounded-xl bg-white/95 px-3 py-2 shadow-sm backdrop-blur">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-stone-500">
                        Hourly
                      </p>
                      <p className="text-lg font-bold leading-tight text-emerald-800">
                        ${Number(studio.hourlyRate || 0).toLocaleString()}
                        <span className="text-xs font-medium text-stone-500"> /hr</span>
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                      {studio.categoryName || studio.category || "Studio"}
                    </p>
                    <h3 className="mt-1.5 line-clamp-1 text-lg font-bold text-stone-900">
                      {studio.title}
                    </h3>

                    <div className="mt-2 flex items-center gap-1.5 text-sm text-stone-500">
                      <MapPin size={15} className="shrink-0 text-emerald-700" />
                      <span className="line-clamp-1">{getLocation(studio.location)}</span>
                    </div>

                    {studio.description && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-500">
                        {studio.description}
                      </p>
                    )}

                    <div className="mt-auto pt-5">
                      <div className="mb-4 flex items-center justify-between border-t border-stone-100 pt-3 text-xs text-stone-500">
                        <span className="flex items-center gap-1.5">
                          <Users size={14} />
                          {studio.maxCapacity || studio.capacity || "—"} guests
                        </span>
                        <span className="font-mono">#{studio._id.slice(-6).toUpperCase()}</span>
                      </div>

                      {canManageStudio ? (
                        <div className="grid grid-cols-[1fr_auto] gap-3">
                          <StudioCardActions
                            studio={studio}
                            canManage={canManageStudio}
                            showDelete={false}
                            editLabel="Edit Listing"
                            editClassName="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:opacity-50"
                            onChanged={() => void loadStudios()}
                          />
                          <button
                            type="button"
                            onClick={() => setSelectedStudio(studio)}
                            aria-label={`Delete ${studio.title}`}
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      ) : (
                        <Link
                          href={`/Studiodetails/${studio._id}`}
                          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-emerald-800 px-4 text-sm font-semibold text-white transition hover:bg-emerald-900"
                        >
                          View Studio
                        </Link>
                      )}
                      </div>
                    </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete modal */}
      {(isAdmin || selectedStudio?.ownerId === session?.user?.id) &&
        selectedStudio && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/50 px-4 backdrop-blur-sm"
          onClick={() => !deleting && setSelectedStudio(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-5 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Trash2 size={22} />
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudio(null)}
                disabled={deleting}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <h3 id="delete-title" className="text-xl font-bold text-stone-900">
              Delete this listing?
            </h3>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              <span className="font-semibold text-stone-800">{selectedStudio.title}</span> will be
              permanently removed. This action cannot be undone.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setSelectedStudio(null)}
                className="h-11 rounded-xl border border-stone-200 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
