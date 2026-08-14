"use client";

import React, { useState } from "react";
import { INTERNSHIP_DATA } from "@/config/internshipTopics";
import { ChevronLeft, ChevronRight, ListCheck, GitBranch, CheckCircle2, ChevronDown } from "lucide-react";

interface ModulesSectionProps {
  onOpenEnquiry?: (category?: string) => void;
}

export const ModulesSection: React.FC<ModulesSectionProps> = ({ onOpenEnquiry }) => {
  const levelOrder = ["Beginner", "Intermediate", "Advanced"];

  const levelConfigs: Record<string, { number: string; label: string; tone: string; cta: string }> = {
    "Beginner Level": {
      number: "01",
      label: "Beginner",
      tone: "from-white to-surface",
      cta: "bg-brand hover:bg-brandHover",
    },
    "Intermediate Level": {
      number: "02",
      label: "Intermediate",
      tone: "from-white to-surface",
      cta: "bg-brand hover:bg-brandHover",
    },
    "Advanced Level": {
      number: "03",
      label: "Advanced",
      tone: "from-white to-surface",
      cta: "bg-brand hover:bg-brandHover",
    },
  };

  const projectGradients = [
    { from: "#7C5CFC", via: "#A78BFA", to: "#22c997" },
    { from: "#2563EB", via: "#7C5CFC", to: "#A78BFA" },
    { from: "#0EA5E9", via: "#22c997", to: "#7C5CFC" },
    { from: "#7C5CFC", via: "#F5C842", to: "#F59E0B" },
    { from: "#14B8A6", via: "#3B82F6", to: "#A78BFA" },
    { from: "#6366F1", via: "#A78BFA", to: "#F97316" },
  ];

  // Track active category and expansion state for each level
  const [activeCategories, setActiveCategories] = useState<Record<string, string>>({
    "Beginner Level": "technology-data",
    "Intermediate Level": "technology-data",
    "Advanced Level": "technology-data",
  });

  const [expandedState, setExpandedState] = useState<Record<string, boolean>>({});

  const handleScroll = (key: string, direction: "prev" | "next") => {
    const el = document.getElementById(`slider-${key}`);
    if (el) {
      const scrollAmount = direction === "next" ? 360 : -360;
      el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section id="courses" className="relative isolate overflow-hidden bg-bgBody py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-10 top-24 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-80 w-80 rounded-full bg-brandLight/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-borderSoft bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-brand shadow-sm">
            Level-Based Project Tracks
          </span>
          <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-textPrimary sm:text-4xl lg:text-6xl">
            Pick a project that matches your level.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-textGray">
            Every track is designed as a practical build: milestones, GitHub submission, review, and a verified certificate.
          </p>
        </div>

        {/* Stacked Level Cards */}
        <div className="space-y-8">
          {levelOrder.map((key) => {
            const levelData = INTERNSHIP_DATA[key];
            const levelName = `${key} Level`;
            const cfg = levelConfigs[levelName] || levelConfigs["Beginner Level"];
            const currentCatSlug = activeCategories[levelName] || levelData.categories[0].slug;
            const currentCat =
              levelData.categories.find((c) => c.slug === currentCatSlug) || levelData.categories[0];
            const isExpanded = expandedState[levelName] || false;

            return (
              <div
                key={levelName}
                className="overflow-hidden rounded-[2rem] border border-borderSoft bg-white/85 p-4 shadow-lg backdrop-blur-2xl transition duration-300 hover:border-brand hover:bg-surface sm:p-6"
              >
                {/* Level Summary Header Card */}
                <div
                  className={`grid gap-5 rounded-[1.5rem] border border-borderSoft bg-gradient-to-br ${cfg.tone} p-6 lg:grid-cols-[1fr_auto] lg:items-center`}
                >
                  <div>
                    <span className="inline-flex rounded-full bg-bgSoft px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-brand">
                      {cfg.number} / {cfg.label} Level
                    </span>
                    <h3 className="mt-4 text-2xl font-black text-textPrimary sm:text-3xl">
                      {cfg.label} project workspace
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-textGray">
                      {levelData.focus ||
                        "Choose a domain project, complete milestone tasks, and build proof of work."}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 sm:min-w-[28rem]">
                    <div className="rounded-2xl border border-borderSoft bg-white p-4 backdrop-blur-xl">
                      <p className="text-xl font-black text-textPrimary">{levelData.topicCount}</p>
                      <p className="mt-1 text-xs font-bold text-textSubtle">Topics</p>
                    </div>
                    <div className="rounded-2xl border border-borderSoft bg-white p-4 backdrop-blur-xl">
                      <p className="text-xl font-black text-textPrimary">{levelData.projects.split(" ")[0]}</p>
                      <p className="mt-1 text-xs font-bold text-textSubtle">Projects</p>
                    </div>
                    <div className="rounded-2xl border border-borderSoft bg-white p-4 backdrop-blur-xl">
                      <p className="text-xl font-black text-textPrimary">{levelData.duration}</p>
                      <p className="mt-1 text-xs font-bold text-textSubtle">Duration</p>
                    </div>
                  </div>
                </div>

                {/* Category Filter Pills Bar */}
                <div className="mt-6 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {levelData.categories.map((cat) => (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() =>
                        setActiveCategories({ ...activeCategories, [levelName]: cat.slug })
                      }
                      className={`shrink-0 rounded-full border px-5 py-3 text-sm font-black transition duration-300 cursor-pointer ${
                        currentCatSlug === cat.slug
                          ? "border-brand bg-bgSoft text-textPrimary shadow-sm"
                          : "border-borderSoft bg-bgBody text-textPrimary hover:border-brand hover:bg-surface"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Category Panel with Slider Controls & Cards */}
                <div className="mt-4">
                  {/* Slider Prev / Next Controls */}
                  <div className="mb-5 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => handleScroll(`${levelName}-${currentCatSlug}`, "prev")}
                      className="grid h-11 w-11 place-items-center rounded-full border border-borderSoft bg-white text-textPrimary shadow-sm transition hover:-translate-y-0.5 hover:text-brand cursor-pointer"
                      aria-label="Previous projects"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScroll(`${levelName}-${currentCatSlug}`, "next")}
                      className="grid h-11 w-11 place-items-center rounded-full border border-borderSoft bg-white text-textPrimary shadow-sm transition hover:-translate-y-0.5 hover:text-brand cursor-pointer"
                      aria-label="Next projects"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Horizontal Scrollable Slider */}
                  <div
                    id={`slider-${levelName}-${currentCatSlug}`}
                    className="flex gap-5 overflow-x-auto pb-4 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
                  >
                    {currentCat.topics
                      .slice(0, isExpanded ? currentCat.topics.length : 10)
                      .map((program, topicIdx) => {
                        const gradient = projectGradients[topicIdx % projectGradients.length];

                        return (
                          <div
                            key={program.slug}
                            className="h-auto shrink-0 w-full sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)] xl:w-[calc((100%-3.75rem)/4)]"
                          >
                            <div
                              onClick={() => onOpenEnquiry?.(currentCat.name)}
                              className="group flex h-full min-h-[27rem] flex-col overflow-hidden rounded-[1.5rem] border border-borderSoft bg-white text-textPrimary shadow-sm transition duration-300 hover:scale-[1.02] hover:border-brand hover:bg-surface hover:shadow-xl cursor-pointer"
                            >
                              {/* Top Art Header */}
                              <span className="relative block aspect-[16/10] overflow-hidden bg-gradient-to-br from-borderSoft via-white to-bgSoft">
                                <span
                                  className="ec-project-art absolute inset-0"
                                  style={
                                    {
                                      "--project-from": gradient.from,
                                      "--project-via": gradient.via,
                                      "--project-to": gradient.to,
                                    } as React.CSSProperties
                                  }
                                />
                                <span className="absolute inset-x-5 bottom-5 z-10">
                                  <span
                                    className="block text-xs font-black uppercase tracking-[0.16em]"
                                    style={{ color: "rgba(255, 255, 255, 0.75)" }}
                                  >
                                    {currentCat.name}
                                  </span>
                                  <span
                                    className="mt-2 block text-xl font-black leading-tight text-white line-clamp-2"
                                    style={{ textShadow: "0 8px 18px rgba(15, 10, 42, 0.22)" }}
                                  >
                                    {program.title}
                                  </span>
                                </span>
                                <span className="absolute left-5 top-5 z-10 inline-flex rounded-full bg-white/90 px-3 py-1.5 text-xs font-black text-brand shadow-sm backdrop-blur">
                                  {cfg.label}
                                </span>
                              </span>

                              {/* Card Body */}
                              <span className="flex flex-1 flex-col p-5">
                                <span className="line-clamp-2 text-lg font-black leading-snug text-textPrimary">
                                  {program.title}
                                </span>
                                <span className="mt-2 text-xs font-medium leading-5 text-textGray">
                                  Project track in {currentCat.name}
                                </span>

                                <span className="mt-5 grid gap-2 text-xs font-bold text-textGray">
                                  <span className="inline-flex items-center gap-2">
                                    <ListCheck className="h-4 w-4 text-brand" /> Milestone tasks
                                  </span>
                                  <span className="inline-flex items-center gap-2">
                                    <GitBranch className="h-4 w-4 text-brand" /> GitHub submission
                                  </span>
                                  <span className="inline-flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-success" /> Certificate eligible
                                  </span>
                                </span>

                                <span className="mt-auto pt-6">
                                  <span
                                    className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl ${cfg.cta} px-5 py-3 text-xs font-black text-white transition`}
                                  >
                                    View Project
                                  </span>
                                </span>
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* View More Button if > 10 topics */}
                  {currentCat.topics.length > 10 && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedState({ ...expandedState, [levelName]: !isExpanded })
                      }
                      className="mx-auto mt-4 flex items-center justify-center gap-2 rounded-full border border-borderSoft bg-white px-5 py-3 text-xs font-black text-textPrimary shadow-sm transition hover:scale-[1.02] hover:border-brand hover:bg-bgSoft hover:text-textPrimary cursor-pointer"
                    >
                      <span>{isExpanded ? "Show less" : "View more projects"}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
