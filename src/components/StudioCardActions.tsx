"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Pencil, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { studioRequest } from "@/lib/studio-api";
import { isStudioAdmin } from "@/lib/studio-permissions";
import type { StudioCardActionsProps } from "@/lib/types";

export default function StudioCardActions({
  studio,
  onChanged,
  canManage: canManageOverride,
  autoEdit = false,
  showDelete = true,
  editLabel = "Edit",
  editClassName,
}: StudioCardActionsProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState(studio.title);
  const [description, setDescription] = useState(studio.description);
  const [category, setCategory] = useState(
    studio.categoryName || studio.category,
  );
  const [image, setImage] = useState(studio.image);
  const [hourlyRate, setHourlyRate] = useState(String(studio.hourlyRate));
  const [securityDeposit, setSecurityDeposit] = useState(
    String(studio.securityDeposit || 0),
  );
  const [capacity, setCapacity] = useState(String(studio.capacity));
  const [amenities, setAmenities] = useState(
    (studio.amenities || []).join(", "),
  );
  const [galleryUrls, setGalleryUrls] = useState(
    (studio.gallery || []).join("\n"),
  );
  const [area, setArea] = useState(studio.location.area);
  const [city, setCity] = useState(studio.location.city);
  const [country, setCountry] = useState(studio.location.country);
  const [isAvailable, setIsAvailable] = useState(studio.isAvailable);

  const canManage =
    Boolean(studio._id) &&
    (canManageOverride ??
      (isStudioAdmin(session?.user) ||
        (Boolean(studio.ownerId) &&
          studio.ownerId === session?.user?.id)));

  useEffect(() => {
    if (autoEdit && canManage) {
      queueMicrotask(() => setIsEditing(true));
    }
  }, [autoEdit, canManage]);

  const closeEditor = () => setIsEditing(false);

  const startEditing = () => {
    setTitle(studio.title);
    setDescription(studio.description);
    setCategory(studio.categoryName || studio.category);
    setImage(studio.image);
    setHourlyRate(String(studio.hourlyRate));
    setSecurityDeposit(String(studio.securityDeposit || 0));
    setCapacity(String(studio.capacity));
    setAmenities((studio.amenities || []).join(", "));
    setGalleryUrls((studio.gallery || []).join("\n"));
    setArea(studio.location.area);
    setCity(studio.location.city);
    setCountry(studio.location.country);
    setIsAvailable(studio.isAvailable);
    setIsEditing(true);
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!studio._id) return;

    const rate = Number(hourlyRate);
    const deposit = Number(securityDeposit);
    const guestCapacity = Number(capacity);
    const gallery = galleryUrls
      .split(/[\n,]+/)
      .map((url) => url.trim())
      .filter(Boolean);
    if (
      !title.trim() ||
      !description.trim() ||
      !category.trim() ||
      !image.trim() ||
      !Number.isFinite(rate) ||
      rate <= 0 ||
      !Number.isFinite(deposit) ||
      deposit < 0 ||
      !Number.isInteger(guestCapacity) ||
      guestCapacity < 1 ||
      gallery.some((url) => {
        try {
          return !["http:", "https:"].includes(new URL(url).protocol);
        } catch {
          return true;
        }
      })
    ) {
      toast.error("Check the studio details and try again.");
      return;
    }

    setIsSaving(true);
    try {
      await studioRequest(`/Studio/${encodeURIComponent(studio._id)}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: title.trim(),
          slug:
            title
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "") || studio.slug,
          description: description.trim(),
          category: category.trim().toLowerCase().replace(/\s+/g, "-"),
          categoryName: category.trim(),
          image: image.trim(),
          gallery,
          hourlyRate: rate,
          securityDeposit: deposit,
          capacity: guestCapacity,
          amenities: amenities
            .split(",")
            .map((amenity) => amenity.trim())
            .filter(Boolean),
          location: {
            area: area.trim(),
            city: city.trim(),
            country: country.trim(),
          },
          isAvailable,
        }),
      });

      toast.success("Studio updated.");
      setIsEditing(false);
      onChanged?.();
      window.dispatchEvent(new Event("studios:changed"));
      router.refresh();
    } catch (error) {
      console.error("Failed to update studio:", error);
      toast.error(
        error instanceof Error ? error.message : "Unable to update studio.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!studio._id || !window.confirm(`Delete "${studio.title}"?`)) return;

    setIsSaving(true);
    try {
      await studioRequest(`/Studio/${encodeURIComponent(studio._id)}`, {
        method: "DELETE",
      });
      toast.success("Studio deleted.");
      onChanged?.();
      window.dispatchEvent(new Event("studios:changed"));
      router.refresh();
    } catch (error) {
      console.error("Failed to delete studio:", error);
      toast.error(
        error instanceof Error ? error.message : "Unable to delete studio.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!canManage) return null;

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={isSaving}
          onClick={startEditing}
          className={
            editClassName ??
            "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700 disabled:opacity-50"
          }
        >
          <Pencil size={15} aria-hidden="true" />
          {editLabel}
        </button>
        {showDelete && (
          <button
            type="button"
            disabled={isSaving}
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 size={15} aria-hidden="true" />
            Delete
          </button>
        )}
      </div>

      {isEditing &&
        typeof document !== "undefined" &&
        createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isSaving) closeEditor();
          }}
        >
          <form
            onSubmit={handleUpdate}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-studio-title"
            className="my-auto w-full max-w-2xl space-y-4 rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2
                id="edit-studio-title"
                className="text-xl font-semibold text-slate-900"
              >
                Edit studio
              </h2>
              <button
                type="button"
                onClick={closeEditor}
                disabled={isSaving}
                aria-label="Close edit form"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-sm font-medium text-slate-700">
                Studio name
                <input
                  required
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="space-y-1 text-sm font-medium text-slate-700">
                Category
                <input
                  required
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="space-y-1 text-sm font-medium text-slate-700 sm:col-span-2">
                Image URL
                <input
                  required
                  type="text"
                  value={image}
                  onChange={(event) => setImage(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="space-y-1 text-sm font-medium text-slate-700 sm:col-span-2">
                Additional gallery image URLs
                <textarea
                  rows={2}
                  value={galleryUrls}
                  onChange={(event) => setGalleryUrls(event.target.value)}
                  placeholder="Add one http or https URL per line"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="space-y-1 text-sm font-medium text-slate-700 sm:col-span-2">
                Description
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="space-y-1 text-sm font-medium text-slate-700">
                Hourly rate
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={hourlyRate}
                  onChange={(event) => setHourlyRate(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="space-y-1 text-sm font-medium text-slate-700">
                Security deposit
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={securityDeposit}
                  onChange={(event) => setSecurityDeposit(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="space-y-1 text-sm font-medium text-slate-700">
                Guest capacity
                <input
                  required
                  type="number"
                  min="1"
                  step="1"
                  value={capacity}
                  onChange={(event) => setCapacity(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="space-y-1 text-sm font-medium text-slate-700 sm:col-span-2">
                Amenities (comma-separated)
                <textarea
                  rows={2}
                  value={amenities}
                  onChange={(event) => setAmenities(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="space-y-1 text-sm font-medium text-slate-700">
                Area
                <input
                  value={area}
                  onChange={(event) => setArea(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="space-y-1 text-sm font-medium text-slate-700">
                City
                <input
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="space-y-1 text-sm font-medium text-slate-700">
                Country
                <input
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="flex items-center gap-2 self-end pb-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(event) => setIsAvailable(event.target.checked)}
                  className="size-4 accent-indigo-600"
                />
                Available for booking
              </label>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Host (read-only)</p>
              <p className="mt-1">
                {studio.host?.name || "Studio Host"} ·{" "}
                {studio.host?.email || studio.ownerEmail || "Email unavailable"}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeEditor}
                disabled={isSaving}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>,
        document.body,
      )}
    </>
  );
}
