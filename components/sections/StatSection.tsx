"use client";

import React from "react";

export const StatSection: React.FC = () => {
  const stats = [
    { display: "6K+", label: "Students enrolled", note: "Building real project portfolios" },
    { display: "320+", label: "Project options", note: "Across multiple domains and levels" },
    { display: "4.1K+", label: "Certificates issued", note: "Unlocked after submission review" },
    { display: "98%", label: "Completion rate", note: "Guided by milestone workflows" },
  ];

  return (
    <section className="bg-[#FAFBFF] py-14 sm:py-16 lg:py-20">
      <div className="container-main">
        <div className="overflow-hidden rounded-[2rem] border border-[#ECEBFF] bg-white shadow-[0_24px_80px_rgba(15,10,42,0.08)]">
          <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
            <div className="relative isolate bg-gradient-to-br from-white to-[#F5F3FF] p-6 sm:p-8 lg:p-10">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_22%,rgba(109,93,246,0.12),transparent_32%),radial-gradient(circle_at_85%_78%,rgba(168,85,247,0.10),transparent_30%)]" />
              <span className="inline-flex rounded-full bg-[#F5F3FF] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#6D5DF6]">
                Success Numbers
              </span>
              <h2 className="mt-5 text-3xl font-black leading-tight text-[#161326] sm:text-4xl">
                Proof that structure creates outcomes.
              </h2>
              <p className="mt-4 text-base leading-8 text-[#6B7280]">
                Students move from project selection to GitHub proof and verified certificates with a clear completion system.
              </p>
            </div>

            <div className="grid sm:grid-cols-2">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`group border-[#ECEBFF] p-6 transition duration-300 hover:bg-[#FAFBFF] sm:p-8 ${
                    idx > 0 ? "border-t" : ""
                  } ${idx === 1 ? "sm:border-l sm:border-t-0" : ""} ${idx === 3 ? "sm:border-l" : ""}`}
                >
                  <p className="text-4xl font-black leading-none text-[#161326] transition group-hover:scale-[1.03] sm:text-5xl">
                    {stat.display}
                  </p>
                  <p className="mt-4 text-base font-black text-[#161326]">{stat.label}</p>
                  <p className="mt-2 text-sm leading-6 text-[#6B7280]">{stat.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
