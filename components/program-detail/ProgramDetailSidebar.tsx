"use client";

import React from "react";
import { Globe, CheckCircle2, ShieldCheck, ArrowRight, Zap, AlertCircle } from "lucide-react";
import { Country, Program } from "@/types/catalog";
import { formatPrice, getCurrencySymbol, getFlagEmoji } from "@/lib/utils/currency";
import { useAuth } from "@/context/AuthContext";
import { showToast } from "@/lib/toast";

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
  const { user, roleName } = useAuth();
  const canEnroll = !user || roleName === "student" || roleName === "guest";

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

  const handleEnrollClick = () => {
    if (!canEnroll) {
      const displayRole = roleName ? roleName.replace(/_/g, " ") : "this";
      showToast.warning(
        `Enrollment is restricted to student accounts. You are currently signed in as ${displayRole}.`,
        "Student Account Required"
      );
      return;
    }

    if (!user || roleName === "guest") {
      window.location.href = `/signup?role=student&redirect=/catalog/${program.slug || program.id}`;
      return;
    }

    alert(`Enrolling in ${program.title}`);
  };

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
          onClick={handleEnrollClick}
          title={!canEnroll ? "Enrollment is restricted to student accounts." : undefined}
          className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-extrabold transition-all bg-brand text-white shadow-md  ${
            canEnroll
              ?  "hover:bg-brandHover cursor-pointer"
              : " cursor-not-allowed"
          }`}
        >
          <span>Enroll in Program</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        {!canEnroll && (
          <p className="mt-2 text-center text-[11px] font-semibold text-textMuted flex items-center justify-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span>Enrollment disabled for {roleName.replace(/_/g, " ")} accounts</span>
          </p>
        )}
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
