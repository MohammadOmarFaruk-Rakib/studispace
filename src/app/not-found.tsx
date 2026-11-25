import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-slate-50 px-5 py-16">
      <div className="max-w-lg text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-purple-100 text-purple-700">
          <Camera size={38} aria-hidden="true" />
        </div>
        <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-purple-700">
          404 · Off set
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          This studio isn’t in frame
        </h1>
        <p className="mt-3 text-slate-600">
          The page may have moved, or the workspace is no longer available.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-purple-700 px-5 py-3 font-semibold text-white transition hover:bg-purple-800"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Return to Home
        </Link>
      </div>
    </main>
  );
}
