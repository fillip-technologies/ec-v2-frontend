"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Cluster, Country, Program, Technology, Topic } from "@/types/catalog";
import { CatalogHero } from "./CatalogHero";
import { CatalogFilterSidebar } from "./CatalogFilterSidebar";
import { ProgramCard } from "./ProgramCard";
import { SearchX, RotateCcw } from "lucide-react";
import { detectUserCurrency } from "@/lib/utils/currency";

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
  const searchParams = useSearchParams();
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("IN");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClusterId, setSelectedClusterId] = useState<number | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [selectedTechId, setSelectedTechId] = useState<number | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  // const [selectedStatus, setSelectedStatus] = useState("all");

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

  // Filter programs dynamically based on criteria
  const filteredPrograms = useMemo(() => {
    return initialPrograms.filter((program) => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = program.title.toLowerCase().includes(query);
        const matchesDesc = program.description?.toLowerCase().includes(query) || false;
        const matchesTopic = program.topics?.some((t) =>
          t.topic.name.toLowerCase().includes(query)
        );
        if (!matchesTitle && !matchesDesc && !matchesTopic) return false;
      }

      // 2. Cluster Filter
      if (selectedClusterId !== null) {
        const matchesCluster = program.topics?.some(
          (t) => t.topic.clusterId === selectedClusterId
        );
        if (!matchesCluster) return false;
      }

      // 3. Topic Filter
      if (selectedTopicId !== null) {
        const matchesTopic = program.topics?.some(
          (t) => t.topic.id === selectedTopicId
        );
        if (!matchesTopic) return false;
      }

      // 4. Technology Filter
      if (selectedTechId !== null) {
        const matchesTech = program.technologies?.some(
          (t) => t.technology.id === selectedTechId
        );
        if (!matchesTech) return false;
      }

      // 5. Duration Filter (e.g. 60+, 120+, 180+)
      if (selectedDuration !== null) {
        if (program.durationHours < selectedDuration) return false;
      }

        // // 6. Status Filter
        // if (selectedStatus !== "all") {
        //   if (program.status !== selectedStatus) return false;
        // }

      return true;
    });
  }, [
    initialPrograms,
    searchQuery,
    selectedClusterId,
    selectedTopicId,
    selectedTechId,
    selectedDuration,
    // selectedStatus,
  ]);

  return (
    <main className="min-h-screen bg-bgBody text-textPrimary">
      {/* Hero Banner Header */}
      <CatalogHero
        programCount={initialPrograms.length}
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
            {filteredPrograms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPrograms.map((program) => (
                  <ProgramCard
                    key={program.id}
                    program={program}
                    countryId={activeCountry?.id}
                    currencyCode={activeCurrencyCode}
                  />
                ))}
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
