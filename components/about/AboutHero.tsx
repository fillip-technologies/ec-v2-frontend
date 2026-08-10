"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ABOUT_DATA } from "@/config/aboutData";

interface AboutHeroProps {
  onOpenEnquiry?: () => void;
}

export const AboutHero: React.FC<AboutHeroProps> = ({ onOpenEnquiry }) => {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2D9FF] to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(245,240,255,0.88),rgba(255,255,255,0.94)_44%,rgba(238,245,255,0.82))]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:py-16 lg:grid-cols-[1fr_0.86fr] lg:items-center lg:py-20">
        <div>
          <div className="inline-flex items-center gap-3 rounded-full border border-[#E2D9FF] bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7C5CFC] shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F5C842]" />
            {ABOUT_DATA.eyebrow}
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-[#160840] sm:text-5xl lg:text-[3.8rem] lg:leading-[1.04]">
            {ABOUT_DATA.title}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-[#3D2090] sm:text-lg">
            {ABOUT_DATA.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/#courses"
              className="inline-flex items-center justify-center rounded-2xl bg-[#7C5CFC] px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_16px_34px_rgba(124,92,252,0.20)] transition hover:bg-[#6a49f3] cursor-pointer"
            >
              Explore internships
            </Link>
            <Link
              href="/#college-tieup"
              className="inline-flex items-center justify-center rounded-2xl border border-[#E2D9FF] bg-white px-6 py-3.5 text-sm font-extrabold text-[#160840] transition hover:border-[#7C5CFC] hover:text-[#7C5CFC] cursor-pointer"
            >
              Partner with us
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-[#E2D9FF] bg-white shadow-[0_24px_70px_rgba(22,8,64,0.10)]">
            <Image
              src="/images/college-image.png"
              alt="Students learning with Engineers Clinic"
              width={600}
              height={480}
              priority
              className="aspect-[5/4] w-full object-cover"
            />
            <div className="border-t border-[#E2D9FF] bg-white p-5">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8B7FBF]">
                Our focus
              </p>
              <p className="mt-2 text-lg font-extrabold text-[#160840]">
                Skills that turn into real output
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {ABOUT_DATA.stats.map((stat, idx) => (
              <div key={idx} className="rounded-2xl border border-[#E2D9FF] bg-white p-4">
                <p className="text-2xl font-extrabold text-[#160840]">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-[#3D2090]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
