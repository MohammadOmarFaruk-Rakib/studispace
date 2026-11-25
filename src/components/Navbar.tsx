"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Button } from "./ui/button";
import ProfileDropdown from "./ProfileDropdown";
import { useSession } from "@/lib/auth-client";

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/explore-studios" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/about" },
];

const SHRINK_AT = 120;
const EXPAND_AT = 60;

function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksWrapRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const buttonsRef = useRef<HTMLElement>(null);

  const shrunk = useRef(false);
  const ready = useRef(false);

  const activeIndex = navLinks.findIndex((link) =>
    link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
  );

  // Indicator সরানোর function
  // instant = true হলে animation ছাড়া বসবে
  const moveIndicator = useCallback(
    (instant: boolean) => {
      const indicator = indicatorRef.current;
      const link = linkRefs.current[activeIndex];
      if (!indicator) return;

      // Active link না থাকলে (যেমন /login) indicator লুকাবে
      if (!link) {
        gsap.to(indicator, { autoAlpha: 0, duration: 0.3, overwrite: "auto" });
        return;
      }

      const vars = {
        x: link.offsetLeft,
        width: link.offsetWidth,
        autoAlpha: shrunk.current ? 0 : 1,
      };

      if (instant || !ready.current) {
        gsap.set(indicator, vars);
        ready.current = true;
      } else {
        gsap.to(indicator, {
          ...vars,
          duration: 0.8,
          ease: "power3.inOut",
          overwrite: "auto",
        });
      }
    },
    [activeIndex]
  );

  // Resize ও font listener-এ সবসময় latest function ব্যবহার করার জন্য
  const moveRef = useRef(moveIndicator);
  useLayoutEffect(() => {
    moveRef.current = moveIndicator;
  }, [moveIndicator]);

  // Route বদলালে slide
  useLayoutEffect(() => {
    moveIndicator(false);
  }, [pathname, moveIndicator]);

  // Mount, font load ও resize-এ সঠিক জায়গায় বসান (instant)
  useEffect(() => {
    const fix = () => moveRef.current(true);
    fix();
    document.fonts?.ready.then(fix);
    window.addEventListener("load", fix);
    window.addEventListener("resize", fix);
    return () => {
      window.removeEventListener("load", fix);
      window.removeEventListener("resize", fix);
    };
  }, []);

  // Entrance + scroll shrink
  useEffect(() => {
    const nav = navRef.current;
    const wrap = linksWrapRef.current;
    const logo = logoRef.current;
    const buttons = buttonsRef.current;
    if (!nav || !wrap || !logo || !buttons) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        nav,
        { y: -35, autoAlpha: 0, scale: 0.96 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 0.9, ease: "power3.out" }
      );

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();

          let next = shrunk.current;
          if (!shrunk.current && y > SHRINK_AT) next = true;
          else if (shrunk.current && y < EXPAND_AT) next = false;

          if (next === shrunk.current) return;
          shrunk.current = next;

          gsap.to(nav, {
            paddingTop: next ? "10px" : "16px",
            paddingBottom: next ? "10px" : "16px",
            maxWidth: next ? "850px" : "1200px",
            duration: 0.45,
            ease: "power3.out",
            overwrite: "auto",
          });

          // Links ও indicator একসাথে fade হবে
          const items = [
            ...Array.from(wrap.querySelectorAll("a")),
            indicatorRef.current,
          ].filter(Boolean);

          gsap.to(items, {
            autoAlpha: next ? 0 : 1,
            y: next ? -12 : 0,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });

          gsap.to(logo, {
            scale: next ? 0.85 : 1,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });

          gsap.to(buttons, {
            scale: next ? 0.92 : 1,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });
        },
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  return (
    <header className="sticky top-4 z-50 px-4">
      <nav
        ref={navRef}
        className="relative mx-auto flex max-w-[1200px] items-center justify-between overflow-visible rounded-2xl border border-white/60 bg-gradient-to-br from-white/50 via-white/25 to-white/10 px-6 py-4 shadow-[0_10px_40px_-10px_rgba(15,23,42,0.25),inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-1px_0_rgba(255,255,255,0.2)] backdrop-blur-2xl backdrop-saturate-200">
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/40 to-transparent opacity-60" />

        {/* Logo */}
        <Link ref={logoRef} href="/" className="relative shrink-0">
          <p className="text-3xl font-semibold tracking-tight text-slate-900 drop-shadow-sm">
            StudioSpace
          </p>
        </Link>

        {/* Navigation Links */}
        <div ref={linksWrapRef} className="relative flex items-center gap-6">
          <span
            ref={indicatorRef}
            className="pointer-events-none absolute left-0 top-0 h-full rounded-lg bg-white shadow-sm"
            style={{ opacity: 0, zIndex: 0 }}
          />

          {navLinks.map((link, index) => {
            const isActive = index === activeIndex;
            return (
              <Link
                key={link.href}
                href={link.href}
                ref={(el) => {
                  linkRefs.current[index] = el;
                }}
                className={`relative z-10 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-300 ${
                  isActive
                    ? "text-slate-950"
                    : "text-slate-800 hover:bg-white/50 hover:text-slate-950 hover:shadow-sm"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Auth Buttons */}
        <section
          ref={buttonsRef}
          className="relative flex shrink-0 items-center gap-3"
        >
          {!isPending &&
            (session?.user ? (
              <ProfileDropdown
                name={session.user.name}
                email={session.user.email}
              />
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="group relative cursor-pointer overflow-hidden rounded-[10px] border-white/70 bg-white/40 px-6 font-medium text-slate-900 shadow-sm backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/80 hover:shadow-lg active:translate-y-0"
                  >
                    <span className="relative z-10">Log In</span>
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                  </Button>
                </Link>

                <Link href="/Register">
                  <Button
                    variant="outline"
                    className="group relative cursor-pointer overflow-hidden rounded-[10px] border-white/70 bg-white/40 px-6 font-medium text-slate-900 shadow-sm backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/80 hover:shadow-lg active:translate-y-0"
                  >
                    <span className="relative z-10">Register</span>
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                  </Button>
                </Link>
              </>
            ))}
        </section>
      </nav>
    </header>
  );
}

export default Navbar;
