"use client";

import React from "react";

export const CollegeFeatures: React.FC = () => {
  const features = [
    {
      title: "College dashboard",
      body: "A single view for enrolled students, active tracks, completion status, and academic updates.",
    },
    {
      title: "Learning analytics",
      body: "Track progress, task completion, cohort engagement, and domain-wise adoption patterns.",
    },
    {
      title: "Attendance visibility",
      body: "Maintain session participation records and identify students who need coordinator follow-up.",
    },
    {
      title: "Institution reports",
      body: "Generate structured summaries for HOD reviews, placement meetings, and internal reporting.",
    },
    {
      title: "LMS access",
      body: "Students work through guided learning modules, project tasks, and milestone-based submissions.",
    },
    {
      title: "Placement support",
      body: "Project portfolios, interview readiness signals, and career guidance support employability conversations.",
    },
  ];

  return (
    <section className="bg-[#EEF5FF] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7C5CFC]">
              Features for colleges
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#160840] sm:text-4xl">
              Operational controls for academic teams and placement cells.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#6B7280]">
              The platform experience is designed to help colleges coordinate learning activity, monitor student progress, and keep stakeholders informed.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#E2D9FF] bg-white shadow-sm">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="grid gap-3 border-b border-[#E2D9FF] p-5 last:border-b-0 sm:grid-cols-[220px_1fr] sm:gap-8 hover:bg-[#EEF5FF]/50 transition"
              >
                <h3 className="font-extrabold text-[#160840]">{feature.title}</h3>
                <p className="text-sm leading-7 text-[#6B7280]">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
