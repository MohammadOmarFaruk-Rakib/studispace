"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  LayoutDashboard,
  List,
  LogOut,
  Plus,
  UserRound,
} from "lucide-react";

import { signOut } from "@/lib/auth-client";
import type { ProfileDropdownProps } from "@/lib/types";

const profileLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Add Studio", href: "/add-studio", icon: Plus },
  { label: "My Studio Listings", href: "/mylistings", icon: List },
  { label: "My Bookings", href: "/my-bookings", icon: CalendarDays },
];

export default function ProfileDropdown({ name, email }: ProfileDropdownProps) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const links = profileLinks;

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !menuRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const closeOnScroll = () => setIsOpen(false);

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("scroll", closeOnScroll, { passive: true });

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("scroll", closeOnScroll);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    const { error } = await signOut();

    if (error) {
      console.error("Sign out failed:", error);
      return;
    }

    setIsOpen(false);
    router.push("/");
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label={isOpen ? "Close profile menu" : "Open profile menu"}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
        className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/70 bg-white/60 text-slate-800 shadow-sm transition hover:bg-white"
      >
        <UserRound aria-hidden="true" className="size-5" />
      </button>

      {isOpen && (
      <div
        role="menu"
        className="absolute right-0 top-full z-50 mt-3 w-64 rounded-xl border border-slate-200 bg-white p-3 text-slate-900 shadow-xl"
      >
        <div className="border-b border-slate-100 px-3 py-2">
          <p className="truncate text-sm font-semibold">{name}</p>
          <p className="truncate text-xs text-slate-500">{email}</p>
        </div>
        <nav aria-label="Profile menu" className="mt-2 space-y-1">
          {links.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              <Icon aria-hidden="true" className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={handleSignOut}
          role="menuitem"
          className="mt-2 flex w-full items-center gap-2 border-t border-slate-100 px-3 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-100"
        >
          <LogOut aria-hidden="true" className="size-4" />
          Logout
        </button>
      </div>
      )}
    </div>
  );
}
