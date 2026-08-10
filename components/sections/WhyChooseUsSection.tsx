"use client";

import React from "react";
import { Container } from "../ui/Container";
import { Badge } from "../ui/Badge";
import { FolderGit2, Layout, GitBranch, Sparkles, Award, ShieldAlert } from "lucide-react";

export const WhyChooseUsSection: React.FC = () => {
  const features = [
    {
      icon: <FolderGit2 className="h-6 w-6 text-[#6D5DF6]" />,
      title: "Level-Based Projects",
      desc: "Choose beginner (45d), intermediate (75d), or advanced (90d) tracks tailored to your skills.",
      glow: "rgba(109, 93, 246, 0.18)",
      bg: "from-[#F5F3FF] to-white",
    },
    {
      icon: <Layout className="h-6 w-6 text-[#0EA5E9]" />,
      title: "Personal Workspace",
      desc: "Track milestones, task requirements, submissions, and feedback in a dedicated workspace.",
      glow: "rgba(14, 165, 233, 0.18)",
      bg: "from-[#F0F9FF] to-white",
    },
    {
      icon: <GitBranch className="h-6 w-6 text-[#22C55E]" />,
      title: "GitHub Workflow",
      desc: "Build professional software habits with real commits, repositories, and visible code proof.",
      glow: "rgba(34, 197, 94, 0.18)",
      bg: "from-[#F0FDF4] to-white",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-[#EAB308]" />,
      title: "AI Rubric Review",
      desc: "Submit deliverables for instant rubric evaluation with score breakdowns and improvements.",
      glow: "rgba(234, 179, 8, 0.18)",
      bg: "from-[#FEFCE8] to-white",
    },
    {
      icon: <Award className="h-6 w-6 text-[#EC4899]" />,
      title: "Verifiable Certificate",
      desc: "Earn a QR-verified certificate with public verification URL and LinkedIn credential sharing.",
      glow: "rgba(236, 72, 153, 0.18)",
      bg: "from-[#FDF2F8] to-white",
    },
    {
      icon: <ShieldAlert className="h-6 w-6 text-[#8B5CF6]" />,
      title: "Career & Recruiter Proof",
      desc: "Use verified project deliverables, GitHub links, and scores to stand out in interviews.",
      glow: "rgba(139, 92, 246, 0.18)",
      bg: "from-[#F5F3FF] to-white",
    },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <Container size="wide">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <Badge variant="brand">Why Choose Us</Badge>
          <h2 className="mt-5 text-3xl font-black leading-tight text-[#161326] sm:text-4xl lg:text-5xl">
            Everything students need to turn learning into proof.
          </h2>
          <p className="mt-4 text-base leading-8 text-[#6B7280]">
            A premium project-based system designed around outcomes recruiters can inspect.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((item, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-3xl border border-[#ECEBFF] bg-gradient-to-br ${item.bg} p-6 shadow-md transition duration-300 hover:scale-[1.02] hover:border-[#6D5DF6] hover:shadow-2xl`}
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl transition duration-300 group-hover:scale-125"
                style={{ background: item.glow }}
              />

              <div className="relative">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-sm transition duration-300 group-hover:-translate-y-1">
                  {item.icon}
                </span>

                <h3 className="mt-5 text-lg font-black text-[#161326]">{item.title}</h3>
                <p className="mt-2 text-xs leading-6 text-[#6B7280]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
