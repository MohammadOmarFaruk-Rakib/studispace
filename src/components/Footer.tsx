
import Link from "next/link";

import {
  Camera,
  Clapperboard,
  Mail,
  MapPin,
  Mic2,
  Music2,
  Palette,
  MoveUpRight,
  Globe,
  MessageCircle,
  Video,
} from "lucide-react";

const categories = [
  {
    name: "Photo Studios",
    href: "/explore-studios?category=photo-studios",
    icon: Camera,
  },
  {
    name: "Sound Stages",
    href: "/explore-studios?category=sound-stages",
    icon: Clapperboard,
  },
  {
    name: "Podcast Rooms",
    href: "/explore-studios?category=podcast-rooms",
    icon: Mic2,
  },
  {
    name: "Music Suites",
    href: "/explore-studios?category=music-suites",
    icon: Music2,
  },
  {
    name: "Art Workshops",
    href: "/explore-studios?category=art-workshops",
    icon: Palette,
  },
];

const exploreLinks = [
  { name: "Explore Studios", href: "/explore-studios" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Become a Host", href: "/become-a-host" },
  { name: "About Us", href: "/about" },
];

const supportLinks = [
  { name: "Help Center", href: "/help" },
  { name: "Contact Us", href: "/contact" },
  { name: "Terms & Conditions", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
];

const socialLinks = [
  {
    icon: Camera,
    href: "https://instagram.com",
    label: "Instagram",
  },
  {
    icon: Globe,
    href: "https://x.com",
    label: "X",
  },
  {
    icon: MessageCircle,
    href: "https://linkedin.com",
    label: "LinkedIn",
  },
  {
    icon: Video,
    href: "https://youtube.com",
    label: "YouTube",
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#111019] text-white">

      {/* Background Decoration */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-purple-600/15 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 pt-20 md:px-10">

        

        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-12 pb-16 sm:grid-cols-2 lg:grid-cols-5">

          {/* Brand Section */}
          <div className="lg:col-span-2">

            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500 text-white">
                <Clapperboard size={23} />
              </div>

              <span className="text-2xl font-bold tracking-tight">
                Studio<span className="text-purple-400">Space.</span>
              </span>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-gray-400">
              A creative space marketplace connecting creators with inspiring
              studios. Find your space, create your story, and make something
              extraordinary.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/3 text-gray-400 transition-all duration-300 hover:border-purple-400/40 hover:bg-purple-500 hover:text-white"
                >
                  {label === "X" ? (
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="size-[18px] fill-current"
                    >
                      <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.6 22H2.4l7.3-8.4L1.9 2h6.5l4.5 6.8L18.9 2Zm-1.1 18h1.7L7.4 3.9H5.6L17.8 20Z" />
                    </svg>
                  ) : (
                    <Icon size={18} />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="mb-6 text-sm font-semibold tracking-wide text-white">
              Explore
            </h3>

            <ul className="space-y-4">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-purple-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-6 text-sm font-semibold tracking-wide text-white">
              Categories
            </h3>

            <ul className="space-y-4">
              {categories.map(({ name, href, icon: Icon }) => (
                <li key={name}>
                  <Link
                    href={href}
                    className="group flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-purple-400"
                  >
                    <Icon
                      size={15}
                      className="transition-transform group-hover:scale-110"
                    />
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-6 text-sm font-semibold tracking-wide text-white">
              Support
            </h3>

            <ul className="space-y-4">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-purple-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact */}
            <div className="mt-8">
              <h4 className="mb-4 text-sm font-semibold">
                Get in touch
              </h4>

              <a
                href="mailto:hello@studiospace.com"
                className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-purple-400"
              >
                <Mail size={15} />
                hello@studiospace.com
              </a>

              <p className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                <MapPin size={15} />
                Bangladesh
              </p>
            </div>

            <form
              action="mailto:hello@studiospace.com"
              method="post"
              encType="text/plain"
              className="mt-8"
            >
              <label
                htmlFor="newsletter-email"
                className="mb-3 block text-sm font-semibold"
              >
                Get studio updates
              </label>
              <div className="flex gap-2">
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Your email address"
                  className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-purple-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-purple-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-purple-400"
                >
                  Join
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col justify-between gap-5 border-t border-white/10 py-7 md:flex-row md:items-center">

          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} StudioSpace. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-6">

            <Link
              href="/privacy"
              className="text-xs text-gray-500 transition-colors hover:text-white"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="text-xs text-gray-500 transition-colors hover:text-white"
            >
              Terms
            </Link>

            <Link
              href="/contact"
              className="group flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-purple-400"
            >
              Let&apos;s create together

              <MoveUpRight
                size={13}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>

          </div>
        </div>

      </div>
    </footer>
  );
}
