"use client";

import React from "react";

export const AboutProcess: React.FC = () => {
  const steps = [
    {
      step: "01",
      title: "Explore & Enroll",
      desc: "Browse career-focused tracks, pick a domain that aligns with your goals, and enroll in minutes. We guide you if you're unsure.",
      gradient: "from-[#7C5CFC]/15 to-[#7C5CFC]/5",
    },
    {
      step: "02",
      title: "Learn by Doing",
      desc: "Dive into structured modules with real-world projects. Each task is designed to build a specific, demonstrable skill.",
      gradient: "from-blue-500/12 to-blue-400/5",
    },
    {
      step: "03",
      title: "Get Mentored",
      desc: "Receive code reviews, feedback sessions, and career guidance from mentors who understand industry expectations.",
      gradient: "from-emerald-500/12 to-emerald-400/5",
    },
    {
      step: "04",
      title: "Earn & Advance",
      desc: "Complete your track, earn a verifiable certificate, build a portfolio of real work, and step into your career with confidence.",
      gradient: "from-[#F5C842]/20 to-[#F5C842]/5",
    },
  ];

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7C5CFC]">
            How We Work
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-[#160840] sm:text-4xl">
            A clear path from enrollment to employment.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-[#6B7280]">
            Our process is intentionally simple — so learners spend time building, not wondering what to do next.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl border border-[#E2D9FF] bg-gradient-to-b ${step.gradient} p-6 shadow-sm`}
            >
              {idx < 3 && (
                <div className="pointer-events-none absolute right-0 top-1/2 hidden h-px w-5 -translate-y-1/2 translate-x-full bg-[#E2D9FF] lg:block" />
              )}

              <span className="text-3xl font-black text-[#7C5CFC]/30">{step.step}</span>
              <h3 className="mt-3 text-lg font-extrabold text-[#160840]">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#6B7280]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
