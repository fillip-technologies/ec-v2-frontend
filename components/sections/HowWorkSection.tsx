"use client";

import React from "react";
import { Zap, FolderOpen, LayoutGrid, ListCheck, GitBranch, MessageSquareCheck, BadgeCheck } from "lucide-react";

export const HowWorkSection: React.FC = () => {
  const steps = [
    { step: "01", icon: <FolderOpen className="h-6 w-6" />, title: "Choose", desc: "Select project" },
    { step: "02", icon: <LayoutGrid className="h-6 w-6" />, title: "Workspace", desc: "Open board" },
    { step: "03", icon: <ListCheck className="h-6 w-6" />, title: "Tasks", desc: "Complete work" },
    { step: "04", icon: <GitBranch className="h-6 w-6" />, title: "GitHub", desc: "Submit repo", active: true },
    { step: "05", icon: <MessageSquareCheck className="h-6 w-6" />, title: "Review", desc: "Get approval" },
    { step: "06", icon: <BadgeCheck className="h-6 w-6" />, title: "Certificate", desc: "Earn proof" },
  ];

  return (
    <section id="how-it-works" className="ec-how-section ec-pipeline-section relative isolate overflow-hidden py-16 sm:py-20 lg:py-24">
      {/* Background Lighting & Grid Canvas */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="ec-pipeline-grid absolute inset-0 opacity-70" />
        <div className="ec-pipeline-ambient-orange absolute -left-24 top-0 h-80 w-80 rounded-full blur-[110px]" />
        <div className="ec-pipeline-ambient-green absolute right-1/4 top-24 h-80 w-80 rounded-full blur-[120px]" />
      </div>

      <div className="container-main">
        {/* Header Block */}
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="max-w-3xl">
            <div className="ec-pipeline-heading-card inline-flex items-center gap-3 rounded-2xl px-4 py-3">
              <span className="ec-pipeline-heading-icon grid h-10 w-10 place-items-center rounded-xl text-lg">
                <Zap className="h-5 w-5" />
              </span>
              <div>
                <p className="ec-pipeline-label text-xs font-black uppercase tracking-[0.18em]">How It Works</p>
                <h2 className="mt-1 text-2xl font-black leading-tight text-textPrimary sm:text-3xl lg:text-4xl">
                  Project completion pipeline
                </h2>
              </div>
            </div>
            <p className="ec-pipeline-copy mt-5 max-w-2xl text-base leading-8">
              Move step by step from project selection to workspace tasks, GitHub proof, review, and certificate.
            </p>
          </div>

          <span className="ec-pipeline-status mt-5 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-black">
            <span className="ec-pipeline-status-dot h-2 w-2 rounded-full" />
            Running
          </span>
        </div>

        {/* 6 Pipeline Cards Grid */}
        <div className="mt-12 grid gap-10 lg:grid-cols-6 lg:gap-12">
          {steps.map((item, index) => {
            const active = !!item.active;
            const tone = active ? "#6D5DF6" : "#22C997";
            const isLast = index === steps.length - 1;

            return (
              <article
                key={index}
                className={`ec-pipeline-card ${
                  active ? "ec-pipeline-card-active" : ""
                } group relative z-10 rounded-xl border p-5 text-center transition duration-300 hover:-translate-y-1`}
              >
                <p className="text-xs font-black tracking-[0.14em]" style={{ color: tone }}>
                  {item.step}
                </p>

                <span
                  className="ec-pipeline-icon mx-auto mt-4 grid h-14 w-14 place-items-center rounded-full text-2xl"
                  style={{
                    background: `${tone}18`,
                    color: tone,
                    boxShadow: `0 0 24px ${tone}35`,
                  }}
                >
                  {item.icon}
                </span>

                <h3 className="mt-4 text-base font-black text-textPrimary">{item.title}</h3>
                <p className="mt-2 text-sm font-medium text-textGray">{item.desc}</p>

                {!isLast && (
                  <>
                    <span className="ec-pipeline-connector" aria-hidden="true">
                      <span className="ec-pipeline-flow" />
                      <span className="ec-pipeline-arrow" />
                    </span>
                    <span className="ec-pipeline-connector-mobile" aria-hidden="true" />
                  </>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
