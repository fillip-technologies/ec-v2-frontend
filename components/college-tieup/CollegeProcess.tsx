"use client";

import React from "react";

export const CollegeProcess: React.FC = () => {
  const steps = [
    {
      label: "01",
      title: "Institution discovery",
      body: "We understand departments, student volume, academic calendar, placement priorities, and reporting expectations.",
    },
    {
      label: "02",
      title: "Program mapping",
      body: "Tracks are aligned to branches, semesters, learning level, and the college coordination model.",
    },
    {
      label: "03",
      title: "Cohort onboarding",
      body: "Students are enrolled, oriented, assigned learning paths, and introduced to project milestones.",
    },
    {
      label: "04",
      title: "Delivery and reporting",
      body: "Mentor-led learning, attendance tracking, progress reviews, and outcome reports continue through completion.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7C5CFC]">
            How it works
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#160840] sm:text-4xl">
            A clear partnership flow from discussion to measurable outcomes.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <article key={idx} className="relative rounded-2xl border border-[#E2D9FF] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5F0FF] text-sm font-extrabold text-[#7C5CFC]">
                  {step.label}
                </span>
                <div className="hidden h-px flex-1 bg-[#E2D9FF] lg:block" />
              </div>
              <h3 className="mt-7 text-lg font-extrabold text-[#160840]">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#6B7280]">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
