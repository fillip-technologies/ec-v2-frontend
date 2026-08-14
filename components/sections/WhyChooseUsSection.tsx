"use client";

import React from "react";
import { Container } from "../ui/Container";
import { Badge } from "../ui/Badge";
import { FolderGit2, Layout, GitBranch, Sparkles, Award, ShieldAlert } from "lucide-react";

export const WhyChooseUsSection: React.FC = () => {
  const features = [
    {
      icon: <FolderGit2 className="h-6 w-6 text-brand" />,
      title: "Level-Based Projects",
      desc: "Choose beginner (45d), intermediate (75d), or advanced (90d) tracks tailored to your skills.",
      glow: "rgba(124, 92, 252, 0.18)",
      bg: "from-surface to-white",
    },
    {
      icon: <Layout className="h-6 w-6 text-info" />,
      title: "Personal Workspace",
      desc: "Track milestones, task requirements, submissions, and feedback in a dedicated workspace.",
      glow: "rgba(14, 165, 233, 0.18)",
      bg: "from-infoLight to-white",
    },
    {
      icon: <GitBranch className="h-6 w-6 text-success" />,
      title: "GitHub Workflow",
      desc: "Build professional software habits with real commits, repositories, and visible code proof.",
      glow: "rgba(34, 197, 94, 0.18)",
      bg: "from-successLight to-white",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-warningMuted" />,
      title: "AI Rubric Review",
      desc: "Submit deliverables for instant rubric evaluation with score breakdowns and improvements.",
      glow: "rgba(234, 179, 8, 0.18)",
      bg: "from-warningLight to-white",
    },
    {
      icon: <Award className="h-6 w-6 text-brandLight" />,
      title: "Verifiable Certificate",
      desc: "Earn a QR-verified certificate with public verification URL and LinkedIn credential sharing.",
      glow: "rgba(167, 139, 250, 0.18)",
      bg: "from-surface to-white",
    },
    {
      icon: <ShieldAlert className="h-6 w-6 text-brand" />,
      title: "Career & Recruiter Proof",
      desc: "Use verified project deliverables, GitHub links, and scores to stand out in interviews.",
      glow: "rgba(124, 92, 252, 0.18)",
      bg: "from-surface to-white",
    },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <Container size="wide">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <Badge variant="brand">Why Choose Us</Badge>
          <h2 className="mt-5 text-3xl font-black leading-tight text-textPrimary sm:text-4xl lg:text-5xl">
            Everything students need to turn learning into proof.
          </h2>
          <p className="mt-4 text-base leading-8 text-textGray">
            A premium project-based system designed around outcomes recruiters can inspect.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((item, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-3xl border border-borderSoft bg-gradient-to-br ${item.bg} p-6 shadow-md transition duration-300 hover:scale-[1.02] hover:border-brand hover:shadow-2xl`}
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl transition duration-300 group-hover:scale-125"
                style={{ background: item.glow }}
              />

              <div className="relative">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-sm transition duration-300 group-hover:-translate-y-1">
                  {item.icon}
                </span>

                <h3 className="mt-5 text-lg font-black text-textPrimary">{item.title}</h3>
                <p className="mt-2 text-xs leading-6 text-textGray">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
