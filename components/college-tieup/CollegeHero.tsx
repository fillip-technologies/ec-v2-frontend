"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface CollegeHeroProps {
  onOpenEnquiry?: () => void;
}

export const CollegeHero: React.FC<CollegeHeroProps> = ({ onOpenEnquiry }) => {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2D9FF] to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(245,240,255,0.74),rgba(255,255,255,0.94)_42%,rgba(238,245,255,0.78))]" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[1.02fr_0.82fr] lg:items-center lg:py-24">
        <div>
          <div className="inline-flex items-center gap-3 rounded-full border border-[#E2D9FF] bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7C5CFC] shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F5C842]" />
            Institutional Partnership Program
          </div>

          <h1 className="mt-7 max-w-4xl text-4xl font-extrabold tracking-tight text-[#160840] sm:text-5xl lg:text-[4.4rem] lg:leading-[1.02]">
            Build a college-ready skill ecosystem with Engineers Clinic.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#6B7280] sm:text-lg">
            Partner with Engineers Clinic to deliver structured internships, department-wise project tracks, faculty coordination, student analytics, and placement-readiness support through one accountable operating model.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onOpenEnquiry}
              className="inline-flex items-center justify-center rounded-2xl bg-[#7C5CFC] px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_16px_34px_rgba(124,92,252,0.20)] transition hover:bg-[#6a49f3] cursor-pointer"
            >
              Request Partnership Discussion
            </button>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-2xl border border-[#E2D9FF] bg-white px-6 py-3.5 text-sm font-extrabold text-[#160840] transition hover:border-[#7C5CFC] hover:text-[#7C5CFC]"
            >
              See operating model
            </a>
          </div>

          <div className="mt-8 grid gap-3 border-t border-[#E2D9FF] pt-6 text-sm text-[#6B7280] sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#7C5CFC]" />
              <span className="font-semibold text-[#160840]">MoU-ready engagement structure</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#7C5CFC]" />
              <span className="font-semibold text-[#160840]">Department-wise delivery planning</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#7C5CFC]" />
              <span className="font-semibold text-[#160840]">Progress reports for coordinators</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-[#E2D9FF] bg-white shadow-[0_24px_70px_rgba(22,8,64,0.10)]">
            <Image
              src="/images/buliding.jpg"
              alt="College campus partnership with Engineers Clinic"
              width={600}
              height={450}
              priority
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="border-t border-[#E2D9FF] bg-white p-5">
              <div className="flex items-center justify-between gap-5">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8B7FBF]">
                    Partnership desk
                  </p>
                  <p className="mt-2 text-lg font-extrabold text-[#160840]">
                    Academic delivery + student outcomes
                  </p>
                </div>
                <div className="rounded-2xl border border-[#E2D9FF] bg-[#EEF5FF] px-4 py-3 text-right">
                  <p className="text-2xl font-black text-[#160840]">30+</p>
                  <p className="text-xs font-bold text-[#6B7280]">tracks</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-[#E2D9FF] bg-white p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#8B7FBF]">
                For
              </p>
              <p className="mt-2 font-extrabold text-[#160840]">Principals & HODs</p>
            </div>
            <div className="rounded-2xl border border-[#E2D9FF] bg-white p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#8B7FBF]">
                Built for
              </p>
              <p className="mt-2 font-extrabold text-[#160840]">Placement cells</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
