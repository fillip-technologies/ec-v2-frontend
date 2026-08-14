"use client";

import React from "react";
import { Search, Filter, RotateCcw, Layers, Code, Clock, ShieldCheck } from "lucide-react";
import { Cluster, Technology, Topic } from "@/types/catalog";

interface CatalogFilterSidebarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  clusters: Cluster[];
  selectedClusterId: number | null;
  onClusterSelect: (id: number | null) => void;
  topics: Topic[];
  selectedTopicId: number | null;
  onTopicSelect: (id: number | null) => void;
  technologies: Technology[];
  selectedTechId: number | null;
  onTechSelect: (id: number | null) => void;
  selectedDuration: number | null;
  onDurationSelect: (dur: number | null) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const CatalogFilterSidebar: React.FC<CatalogFilterSidebarProps> = ({
  searchQuery,
  onSearchChange,
  clusters,
  selectedClusterId,
  onClusterSelect,
  topics,
  selectedTopicId,
  onTopicSelect,
  technologies,
  selectedTechId,
  onTechSelect,
  selectedDuration,
  onDurationSelect,
  onClearFilters,
  hasActiveFilters,
}) => {
  return (
    <aside className="lg:sticky lg:top-24 static rounded-2xl border border-glassBorder bg-white/90 p-5 shadow-lg backdrop-blur-xl lg:z-20">
      <div className="flex items-center justify-between border-b border-borderLight/60 pb-3.5">
        <div className="flex items-center gap-2 font-bold text-textPrimary">
          <Filter className="h-4 w-4 text-brand" />
          <span>Filter Catalogue</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        )}
      </div>

      <div className="mt-4 space-y-6">
        {/* Search Filter Input */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-textMuted">
            Search Programs
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by title, topic..."
              className="w-full rounded-xl border border-borderLight bg-bgBody pl-9 pr-3.5 py-2 text-xs font-semibold text-textPrimary placeholder-textMuted shadow-xs transition-all focus:border-brand focus:outline-hidden focus:ring-2 focus:ring-brand/20"
            />
          </div>
        </div>

        {/* Cluster Filter */}
        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-textMuted">
            <span className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-brand" /> Clusters
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => onClusterSelect(null)}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                selectedClusterId === null
                  ? "bg-brand text-white shadow-sm"
                  : "bg-bgBody text-textSecondary hover:bg-brandSoft hover:text-brand"
              }`}
            >
              <span>All Clusters</span>
            </button>
            {clusters.map((cluster) => (
              <button
                key={cluster.id}
                onClick={() => onClusterSelect(cluster.id)}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-left transition-all cursor-pointer ${
                  selectedClusterId === cluster.id
                    ? "bg-brand text-white shadow-sm"
                    : "bg-bgBody text-textSecondary hover:bg-brandSoft hover:text-brand"
                }`}
              >
                <span className="truncate">{cluster.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Topic Dropdown Filter */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-textMuted">
            Topic Focus
          </label>
          <select
            value={selectedTopicId || ""}
            onChange={(e) => onTopicSelect(e.target.value ? Number(e.target.value) : null)}
            className="w-full rounded-xl border border-borderLight bg-bgBody px-3 py-2 text-xs font-semibold text-textPrimary shadow-xs transition-all focus:border-brand focus:outline-hidden focus:ring-2 focus:ring-brand/20 cursor-pointer"
          >
            <option value="">All Topics</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Technology Filter Chips */}
        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-textMuted">
            <span className="flex items-center gap-1.5">
              <Code className="h-3.5 w-3.5 text-brand" /> Technologies
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => onTechSelect(null)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                selectedTechId === null
                  ? "bg-brand text-white shadow-xs"
                  : "bg-bgBody text-textSecondary hover:bg-brandSoft hover:text-brand"
              }`}
            >
              All Tech
            </button>
            {technologies.map((tech) => (
              <button
                key={tech.id}
                onClick={() => onTechSelect(tech.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                  selectedTechId === tech.id
                    ? "bg-brand text-white shadow-xs"
                    : "bg-bgBody text-textSecondary hover:bg-brandSoft hover:text-brand"
                }`}
              >
                {tech.name}
              </button>
            ))}
          </div>
        </div>

        {/* Duration Hours Filter */}
        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-textMuted">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-brand" /> Duration
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[null, 60, 120, 180].map((dur) => (
              <button
                key={dur === null ? "all" : dur}
                onClick={() => onDurationSelect(dur)}
                className={`rounded-lg py-1.5 text-center text-xs font-bold transition-all cursor-pointer ${
                  selectedDuration === dur
                    ? "bg-brand text-white shadow-xs"
                    : "bg-bgBody text-textSecondary hover:bg-brandSoft hover:text-brand"
                }`}
              >
                {dur === null ? "All" : `${dur}+h`}
              </button>
            ))}
          </div>
        </div>

        {/* Reset All Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="w-full rounded-xl border border-borderLight bg-bgBody py-2 text-xs font-bold text-textMuted hover:border-brand hover:text-brand transition-all cursor-pointer"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </aside>
  );
};
