import Link from "next/link";
import { Camera, Headphones, Mic2, Music2, Palette } from "lucide-react";

const categories = [
  {
    name: "Photo Studios",
    description: "Professional spaces for portraits, products, and creative shoots.",
    icon: Camera,
    accent: "bg-purple-100 text-purple-700",
  },
  {
    name: "Sound Stages",
    description: "Flexible production stages for film, video, and commercial work.",
    icon: Headphones,
    accent: "bg-blue-100 text-blue-700",
  },
  {
    name: "Podcast Rooms",
    description: "Recording-ready rooms for podcasts, interviews, and voice work.",
    icon: Mic2,
    accent: "bg-rose-100 text-rose-700",
  },
  {
    name: "Music Suites",
    description: "Creative suites for recording, mixing, and making music.",
    icon: Music2,
    accent: "bg-amber-100 text-amber-700",
  },
  {
    name: "Art Workshops",
    description: "Inspiring workspaces for artists, makers, and creative classes.",
    icon: Palette,
    accent: "bg-emerald-100 text-emerald-700",
  },
];

export default function Studiocategory() {
  return (
    <section className="bg-slate-50 px-5 py-14 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">
            Find your creative space
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Explore Studio Categories
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-600">
            Choose the space that fits your next project.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map(({ name, description, icon: Icon, accent }) => (
            <Link
              key={name}
              href={`/explore-studios?category=${encodeURIComponent(name)}`}
              className="group rounded-xl border border-gray-200 bg-white p-4 transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 sm:p-5"
            >
              <span className={`mb-3 inline-flex rounded-lg p-2 ${accent}`}>
                <Icon aria-hidden="true" size={20} />
              </span>
              <h3 className="text-base font-semibold leading-5 text-gray-900 transition-colors group-hover:text-purple-700">
                {name}
              </h3>
              <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-gray-600">
                {description}
              </p>
              <span className="mt-3 inline-block text-xs font-semibold text-purple-700">
                Browse studios <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
