
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const steps = [
  {
    number: "01",
    title: "Discover Spaces",
    subtitle: "Find your creative space",
    description:
      "Explore a curated collection of photography studios, sound stages, podcast rooms and creative spaces.",
    icon: "⌕",
    details: ["Explore categories", "Compare studios", "Find your perfect space"],
  },
  {
    number: "02",
    title: "Select Shoot Hours",
    subtitle: "Make it fit your schedule",
    description:
      "Choose your preferred date, check studio availability and select the hours that work best for your project.",
    icon: "◷",
    details: ["Choose a date", "Check availability", "Select your hours"],
  },
  {
    number: "03",
    title: "Book Instantly",
    subtitle: "Secure your booking",
    description:
      "Review your booking details, check the total price and confirm your creative space with ease.",
    icon: "✓",
    details: ["Review booking", "Confirm your details", "Get confirmation"],
  },
  {
    number: "04",
    title: "Create & Produce",
    subtitle: "Bring your ideas to life",
    description:
      "Arrive at your selected studio, use the available facilities and turn your creative vision into reality.",
    icon: "✳",
    details: ["Arrive at your studio", "Set up your equipment", "Start creating"],
  },
];

export default function HowItworks() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Animate the timeline line on scroll
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 55%",
            end: "bottom 75%",
            scrub: 1,
          },
        }
      );

      // Animate each timeline step
      stepsRef.current.forEach((step, index) => {
        if (!step) return;

        const card = step.querySelector(".step-card");
        const node = step.querySelector(".step-node");

        gsap.fromTo(
          card,
          {
            opacity: 0,
            x: index % 2 === 0 ? -55 : 55,
            y: 25,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );

        gsap.fromTo(
          node,
          { scale: 0.5, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: step,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = (index: number) => {
    const step = stepsRef.current[index];
    if (!step) return;

    const card = step.querySelector(".step-card");
    const icon = step.querySelector(".step-icon");

    gsap.to(card, {
      y: -8,
      scale: 1.025,
      duration: 0.35,
      ease: "power3.out",
      boxShadow: "0 24px 60px rgba(109, 40, 217, 0.12)",
    });

    gsap.to(icon, {
      rotate: 12,
      scale: 1.12,
      duration: 0.35,
      ease: "back.out(2)",
    });
  };

  const handleMouseLeave = (index: number) => {
    const step = stepsRef.current[index];
    if (!step) return;

    const card = step.querySelector(".step-card");
    const icon = step.querySelector(".step-icon");

    gsap.to(card, {
      y: 0,
      scale: 1,
      duration: 0.35,
      ease: "power3.out",
      boxShadow: "0 8px 30px rgba(15, 23, 42, 0.04)",
    });

    gsap.to(icon, {
      rotate: 0,
      scale: 1,
      duration: 0.35,
      ease: "power3.out",
    });
  };

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="mt-20 scroll-mt-24 relative overflow-hidden bg-white px-5 py-24 md:px-10 lg:px-20"
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-purple-100/50 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-violet-100/50 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-24 max-w-2xl text-center">
          <h2 className=" text-5xl">
            How It Works
          </h2>


        </div>

        {/* Timeline */}
        <div className="relative mx-auto max-w-5xl">

          {/* Background timeline */}
          <div className="absolute bottom-20 left-5 top-10 w-[2px] -translate-x-1/2 bg-gray-200 md:left-1/2">
            {/* Animated line */}
            <div
              ref={lineRef}
              className="h-full w-full origin-top scale-y-0 bg-gradient-to-b from-purple-500 via-violet-500 to-purple-600"
            />
          </div>

          {/* Steps */}
          <div className="space-y-16 md:space-y-24">
            {steps.map((step, index) => (
              <div
                key={step.number}
                ref={(el) => {
                  stepsRef.current[index] = el;
                }}
                className="relative grid grid-cols-[40px_1fr] gap-5 md:grid-cols-[1fr_80px_1fr] md:gap-0"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
              >
                {/* Left card */}
                <div
                  className={`step-card group col-start-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-colors duration-300 hover:border-purple-200 md:col-start-1 md:row-start-1 ${
                    index % 2 === 0
                      ? "md:col-start-1 md:mr-8"
                      : "md:col-start-3 md:ml-8"
                  }`}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-xs font-bold tracking-[0.2em] text-purple-600">
                      STEP {step.number}
                    </span>

                    <div className="step-icon flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-2xl text-purple-600">
                      {step.icon}
                    </div>
                  </div>

                  <p className="mb-2 text-sm font-semibold text-purple-600">
                    {step.subtitle}
                  </p>

                  <h3 className="text-2xl font-bold tracking-tight text-gray-950">
                    {step.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-gray-500">
                    {step.description}
                  </p>

                  <div className="mt-6 space-y-3 border-t border-gray-100 pt-5">
                    {step.details.map((detail) => (
                      <div
                        key={detail}
                        className="flex items-center gap-3 text-sm text-gray-600"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-50 text-xs text-purple-600">
                          ✓
                        </span>
                        {detail}
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      StudioSpace
                    </span>

                    <span className="text-xl text-purple-600 transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>

                {/* Timeline node */}
                <div className="absolute left-5 top-8 z-10 flex -translate-x-1/2 items-center justify-center md:relative md:left-auto md:top-8 md:col-start-2 md:row-start-1 md:translate-x-0">
                  <div className="step-node flex h-11 w-11 items-center justify-center rounded-full border-[5px] border-white bg-purple-600 text-xs font-bold text-white shadow-[0_0_0_1px_rgba(147,51,234,0.25),0_0_15px_rgba(147,51,234,0.25)]">
                    {step.number.slice(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
