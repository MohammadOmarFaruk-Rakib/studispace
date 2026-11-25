
import Link from "next/link";
import {
  ArrowUpRight,
  Camera,
  Clapperboard,
  Mic2,
  Music2,
  Palette,
  Sparkles,
  Target,
  Eye,
  Heart,
} from "lucide-react";

const values = [
  {
    icon: Sparkles,
    title: "Creativity First",
    description:
      "We believe every great idea deserves an inspiring space where creativity can grow without limits.",
  },
  {
    icon: Heart,
    title: "Built for Creators",
    description:
      "Our platform connects photographers, filmmakers, musicians, and artists with spaces made for their craft.",
  },
  {
    icon: Target,
    title: "Accessibility Matters",
    description:
      "We make discovering and booking creative spaces simple, transparent, and accessible.",
  },
];

const studioTypes = [
  { icon: Camera, name: "Photography" },
  { icon: Clapperboard, name: "Film Production" },
  { icon: Mic2, name: "Podcasting" },
  { icon: Music2, name: "Music Production" },
  { icon: Palette, name: "Art & Design" },
];

export default function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">

      {/* Background Decoration */}
      <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-purple-100/70 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">

        {/* Header */}


        {/* Main About Layout */}
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">

          {/* Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">

              <div className="space-y-4 pt-12">
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=700"
                    alt="Creative workspace"
                    className="h-64 w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>

                <div className="overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=700"
                    alt="Music production studio"
                    className="h-48 w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=700"
                    alt="Creative production"
                    className="h-48 w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>

                <div className="overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=700"
                    alt="Art and design workspace"
                    className="h-64 w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>

            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-6 left-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-xl md:-left-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <Sparkles size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    Your vision, your space.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-6 lg:pt-0">

            <h3 className="mt-4 text-3xl font-bold leading-tight text-[#171522] md:text-4xl">
              More than a space.
              <br />
              A place for possibilities.
            </h3>

            <p className="mt-6 text-sm leading-8 text-gray-500 md:text-base">
              Whether you&apos;re capturing your next photograph, recording a
              podcast, producing music, or creating your next masterpiece,
              finding the right environment makes all the difference.
            </p>

            <p className="mt-4 text-sm leading-8 text-gray-500 md:text-base">
              StudioSpace brings creative professionals and studio owners
              together in one place. Explore unique spaces, discover new
              possibilities, and focus on what matters most — creating
              something extraordinary.
            </p>

            {/* Studio Types */}
            <div className="mt-8 flex flex-wrap gap-2">
              {studioTypes.map(({ icon: Icon, name }) => (
                <div
                  key={name}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600"
                >
                  <Icon size={14} />
                  {name}
                </div>
              ))}
            </div>

            <Link
              href="/explore-studios"
              className="group mt-9 inline-flex items-center gap-3 rounded-xl bg-[#171522] px-6 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-purple-600"
            >
              Discover Our Spaces
              <ArrowUpRight
                size={18}
                className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>

          </div>
        </div>

        {/* Mission & Vision */}
        <div className="mt-32 grid gap-6 md:grid-cols-2">

          <div className="group rounded-3xl border border-gray-100 bg-[#F8F7FC] p-8 transition-all duration-300 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/40 md:p-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
              <Target size={26} />
            </div>

            <h3 className="text-2xl font-bold text-[#171522]">
              Our Mission
            </h3>

            <p className="mt-4 text-sm leading-8 text-gray-500">
              To make creative spaces easier to discover and access by
              connecting creators with inspiring studios, empowering studio
              owners, and simplifying the entire booking experience.
            </p>
          </div>

          <div className="group rounded-3xl border border-gray-100 bg-[#F8F7FC] p-8 transition-all duration-300 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/40 md:p-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
              <Eye size={26} />
            </div>

            <h3 className="text-2xl font-bold text-[#171522]">
              Our Vision
            </h3>

            <p className="mt-4 text-sm leading-8 text-gray-500">
              To build a connected creative community where every creator
              can find the right space, collaborate with others, and turn
              imaginative ideas into meaningful experiences.
            </p>
          </div>

        </div>

        {/* Core Values */}
        <div className="mt-32">

          <div className="mb-12 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">
              What Drives Us
            </span>

            <h3 className="mt-4 text-3xl font-bold text-[#171522] md:text-4xl">
              The values behind StudioSpace
            </h3>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500">
              Everything we build is guided by our commitment to making
              creativity more accessible and meaningful.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {values.map(({ icon: Icon, title, description }, index) => (
              <div
                key={title}
                className="group rounded-2xl border border-gray-100 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/40"
              >
                <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                  <Icon size={23} />
                </div>

                <span className="text-xs font-semibold text-purple-500">
                  0{index + 1}
                </span>

                <h4 className="mt-3 text-xl font-bold text-[#171522]">
                  {title}
                </h4>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
