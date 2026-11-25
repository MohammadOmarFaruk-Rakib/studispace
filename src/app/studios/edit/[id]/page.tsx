"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import StudioCardActions from "@/components/StudioCardActions";
import { useSession } from "@/lib/auth-client";
import { studioRequest } from "@/lib/studio-api";
import { isStudioRecord } from "@/lib/studio-data";
import type { EditableStudio } from "@/lib/types";

function isEditableStudio(value: unknown): value is EditableStudio {
  return isStudioRecord(value) && typeof value._id === "string";
}

function getStudioResponse(value: unknown): unknown {
  if (typeof value !== "object" || value === null || !("data" in value)) {
    return value;
  }
  return value.data;
}

export default function EditStudioPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [studio, setStudio] = useState<EditableStudio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(`/studios/edit/${params.id}`)}`);
      return;
    }

    const controller = new AbortController();
    void studioRequest<unknown>(`/Studio/${encodeURIComponent(params.id)}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        const record = getStudioResponse(response);
        if (!isEditableStudio(record)) {
          throw new Error("The studio API returned invalid studio data.");
        }
        setStudio(record);
      })
      .catch((loadError: unknown) => {
        if (loadError instanceof Error && loadError.name === "AbortError") {
          return;
        }
        console.error("Failed to load studio for editing:", loadError);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load this studio.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [isPending, params.id, router, session?.user]);

  if (isPending || loading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-slate-500">Loading studio details...</p>
      </main>
    );
  }

  if (!session?.user) return null;

  if (error || !studio) {
    return (
      <main className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center gap-4 px-5 text-center">
        <h1 className="text-xl font-semibold text-slate-900">
          Could not open this studio for editing
        </h1>
        <p role="alert" className="text-sm text-red-700">
          {error || "Studio not found."}
        </p>
        <Link
          href="/my-listings"
          className="rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white"
        >
          Return to my listings
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[60vh] bg-slate-50 px-5 py-12">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
        <Link
          href="/my-listings"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to my listings
        </Link>
        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Update studio
        </h1>
        <p className="mt-2 text-slate-600">
          Edit your workspace details. Only you and the administrator can make
          changes to this listing.
        </p>
        <div className="mt-6">
          <StudioCardActions
            studio={studio}
            autoEdit
            editLabel="Edit studio details"
            onChanged={() => router.push("/my-listings")}
          />
        </div>
      </div>
    </main>
  );
}
