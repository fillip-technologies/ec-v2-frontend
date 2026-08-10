"use client";

import React from "react";
import { Container } from "../ui/Container";
import { Users, FolderCheck, Award, Building } from "lucide-react";

export const StatsCounterSection: React.FC = () => {
  const stats = [
    {
      value: "6,000+",
      label: "Enrolled Students",
      desc: "Learners actively building portfolio projects",
      icon: <Users className="h-6 w-6 text-[#6D5DF6]" />,
      bgTone: "bg-[#F5F3FF]",
    },
    {
      value: "320+",
      label: "Project Templates",
      desc: "Industry-aligned across 5 disciplines",
      icon: <FolderCheck className="h-6 w-6 text-[#0EA5E9]" />,
      bgTone: "bg-[#F0F9FF]",
    },
    {
      value: "98%",
      label: "Completion Rate",
      desc: "Guided step-by-step milestone progression",
      icon: <Award className="h-6 w-6 text-[#22C55E]" />,
      bgTone: "bg-[#F0FDF4]",
    },
    {
      value: "150+",
      label: "College Partners",
      desc: "Bulk internship seat distribution channels",
      icon: <Building className="h-6 w-6 text-[#EAB308]" />,
      bgTone: "bg-[#FEFCE8]",
    },
  ];

  return (
    <section className="relative border-y border-[#ECEBFF] bg-white py-10 sm:py-12">
      <Container size="wide">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="group flex items-start gap-4 rounded-3xl border border-[#ECEBFF] bg-[#FAFBFF] p-5 transition duration-300 hover:scale-[1.02] hover:border-[#6D5DF6] hover:bg-white hover:shadow-xl"
            >
              <div
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${item.bgTone} transition duration-300 group-hover:scale-110`}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-2xl font-black text-[#161326] sm:text-3xl">{item.value}</p>
                <p className="text-xs font-black uppercase tracking-wider text-[#6D5DF6]">
                  {item.label}
                </p>
                <p className="mt-1 text-xs text-[#6B7280]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
