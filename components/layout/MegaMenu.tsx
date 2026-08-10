"use client";

import React, { useState } from "react";
import Link from "next/link";
import { INTERNSHIP_DATA } from "@/config/internshipTopics";
import { ChevronDown, ChevronRight, BookOpen } from "lucide-react";

interface MegaMenuProps {
  mobile?: boolean;
  onSelect?: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ mobile = false, onSelect }) => {
  const levelOrder = ["Beginner", "Intermediate", "Advanced"];
  const [selectedLevel, setSelectedLevel] = useState<string>("Beginner");
  const [open, setOpen] = useState(false);

  const currentLevelData = INTERNSHIP_DATA[selectedLevel];

  if (mobile) {
    return (
      <div className="space-y-4">
        {/* Mobile Level Tabs */}
        <div className="grid grid-cols-3 gap-2">
          {levelOrder.map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setSelectedLevel(lvl)}
              className={`rounded-[14px] px-3 py-2 text-xs font-semibold transition cursor-pointer ${
                selectedLevel === lvl
                  ? "bg-[#7C5CFC] text-white"
                  : "bg-[#EEF5FF] text-[#3D2090] hover:bg-[#7C5CFC]/15 hover:text-[#7C5CFC]"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Selected Tier Banner */}
        <div className="rounded-[24px] border border-[#E2D9FF] bg-[#EEF5FF] p-4">
          <p className="text-sm font-bold text-[#160840]">{selectedLevel} Tier</p>
          <p className="mt-1 text-xs text-[#8B7FBF]">
            {currentLevelData.duration} | {currentLevelData.projects}
          </p>
        </div>

        {/* Categories List */}
        <div className="max-h-[28rem] space-y-4 overflow-y-auto pr-1">
          {currentLevelData.categories.map((cat) => (
            <div key={cat.name} className="rounded-[24px] border border-[#E2D9FF] bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#7C5CFC]">
                {cat.name}
              </p>
              <div className="mt-3 space-y-2">
                {cat.topics.map((program) => (
                  <Link
                    key={program.slug}
                    href="#courses"
                    onClick={onSelect}
                    className="flex items-start gap-2 rounded-[14px] px-3 py-2 text-sm font-semibold text-[#3D2090] transition hover:bg-[#7C5CFC]/15 hover:text-[#7C5CFC]"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7C5CFC]" />
                    <span>{program.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={`nav-link cursor-pointer ${open ? "nav-link-active" : ""}`}
      >
        Internships
        <ChevronDown
          className={`ml-1 h-3.5 w-3.5 transition duration-200 ${
            open ? "rotate-180 text-white" : ""
          }`}
        />
      </button>

      {open && (
        <div className="dropdown-panel fixed left-1/2 top-24 z-50 w-[min(1120px,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden p-0 shadow-2xl">
          <div className="grid max-h-[calc(100vh-7rem)] grid-cols-[250px_1fr] overflow-hidden">
            {/* Left Aside Sidebar */}
            <aside className="border-r border-[#E2D9FF] bg-gradient-to-b from-[#EEF5FF] to-white p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7C5CFC]">
                Choose your level
              </p>

              <div className="mt-4 space-y-2">
                {levelOrder.map((lvl) => {
                  const isActive = selectedLevel === lvl;

                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedLevel(lvl)}
                      className={`group w-full rounded-[24px] border p-4 text-left transition cursor-pointer ${
                        isActive
                          ? "border-[#7C5CFC] bg-white shadow-[0_18px_48px_rgba(22,8,64,0.08)]"
                          : "border-transparent hover:border-[#E2D9FF] hover:bg-white/80"
                      }`}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-sm font-black text-[#160840]">{lvl} Tier</span>
                        <span
                          className={`grid h-7 w-7 place-items-center rounded-full transition ${
                            isActive
                              ? "bg-[#7C5CFC] text-white"
                              : "bg-[#EEF5FF] text-[#7C5CFC] group-hover:bg-[#7C5CFC]/15"
                          }`}
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </span>
                      <span className="mt-2 block text-xs font-semibold text-[#8B7FBF]">
                        {INTERNSHIP_DATA[lvl].duration}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Level Path Info Card */}
              <div className="mt-5 rounded-[24px] bg-[#160840] p-4 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#A78BFA]">
                  {selectedLevel} path
                </p>
                <p className="mt-2 text-sm font-bold leading-5 text-white">
                  {currentLevelData.projects}
                </p>
                <p className="mt-3 text-xs leading-5 text-white/70">{currentLevelData.focus}</p>
              </div>
            </aside>

            {/* Right Categories Grid */}
            <div className="bg-white p-5">
              <div className="flex items-center justify-between gap-6 border-b border-[#E2D9FF] pb-4">
                <div>
                  <p className="text-sm font-black text-[#160840]">
                    {selectedLevel} Internship Topics
                  </p>
                  <p className="text-caption mt-1">Pick a focused track and open the full course page.</p>
                </div>

                <a
                  href="#courses"
                  onClick={() => {
                    setOpen(false);
                    onSelect?.();
                  }}
                  className="rounded-full bg-[#F5C842]/18 px-4 py-2 text-xs font-black text-[#160840] transition hover:bg-[#F5C842]"
                >
                  View modules
                </a>
              </div>

              <div className="mt-4 grid max-h-[calc(100vh-15rem)] grid-cols-1 gap-3 overflow-y-auto pr-1 xl:grid-cols-2">
                {currentLevelData.categories.map((cat) => (
                  <section
                    key={cat.name}
                    className="rounded-[24px] border border-[#E2D9FF] bg-[#EEF5FF]/45 p-4 transition hover:border-[#7C5CFC]/30 hover:bg-white hover:shadow-[0_18px_48px_rgba(22,8,64,0.08)]"
                  >
                    <div className="flex items-start gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[14px] bg-white text-[#7C5CFC] shadow-sm">
                        <BookOpen className="h-4 w-4" />
                      </span>

                      <div>
                        <p className="text-[11px] font-black uppercase leading-4 tracking-[0.12em] text-[#7C5CFC]">
                          {cat.name}
                        </p>
                        <p className="text-caption mt-1">{cat.topics.length} focused tracks</p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-1.5">
                      {cat.topics.map((program) => (
                        <a
                          key={program.slug}
                          href="#courses"
                          onClick={() => {
                            setOpen(false);
                            onSelect?.();
                          }}
                          className="group/link flex items-start gap-2 rounded-[14px] px-2.5 py-2 text-[13px] font-bold leading-snug text-[#3D2090] transition hover:bg-[#7C5CFC]/15 hover:text-[#7C5CFC]"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7C5CFC]/55 transition group-hover/link:bg-[#7C5CFC]" />
                          <span className="flex-1">{program.title}</span>
                        </a>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
