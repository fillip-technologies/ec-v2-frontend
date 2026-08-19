"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Cluster, Country, Program, Technology, Topic } from "@/types/catalog";
import { CatalogHero } from "./CatalogHero";
import { CatalogFilterSidebar } from "./CatalogFilterSidebar";
import { ProgramCard } from "./ProgramCard";
import { SearchX, RotateCcw } from "lucide-react";
import { detectUserCurrency } from "@/lib/utils/currency";
import { useAuth } from "@/context/AuthContext";
import { getStudentPrograms } from "@/lib/api/student";

interface CatalogClientProps {
  initialPrograms: Program[];
  initialClusters: Cluster[];
  initialTopics: Topic[];
  initialTechnologies: Technology[];
  initialCountries: Country[];
}

function CatalogClientContent({
  initialPrograms,
  initialClusters,
  initialTopics,
  initialTechnologies,
  initialCountries,
}: CatalogClientProps) {
  const { user, roleName } = useAuth();
  const searchParams = useSearchParams();
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("IN");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClusterId, setSelectedClusterId] = useState<number | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [selectedTechId, setSelectedTechId] = useState<number | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [enrolledProgramIds, setEnrolledProgramIds] = useState<number[]>([]);

  useEffect(() => {
    if (user && roleName?.toLowerCase() === "student") {
      getStudentPrograms().then((progs) => {
        if (Array.isArray(progs)) {
          const ids = progs
            .map((p: any) => p.program?.id || p.programId || p.id)
            .filter(Boolean);
          setEnrolledProgramIds(ids);
        }
      });
    }
  }, [user, roleName]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const CARDS_PER_PAGE = 12;

  // Read URL query parameters on navigation from MegaMenu links
  useEffect(() => {
    const cId = searchParams.get("clusterId");
    const tId = searchParams.get("topicId");
    const country = searchParams.get("countryCode");
    const dur = searchParams.get("durationHours");

    if (cId) setSelectedClusterId(Number(cId));
    if (tId) setSelectedTopicId(Number(tId));
    if (country) setSelectedCountryCode(country.toUpperCase());
    if (dur) setSelectedDuration(Number(dur));
  }, [searchParams]);

  // Reset page when filters or browsing location change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedClusterId,
    selectedTopicId,
    selectedTechId,
    selectedDuration,
    selectedCountryCode,
  ]);

  // Auto-detect visitor location on page load via Geolocation IP API (if no URL param override)
  useEffect(() => {
    if (!searchParams.get("countryCode")) {
      detectUserCurrency().then((info) => {
        if (info.countryCode) {
          const matched = initialCountries.find(
            (c) => c.isoCode.toUpperCase() === info.countryCode.toUpperCase()
          );
          if (matched) {
            setSelectedCountryCode(matched.isoCode);
          }
        }
      });
    }
  }, [initialCountries, searchParams]);

  // Find currently selected country object directly from initialCountries array
  const activeCountry = useMemo(() => {
    return (
      initialCountries.find(
        (c) => c.isoCode.toUpperCase() === selectedCountryCode.toUpperCase()
      ) || initialCountries[0]
    );
  }, [initialCountries, selectedCountryCode]);

  const activeCurrencyCode = activeCountry?.currencyCode || "INR";

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim() !== "" ||
      selectedClusterId !== null ||
      selectedTopicId !== null ||
      selectedTechId !== null ||
      selectedDuration !== null 
      // selectedStatus !== "all"
    );
  }, [
    searchQuery,
    selectedClusterId,
    selectedTopicId,
    selectedTechId,
    selectedDuration,
    // selectedStatus,
  ]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedClusterId(null);
    setSelectedTopicId(null);
    setSelectedTechId(null);
    setSelectedDuration(null);
    // setSelectedStatus("all");
  };

  // Filter programs dynamically based on criteria and browsing location
  const filteredPrograms = useMemo(() => {
    return initialPrograms.filter((program) => {
      // 1. Browsing Location / Country Pricing Filter
      if (activeCountry && program.pricings && program.pricings.length > 0) {
        const hasPricingForLocation = program.pricings.some(
          (p) =>
            p.countryId === activeCountry.id ||
            p.currency?.toUpperCase() === activeCurrencyCode.toUpperCase()
        );
        if (!hasPricingForLocation) return false;
      }

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = program.title.toLowerCase().includes(query);
        const matchesDesc = program.description?.toLowerCase().includes(query) || false;
        const matchesTopic = program.topics?.some((t) =>
          t.topic.name.toLowerCase().includes(query)
        );
        if (!matchesTitle && !matchesDesc && !matchesTopic) return false;
      }

      // 3. Cluster Filter
      if (selectedClusterId !== null) {
        const matchesCluster = program.topics?.some(
          (t) => t.topic.clusterId === selectedClusterId
        );
        if (!matchesCluster) return false;
      }

      // 4. Topic Filter
      if (selectedTopicId !== null) {
        const matchesTopic = program.topics?.some(
          (t) => t.topic.id === selectedTopicId
        );
        if (!matchesTopic) return false;
      }

      // 5. Technology Filter
      if (selectedTechId !== null) {
        const matchesTech = program.technologies?.some(
          (t) => t.technology.id === selectedTechId
        );
        if (!matchesTech) return false;
      }

      // 6. Duration Filter (e.g. 60+, 120+, 180+)
      if (selectedDuration !== null) {
        if (program.durationHours < selectedDuration) return false;
      }

      return true;
    });
  }, [
    initialPrograms,
    activeCountry,
    activeCurrencyCode,
    searchQuery,
    selectedClusterId,
    selectedTopicId,
    selectedTechId,
    selectedDuration,
  ]);

  // Paginated Programs List
  const paginatedPrograms = useMemo(() => {
    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
    return filteredPrograms.slice(startIndex, startIndex + CARDS_PER_PAGE);
  }, [filteredPrograms, currentPage]);

  const totalPages = Math.ceil(filteredPrograms.length / CARDS_PER_PAGE);

  return (
    <main className="min-h-screen bg-bgBody text-textPrimary">
      {/* Hero Banner Header */}
      <CatalogHero
        programCount={filteredPrograms.length}
        clusterCount={initialClusters.length}
        topicCount={initialTopics.length}
        countries={initialCountries}
        selectedCountryCode={selectedCountryCode}
        onCountryChange={setSelectedCountryCode}
      />

      {/* Main Content Layout with Sidebar & Program Grid */}
      <div className="container-main py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr] items-start">
          {/* Left Sidebar Filter Column */}
          <CatalogFilterSidebar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            clusters={initialClusters}
            selectedClusterId={selectedClusterId}
            onClusterSelect={setSelectedClusterId}
            topics={initialTopics}
            selectedTopicId={selectedTopicId}
            onTopicSelect={setSelectedTopicId}
            technologies={initialTechnologies}
            selectedTechId={selectedTechId}
            onTechSelect={setSelectedTechId}
            selectedDuration={selectedDuration}
            onDurationSelect={setSelectedDuration}
            // selectedStatus={selectedStatus}
            // onStatusSelect={setSelectedStatus}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Right Programs Column */}
          <div>
            {/* Header Result Counter & Active Filter Pills */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-glassBorder bg-white/80 p-4 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-textPrimary">
                  Showing {filteredPrograms.length} of {initialPrograms.length} Programs
                </span>
                {activeCountry && (
                  <span className="text-xs font-bold text-textMuted hidden sm:inline">
                    • In {activeCountry.name} ({activeCurrencyCode})
                  </span>
                )}
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:underline cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset All Filters
                </button>
              )}
            </div>

            {/* Programs Cards Grid */}
            {paginatedPrograms.length > 0 ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedPrograms.map((program) => (
                    <ProgramCard
                      key={program.id}
                      program={program}
                      countryId={activeCountry?.id}
                      currencyCode={activeCurrencyCode}
                      isEnrolled={enrolledProgramIds.includes(program.id)}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 pt-4">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="rounded-xl border border-borderLight bg-white px-3 py-2 text-xs font-bold text-textPrimary hover:bg-bgSoft disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`h-9 w-9 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          currentPage === page
                            ? 'bg-brand text-white'
                            : 'border border-borderLight bg-white text-textPrimary hover:bg-bgSoft'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="rounded-xl border border-borderLight bg-white px-3 py-2 text-xs font-bold text-textPrimary hover:bg-bgSoft disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Empty Results State */
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-borderLight bg-white/60 p-12 text-center shadow-xs">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brandSoft text-brand">
                  <SearchX className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-textPrimary">No Programs Found</h3>
                <p className="mt-1.5 max-w-md text-xs text-textMuted">
                  We couldn't find any internship programs matching your current filter criteria. Try clearing some filters or searching for different keywords.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brandHover transition-all cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" /> Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export const CatalogClient: React.FC<CatalogClientProps> = (props) => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bgBody p-10 text-center font-bold">Loading Catalogue...</div>}>
      <CatalogClientContent {...props} />
    </Suspense>
  );
};
