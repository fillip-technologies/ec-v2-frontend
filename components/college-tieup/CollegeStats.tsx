"use client";

import React from "react";

export const CollegeStats: React.FC = () => {
  const stats = [
    { value: "50+", label: "college conversations supported" },
    { value: "10k+", label: "student learning journeys" },
    { value: "300+", label: "guided project tasks" },
    { value: "12+", label: "career domains" },
  ];

  return (
    <section className="border-y border-[#E2D9FF] bg-white py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-[#E2D9FF] bg-[#E2D9FF] sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6">
              <p className="text-3xl font-black tracking-tight text-[#160840]">{stat.value}</p>
              <p className="mt-2 text-sm leading-6 text-[#6B7280]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
