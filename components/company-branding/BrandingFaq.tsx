"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

export const BrandingFaq: React.FC = () => {
  const faqs = [
    {
      q: "What kinds of companies can run campaigns?",
      a: "Technology companies, startups, HR teams, certification providers, SaaS brands, training companies, and employer branding teams can run relevant campaigns.",
    },
    {
      q: "Can campaigns be targeted by student domain?",
      a: "Yes. Campaigns can be mapped to engineering, data, design, business, law, communication, or other relevant track audiences.",
    },
    {
      q: "Do you support webinars and workshops?",
      a: "Yes. We can support registration flows, audience outreach, session positioning, and post-event reporting.",
    },
    {
      q: "Will companies get campaign reports?",
      a: "Yes. Reporting can include reach, engagement, registrations, channel performance, qualified interest, and follow-up recommendations.",
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="bg-[#EEF5FF] py-14 sm:py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[0.72fr_1fr]">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7C5CFC]">
            Buyer FAQ
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#160840] sm:text-4xl">
            Common questions from campaign and brand teams.
          </h2>
          <p className="mt-5 text-base leading-8 text-[#6B7280]">
            Designed for teams evaluating audience fit, campaign scope, activation support, and reporting quality.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className="group rounded-2xl border border-[#E2D9FF] bg-white p-4 shadow-sm transition hover:border-[#7C5CFC]/30 hover:shadow-[0_14px_34px_rgba(22,8,64,0.06)]"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full cursor-pointer items-center justify-between gap-5 text-left font-extrabold text-[#160840]"
                >
                  <span>{faq.q}</span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition ${
                      isOpen ? "bg-[#7C5CFC] text-white" : "bg-[#EEF5FF] text-[#7C5CFC]"
                    }`}
                  >
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                {isOpen && (
                  <p className="mt-4 text-sm leading-7 text-[#6B7280]">{faq.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
