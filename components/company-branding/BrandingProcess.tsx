"use client";

import React from "react";
import { Target, Users, Megaphone, BarChart3 } from "lucide-react";

export const BrandingProcess: React.FC = () => {
  const steps = [
    {
      label: "01",
      icon: <Target className="h-5 w-5" />,
      title: "Campaign brief",
      body: "Define the business goal: hiring demand, brand recall, product adoption, event registrations, or certification uptake.",
    },
    {
      label: "02",
      icon: <Users className="h-5 w-5" />,
      title: "Audience build",
      body: "Map segments by domain, learning track, seniority, college context, and expected action.",
    },
    {
      label: "03",
      icon: <Megaphone className="h-5 w-5" />,
      title: "Distribution launch",
      body: "Activate selected placements with messaging, registration flows, reminder systems, and campaign coordination.",
    },
    {
      label: "04",
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Performance readout",
      body: "Review reach, engagement, conversion quality, channel lift, and next-step recommendations.",
    },
  ];

  return (
    <section className="bg-[#EEF5FF] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7C5CFC]">
              Operating workflow
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#160840] sm:text-4xl">
              A campaign system from brief to performance review.
            </h2>
          </div>
          <div className="rounded-2xl border border-[#E2D9FF] bg-white p-5 shadow-sm">
            <div className="flex flex-wrap gap-2 text-xs font-bold text-[#6B7280]">
              {["Brief", "Segment", "Launch", "Track", "Report"].map((stage, idx) => (
                <span
                  key={idx}
                  className="rounded-full border border-[#E2D9FF] bg-[#EEF5FF] px-3 py-1.5"
                >
                  {stage}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mt-12 grid gap-5 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-[2.65rem] hidden h-px bg-gradient-to-r from-transparent via-[#7C5CFC]/25 to-transparent lg:block" />
          {steps.map((step, idx) => (
            <article
              key={idx}
              className="group relative rounded-2xl border border-[#E2D9FF] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#7C5CFC]/40 hover:shadow-[0_18px_44px_rgba(22,8,64,0.10)]"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E2D9FF] bg-white text-[#7C5CFC] shadow-sm transition duration-300 group-hover:border-[#7C5CFC]/30 group-hover:bg-[#7C5CFC] group-hover:text-white">
                  {step.icon}
                </span>
                <span className="rounded-full border border-[#E2D9FF] bg-[#F5F0FF] px-3 py-1 text-xs font-black text-[#7C5CFC]">
                  {step.label}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-extrabold text-[#160840]">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#6B7280]">{step.body}</p>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#8B7FBF]">
                <span className="h-px flex-1 bg-[#E2D9FF]" />
                <span>Ops step</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
