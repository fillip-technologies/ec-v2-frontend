"use client";

import React from "react";
import Link from "next/link";

export const BrandingHero: React.FC = () => {
  const funnel = [
    { label: "Awareness delivery", percent: 88 },
    { label: "Registration conversion", percent: 64 },
    { label: "Qualified interest", percent: 42 },
  ];

  const audienceMix = [
    { label: "Engineering", percent: 46 },
    { label: "Management", percent: 24 },
    { label: "Design", percent: 18 },
    { label: "Early career", percent: 12 },
  ];

  const channels = ["LMS placement", "Webinar funnel", "Community posts", "College outreach"];

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(245,240,255,0.72),rgba(255,255,255,0.98)_42%,rgba(238,245,255,0.86))]" />
      <div className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full bg-[#7C5CFC]/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[0.92fr_1fr] lg:items-center lg:py-24">
        {/* Left Content */}
        <div>
          <div className="inline-flex items-center gap-3 rounded-full border border-[#E2D9FF] bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7C5CFC] shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F5C842]" />
            Audience Reach Infrastructure
          </div>

          <h1 className="mt-7 max-w-4xl text-4xl font-extrabold tracking-tight text-[#160840] sm:text-5xl lg:text-[4.25rem] lg:leading-[1.03]">
            Scale student reach through a measurable campaign network.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#6B7280] sm:text-lg">
            Engineers Clinic gives employer brands, SaaS teams, hiring teams, and certification providers a structured distribution layer for awareness, registrations, engagement, and qualified student interest.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#branding-enquiry"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#7C5CFC] px-7 py-3.5 text-sm font-extrabold text-white shadow-[0_18px_42px_rgba(124,92,252,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#6a49f3]"
            >
              Launch Campaign
            </a>
            <a
              href="#branding-channels"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[#E2D9FF] bg-white/90 px-7 py-3.5 text-sm font-extrabold text-[#160840] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#7C5CFC] hover:text-[#7C5CFC]"
            >
              Explore Audience Reach
            </a>
          </div>

          <div className="mt-8 grid gap-3 border-t border-[#E2D9FF] pt-6 text-sm text-[#6B7280] sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#7C5CFC]" />
              <span className="font-semibold text-[#160840]">Audience segmentation</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#7C5CFC]" />
              <span className="font-semibold text-[#160840]">Multi-channel activation</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#7C5CFC]" />
              <span className="font-semibold text-[#160840]">Performance reporting</span>
            </div>
          </div>
        </div>

        {/* Right Dashboard Console Preview */}
        <div className="relative">
          <div className="absolute -left-5 top-10 hidden rounded-2xl border border-[#E2D9FF] bg-white px-4 py-3 shadow-[0_18px_44px_rgba(22,8,64,0.10)] lg:block z-20">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8B7FBF]">
              Live audience
            </p>
            <p className="mt-1 text-xl font-extrabold text-[#160840]">48,200</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#E2D9FF] bg-white shadow-[0_28px_80px_rgba(22,8,64,0.12)]">
            <div className="flex items-center justify-between border-b border-[#E2D9FF] px-5 py-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#8B7FBF]">
                  Campaign console
                </p>
                <p className="mt-1 text-sm font-extrabold text-[#160840]">
                  Employer brand launch dashboard
                </p>
              </div>
              <span className="rounded-full border border-[#7C5CFC]/20 bg-[#7C5CFC]/15 px-3 py-1 text-xs font-black text-[#7C5CFC]">
                Live plan
              </span>
            </div>

            <div className="bg-[linear-gradient(135deg,#F5F0FF,#ffffff_48%,#EEF5FF)] p-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#E2D9FF] bg-white p-4 shadow-sm">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8B7FBF]">
                    Projected reach
                  </p>
                  <p className="mt-2 text-2xl font-black text-[#160840]">48k</p>
                </div>
                <div className="rounded-2xl border border-[#E2D9FF] bg-white p-4 shadow-sm">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8B7FBF]">
                    Intent signals
                  </p>
                  <p className="mt-2 text-2xl font-black text-[#160840]">1,860</p>
                </div>
                <div className="rounded-2xl border border-[#E2D9FF] bg-white p-4 shadow-sm">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8B7FBF]">
                    Segments
                  </p>
                  <p className="mt-2 text-2xl font-black text-[#160840]">34</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-[#E2D9FF] bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-[#160840]">Campaign funnel</p>
                  <span className="rounded-full bg-[#EEF5FF] px-3 py-1 text-xs font-bold text-[#7C5CFC]">
                    Weekly lift
                  </span>
                </div>
                <div className="mt-5 space-y-4">
                  {funnel.map((row, idx) => (
                    <div key={idx}>
                      <div className="mb-2 flex justify-between text-xs font-bold text-[#6B7280]">
                        <span>{row.label}</span>
                        <span>{row.percent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#EEF5FF]">
                        <div
                          className="h-2 rounded-full bg-[#7C5CFC]"
                          style={{ width: `${row.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-2xl border border-[#E2D9FF] bg-white p-4 shadow-sm">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8B7FBF]">
                    Audience mix
                  </p>
                  <div className="mt-4 space-y-3 text-xs text-[#6B7280]">
                    {audienceMix.map((seg, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="w-20 font-bold text-[#160840]">{seg.label}</span>
                        <span className="h-2 flex-1 rounded-full bg-[#EEF5FF]">
                          <span
                            className="block h-2 rounded-full bg-[#7C5CFC]"
                            style={{ width: `${seg.percent}%` }}
                          />
                        </span>
                        <span className="w-8 text-right font-extrabold text-[#160840]">
                          {seg.percent}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E2D9FF] bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-extrabold text-[#160840]">Distribution queue</p>
                    <span className="text-xs font-bold text-[#7C5CFC]">4 channels</span>
                  </div>
                  <div className="mt-4 grid gap-2 text-xs font-bold text-[#6B7280] sm:grid-cols-2">
                    {channels.map((ch, idx) => (
                      <span key={idx} className="rounded-xl border border-[#E2D9FF] bg-[#EEF5FF] px-3 py-2">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
