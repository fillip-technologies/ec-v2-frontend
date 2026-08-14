"use client";

import React from "react";
import { Globe, CheckCircle2, ShieldCheck, ArrowRight, Zap } from "lucide-react";
import { Country, Program } from "@/types/catalog";
import { formatPrice, getCurrencySymbol, getFlagEmoji } from "@/lib/utils/currency";

interface ProgramDetailSidebarProps {
  program: Program;
  countries: Country[];
  selectedCountryCode: string;
  onCountryChange: (isoCode: string) => void;
}

export const ProgramDetailSidebar: React.FC<ProgramDetailSidebarProps> = ({
  program,
  countries,
  selectedCountryCode,
  onCountryChange,
}) => {
  const activeCountry =
    countries.find((c) => c.isoCode.toUpperCase() === selectedCountryCode.toUpperCase()) ||
    countries[0];

  const activeCurrencyCode = activeCountry?.currencyCode || "INR";

  // Find pricing by matching countryId OR currencyCode
  const pricing =
    program.pricings?.find(
      (p) => (activeCountry ? p.countryId === activeCountry.id : false) || p.currency === activeCurrencyCode
    ) ||
    program.pricings?.find((p) => p.currency === activeCurrencyCode) ||
    program.pricings?.[0];

  const activeCurrency = pricing?.currency || activeCurrencyCode;
  const activeAmount = pricing?.amount;

  return (
    <aside className="sticky top-24 rounded-3xl border border-glassBorder bg-white p-6 shadow-xl backdrop-blur-xl space-y-6">
      {/* Location / Country Selector */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-textMuted">
          <Globe className="h-4 w-4 text-brand" />
          <span>Select Location & Currency</span>
        </div>

        <div className="mt-2.5">
          <select
            value={selectedCountryCode}
            onChange={(e) => onCountryChange(e.target.value)}
            className="w-full rounded-xl border border-borderLight bg-bgBody px-3.5 py-2.5 text-xs font-extrabold uppercase tracking-wide text-textPrimary shadow-xs transition-all focus:border-brand focus:outline-hidden focus:ring-2 focus:ring-brand/20 cursor-pointer"
          >
            {countries.map((c) => (
              <option key={c.id || c.isoCode} value={c.isoCode}>
                {getFlagEmoji(c.isoCode)} {c.name.toUpperCase()} ({c.currencyCode} {getCurrencySymbol(c.currencyCode)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pricing Header Card */}
      <div className="rounded-2xl border border-borderLight bg-bgSoft/60 p-4">
        <div className="text-2xl font-black text-brand">
          {formatPrice(activeAmount, activeCurrency)}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-successDark">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Verified Industry Internship</span>
        </div>
      </div>

      {/* Primary Action CTA */}
      <div>
        <button
          type="button"
          onClick={() => alert(`Enrolling in ${program.title}`)}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-extrabold text-white shadow-md hover:bg-brandHover transition-all cursor-pointer"
        >
          <span>Enroll in Program</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* What's Included Checklist */}
      <div className="border-t border-borderLight/70 pt-4 space-y-3">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-textMuted flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-brand" /> Program Deliverables Included:
        </h4>

        <div className="space-y-2 text-xs font-bold text-textSecondary">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
            <span>Guided IDE Browser Workspace</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
            <span>Automated AI Rubric Code Evaluation</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
            <span>Task-Level Reference Guides & Docs</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
            <span>Verified Certificate</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
            <span>Dedicated Mentor Review Support</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
