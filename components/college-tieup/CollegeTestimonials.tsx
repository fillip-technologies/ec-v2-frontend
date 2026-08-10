"use client";

import React from "react";

export const CollegeTestimonials: React.FC = () => {
  const testimonials = [
    {
      quote:
        "The most useful part was the structure. Our placement team could see which students were active, which projects were completed, and where follow-up was needed.",
      name: "Placement Coordinator",
      meta: "Engineering College Partner",
    },
    {
      quote:
        "Engineers Clinic helped us convert internship participation into visible project outcomes. The coordination model worked well for department-level planning.",
      name: "Head of Department",
      meta: "Computer Science Department",
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7C5CFC]">
            Institution signals
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#160840] sm:text-4xl">
            Trusted by teams who care about delivery, reporting, and outcomes.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {testimonials.map((t, idx) => (
            <figure
              key={idx}
              className="rounded-2xl border border-[#E2D9FF] bg-white p-7 shadow-sm transition hover:shadow-md"
            >
              <blockquote className="text-base leading-8 text-[#6B7280]">
                &quot;{t.quote}&quot;
              </blockquote>
              <figcaption className="mt-6 border-t border-[#E2D9FF] pt-5">
                <p className="font-extrabold text-[#160840]">{t.name}</p>
                <p className="mt-1 text-sm font-medium text-[#8B7FBF]">{t.meta}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
