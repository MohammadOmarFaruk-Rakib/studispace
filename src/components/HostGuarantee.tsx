
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ShieldCheck,
  BadgeCheck,
  HardHat,
  Headset,
  ArrowUpRight,
  Check,
  Sparkles,
} from "lucide-react";

const guarantees = [
  {
    number: "01",
    title: "Liability Protection",
    description:
      "Clear booking policies and transparent protection guidelines help creators and hosts understand their responsibilities.",
    icon: ShieldCheck,
    features: [
      "Transparent booking policies",
      "Clear usage guidelines",
      "Defined host responsibilities",
    ],
  },
  {
    number: "02",
    title: "Verified Profiles",
    description:
      "Make informed decisions with transparent studio details, host information and community feedback.",
    icon: BadgeCheck,
    features: [
      "Host profile information",
      "Detailed studio listings",
      "Ratings and reviews",
    ],
  },
  {
    number: "03",
    title: "Equipment Safety",
    description:
      "Know what equipment is available and review important usage instructions before your session.",
    icon: HardHat,
    features: [
      "Equipment information",
      "Studio usage guidelines",
      "Safety recommendations",
    ],
  },
  {
    number: "04",
    title: "24/7 Host Support",
    description:
      "Get assistance with booking questions, studio access and communication with your host.",
    icon: Headset,
    features: [
      "Booking assistance",
      "Host communication",
      "Studio access guidance",
    ],
  },
];

export default function HostGuarantee() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".guarantee-heading",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { opacity: 0, y: 45 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = (index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, {
      y: -8,
      duration: 0.35,
      ease: "power3.out",
      boxShadow: "0 20px 45px rgba(124, 58, 237, 0.10)",
      borderColor: "#C4B5FD",
    });

    gsap.to(card.querySelector(".guarantee-icon"), {
      scale: 1.1,
      rotate: 8,
      duration: 0.35,
      ease: "back.out(2)",
    });

    gsap.to(card.querySelector(".guarantee-arrow"), {
      x: 4,
      y: -4,
      duration: 0.3,
    });
  };

  const handleMouseLeave = (index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, {
      y: 0,
      duration: 0.35,
      ease: "power3.out",
      boxShadow: "0 4px 20px rgba(15, 23, 42, 0.035)",
      borderColor: "#E5E7EB",
    });

    gsap.to(card.querySelector(".guarantee-icon"), {
      scale: 1,
      rotate: 0,
      duration: 0.3,
    });

    gsap.to(card.querySelector(".guarantee-arrow"), {
      x: 0,
      y: 0,
      duration: 0.3,
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white px-5 py-24 md:px-10 lg:px-20"
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-purple-100/60 blur-[110px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-violet-100/50 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-16 text-center">

          <h1 className="text-3xl">Host Guarantee & Creator Support</h1>

          <p className="guarantee-heading mx-auto mt-6 max-w-2xl text-sm leading-7 text-gray-500 text-[12px] sm:text-base">
            Great creative experiences start with confidence.
            Discover the support, transparency and guidance that
            make every StudioSpace experience better.
          </p>
        </div>

        {/* Trust Banner */}


        {/* Feature Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.number}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
                className="group relative flex min-h-[380px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.035)] transition-colors duration-300 hover:bg-purple-50/30"
              >
                {/* Decorative number */}
                <span className="absolute right-6 top-6 text-xs font-bold tracking-widest text-gray-300">
                  / {item.number}
                </span>

                {/* Icon */}
                <div className="guarantee-icon mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 ring-1 ring-purple-100 transition-colors duration-300 group-hover:bg-purple-100">
                  <Icon size={26} strokeWidth={1.8} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold tracking-tight text-gray-950">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  {item.description}
                </p>

                {/* Feature list */}
                <div className="mt-7 space-y-3 border-t border-gray-100 pt-6">
                  {item.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3 text-xs font-medium text-gray-600"
                    >
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-purple-100">
                        <Check size={10} className="text-purple-700" />
                      </span>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Bottom */}
                <div className="mt-auto flex items-center justify-between pt-8">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                    StudioSpace
                  </span>

                  <ArrowUpRight
                    size={18}
                    className="guarantee-arrow text-purple-600"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom message */}
        <div className="guarantee-heading mt-14 text-center">
          <p className="text-sm text-gray-500">
            Focus on what you do best.{" "}
            <span className="font-semibold text-purple-700">
              We make finding your creative space easier.
            </span>
          </p>
        </div>

      </div>
    </section>
  );
}
