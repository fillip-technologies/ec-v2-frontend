"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

export const CollegeFaq: React.FC = () => {
  const faqs = [
    {
      q: "Can programs be mapped department-wise?",
      a: "Yes. Tracks can be aligned by branch, semester, student level, and placement priorities.",
    },
    {
      q: "Do colleges receive student progress reports?",
      a: "Yes. The partnership includes progress visibility, attendance signals, completion updates, and structured reporting support.",
    },
    {
      q: "Is an MoU possible for institutional partnerships?",
      a: "Yes. Our team can discuss MoU-ready engagement models based on the college requirement and program scope.",
    },
    {
      q: "Can placement cells use this for readiness programs?",
      a: "Yes. The model is designed to support project portfolios, skill visibility, and placement-readiness conversations.",
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="bg-[#EEF5FF] py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.72fr_1fr]">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7C5CFC]">FAQ</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#160840] sm:text-4xl">
            Clear answers for college decision-makers.
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className="group rounded-2xl border border-[#E2D9FF] bg-white p-5 shadow-sm transition hover:border-[#7C5CFC]/30"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full cursor-pointer items-center justify-between gap-5 text-left font-extrabold text-[#160840]"
                >
                  <span>{faq.q}</span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition ${
                      isOpen ? "bg-[#7C5CFC] text-white" : "bg-[#EEF5FF] text-[#7C5CFC]"
                    }`}
                  >
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                {isOpen && <p className="mt-4 text-sm leading-7 text-[#6B7280]">{faq.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
