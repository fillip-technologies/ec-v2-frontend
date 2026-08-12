"use client";

import React from "react";
import { Globe, Sparkles, BookOpen, Layers, Award } from "lucide-react";
import { Country } from "@/types/catalog";
import { getCurrencySymbol, getFlagEmoji } from "@/lib/utils/currency";

interface CatalogHeroProps {
  programCount: number;
  clusterCount: number;
  topicCount: number;
  countries: Country[];
  selectedCountryCode: string;
  onCountryChange: (isoCode: string) => void;
}

export const CatalogHero: React.FC<CatalogHeroProps> = ({
  programCount,
  clusterCount,
  topicCount,
  countries,
  selectedCountryCode,
  onCountryChange,
}) => {
  return (
    <section className="relative overflow-hidden border-b border-borderLight/60 bg-gradient-to-b from-bgMain via-surface to-bgBody py-12 md:py-16">
      {/* Background Decorative Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />

      <div className="container-main">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          {/* Main Title & Value Prop */}
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brandSoft px-3.5 py-1.5 text-xs font-bold text-brand">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              <span>
                {programCount} Programs · {clusterCount} Clusters · {topicCount} Topics
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-textPrimary sm:text-4xl md:text-5xl">
              Project & Internship <span className="gradient-text">Catalogue</span>
            </h1>

            <p className="text-base text-textMuted md:text-lg">
              Industry-graded project internships. Build real client briefs in a guided workspace evaluated by our AI rubric engine.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-textSecondary">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-white/80 px-2.5 py-1 shadow-xs border border-borderLight">
                <Award className="h-3.5 w-3.5 text-brand" /> Verified Certificate
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-white/80 px-2.5 py-1 shadow-xs border border-borderLight">
                <BookOpen className="h-3.5 w-3.5 text-brand" /> Guided Workspace
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-white/80 px-2.5 py-1 shadow-xs border border-borderLight">
                <Layers className="h-3.5 w-3.5 text-brand" /> AI Rubric Evaluated
              </span>
            </div>
          </div>

          {/* Dynamic Browsing Location Selector */}
          <div className="w-full rounded-2xl border border-glassBorder bg-white/90 p-5 shadow-lg backdrop-blur-xl sm:w-auto sm:min-w-[280px]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-textMuted">
              <Globe className="h-4 w-4 text-brand" />
              <span>Browsing Location</span>
            </div>

            <div className="mt-3">
              <select
                value={selectedCountryCode}
                onChange={(e) => onCountryChange(e.target.value)}
                className="w-full rounded-xl border border-borderLight bg-bgBody px-3.5 py-2.5 text-sm font-extrabold uppercase tracking-wide text-textPrimary shadow-xs transition-all focus:border-brand focus:outline-hidden focus:ring-2 focus:ring-brand/20 cursor-pointer"
              >
                {countries.map((c) => {
                  const flag = getFlagEmoji(c.isoCode);
                  const symbol = getCurrencySymbol(c.currencyCode);
                  return (
                    <option key={c.id || c.isoCode} value={c.isoCode}>
                      {flag} {c.name.toUpperCase()} ({c.currencyCode} {symbol})
                    </option>
                  );
                })}
              </select>
            </div>

            <p className="mt-3 text-xs font-semibold text-textMuted">
              120-hour programme tier
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
