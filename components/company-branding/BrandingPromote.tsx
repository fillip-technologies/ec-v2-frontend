"use client";

import React from "react";
import { Briefcase, LayoutGrid, Award, Trophy, Users, Megaphone } from "lucide-react";

export const BrandingPromote: React.FC = () => {
  const items = [
    {
      icon: <Briefcase className="h-5 w-5" />,
      title: "Hiring demand generation",
      body: "Build role awareness, internship pipelines, graduate hiring funnels, and company culture recall.",
    },
    {
      icon: <LayoutGrid className="h-5 w-5" />,
      title: "Product adoption campaigns",
      body: "Introduce SaaS tools, developer platforms, and student-facing products inside relevant learning contexts.",
    },
    {
      icon: <Award className="h-5 w-5" />,
      title: "Certification launches",
      body: "Promote certification offers, scholarships, skill challenges, and cohort enrollment journeys.",
    },
    {
      icon: <Trophy className="h-5 w-5" />,
      title: "Events and challenges",
      body: "Run hackathons, webinars, workshops, and registration-led activations with follow-up reporting.",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Employer brand visibility",
      body: "Position your company as a serious career destination for technical, business, and creative talent.",
    },
    {
      icon: <Megaphone className="h-5 w-5" />,
      title: "Always-on awareness",
      body: "Create repeated visibility across student cohorts, community updates, and institutional touchpoints.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#EEF5FF] py-16 sm:py-20">
      <div className="pointer-events-none absolute left-0 top-12 h-56 w-56 rounded-full bg-[#7C5CFC]/15 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative grid gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7C5CFC]">
              Campaign inventory
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#160840] sm:text-4xl">
              Built for brand, talent, and product teams with clear activation goals.
            </h2>
          </div>
          <div className="rounded-2xl border border-[#E2D9FF] bg-white p-5 shadow-sm">
            <div className="grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8B7FBF]">
                  Planning unit
                </p>
                <p className="mt-1 font-bold text-[#160840]">Campaign brief</p>
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8B7FBF]">
                  Output
                </p>
                <p className="mt-1 font-bold text-[#160840]">Reach + intent</p>
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8B7FBF]">
                  Review
                </p>
                <p className="mt-1 font-bold text-[#160840]">Performance report</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <article
              key={idx}
              className="group rounded-2xl border border-[#E2D9FF] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#7C5CFC]/40 hover:shadow-[0_20px_48px_rgba(22,8,64,0.10)]"
            >
              <div className="flex items-start justify-between gap-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E2D9FF] bg-[#F5F0FF] text-[#7C5CFC] transition duration-300 group-hover:border-[#7C5CFC]/30 group-hover:bg-[#7C5CFC] group-hover:text-white">
                  {item.icon}
                </span>
                <span className="h-2 w-2 rounded-full bg-[#F5C842]" />
              </div>
              <h3 className="mt-6 text-lg font-extrabold text-[#160840]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#6B7280]">{item.body}</p>
              <div className="mt-5 h-px bg-gradient-to-r from-[#7C5CFC]/30 via-[#E2D9FF] to-transparent" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
