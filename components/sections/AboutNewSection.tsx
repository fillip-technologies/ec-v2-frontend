"use client";

import React from "react";
import { X, Check } from "lucide-react";

export const AboutNewSection: React.FC = () => {
  const problems = [
    { title: "Watching tutorials only", desc: "Passive learning feels productive but leaves no proof." },
    { title: "No finished projects", desc: "Half-built demos do not show ownership." },
    { title: "Empty GitHub profile", desc: "Recruiters cannot see your workflow." },
    { title: "No practical experience", desc: "Interview answers stay theoretical." },
  ];

  const solutions = [
    { step: "01", title: "Level-based projects", desc: "Beginner, intermediate, and advanced projects match your current skills." },
    { step: "02", title: "Personal workspace", desc: "Every student gets a clear project board with milestones and tasks." },
    { step: "03", title: "GitHub + review", desc: "Submit working code, receive review, and improve your portfolio." },
    { step: "04", title: "Industry certificate", desc: "Earn a certificate only after completing and submitting the project." },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute -left-24 top-12 -z-10 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-12 -z-10 h-80 w-80 rounded-full bg-[#A855F7]/10 blur-3xl" />

      <div className="container-main">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-borderSoft bg-bgBody px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-brand">
              Why Students Struggle
            </span>
            <h2 className="mt-5 max-w-2xl text-3xl font-black leading-tight tracking-tight text-textPrimary sm:text-4xl lg:text-5xl">
              Tutorials do not get you selected.{" "}
              <span className="block bg-gradient-to-r from-brand to-[#A855F7] bg-clip-text text-transparent">
                Proof of work does.
              </span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-textGray">
              Most students know concepts, but interviews ask for evidence: what you built, how you solved problems, and whether your GitHub shows consistent practical work.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {problems.map((problem, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-borderSoft bg-bgBody p-5 transition duration-300 hover:scale-[1.02] hover:border-brand hover:bg-[#FCFBFF] hover:shadow-[0_16px_38px_rgba(109,93,246,0.10)]"
                >
                  <div className="mb-4 grid h-10 w-10 place-items-center rounded-2xl bg-red-50 text-red-500">
                    <X className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-black text-textPrimary">{problem.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-textGray">{problem.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-borderSoft bg-white p-4 shadow-[0_30px_90px_rgba(15,10,42,0.10)]">
              <div className="rounded-[1.5rem] border border-borderSoft bg-gradient-to-br from-white via-[#FCFBFF] to-[#F5F3FF] p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">
                      Engineers Clinic Method
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-textPrimary">From learning to evidence</h3>
                  </div>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-bgSoft text-brand backdrop-blur">
                    <Check className="h-6 w-6" />
                  </span>
                </div>

                <div className="mt-8 space-y-4">
                  {solutions.map((solution, idx) => (
                    <div
                      key={idx}
                      className="group flex gap-4 rounded-3xl border border-borderSoft bg-white p-4 backdrop-blur-xl transition duration-300 hover:scale-[1.02] hover:border-brand hover:bg-[#FCFBFF] hover:shadow-[0_16px_38px_rgba(109,93,246,0.10)]"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-bgSoft text-sm font-black text-brand">
                        {solution.step}
                      </span>
                      <div>
                        <h4 className="font-black text-textPrimary">{solution.title}</h4>
                        <p className="mt-1 text-sm leading-6 text-textGray">{solution.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
