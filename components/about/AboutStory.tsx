"use client";

import React from "react";
import { Target, Compass } from "lucide-react";

export const AboutStory: React.FC = () => {
  return (
    <section className="relative bg-white py-14 sm:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(245,240,255,0.60),rgba(255,255,255,0.92)_50%,rgba(238,245,255,0.55))]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7C5CFC]">
            Our Story
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#160840] sm:text-4xl">
            From a simple idea to a growing movement.
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Main Story Paragraphs */}
          <div className="rounded-2xl border border-[#E2D9FF] bg-white p-8 shadow-sm">
            <p className="text-base leading-8 text-[#6B7280]">
              Engineers Clinic started with a frustration every engineering student knows — the gap between what textbooks teach and what employers demand. Founded in 2023, we set out to build a learning platform that doesn&apos;t just teach, but trains. Our programs are modelled on real workplace workflows, giving learners a rehearsal ground before they step into their first role.
            </p>
            <p className="mt-5 text-base leading-8 text-[#6B7280]">
              What began as a small internship initiative has grown into a structured ecosystem of skill tracks, college partnerships, and industry-shaped programs. Today, Engineers Clinic bridges academia and industry for students across the country — one project at a time.
            </p>
          </div>

          {/* Mission & Vision Cards */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#E2D9FF] bg-gradient-to-br from-[#7C5CFC]/8 to-transparent p-6 shadow-sm">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C5CFC]/15 text-[#7C5CFC]">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-extrabold text-[#160840]">Our Mission</h3>
              <p className="mt-3 text-sm leading-7 text-[#6B7280]">
                To make career-ready learning accessible to every engineering student — regardless of college tier, location, or background — through structured internships and project-led programs.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E2D9FF] bg-gradient-to-br from-[#F5C842]/15 to-transparent p-6 shadow-sm">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5C842]/25 text-[#160840]">
                <Compass className="h-5 w-5 text-[#160840]" />
              </div>
              <h3 className="text-lg font-extrabold text-[#160840]">Our Vision</h3>
              <p className="mt-3 text-sm leading-7 text-[#6B7280]">
                To become India&apos;s most trusted bridge between academic learning and professional readiness — building a generation of engineers who are skilled, confident, and employable from day one.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
