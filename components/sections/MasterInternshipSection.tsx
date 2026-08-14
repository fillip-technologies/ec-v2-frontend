"use client";

import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";

interface MasterInternshipSectionProps {
  onOpenEnquiry?: () => void;
}

export const MasterInternshipSection: React.FC<MasterInternshipSectionProps> = ({ onOpenEnquiry }) => {
  const programs = [
    { badge: "Starter", title: "Beginner Project Sprint", image: "/images/master1.png", price: "99", best: false },
    { badge: "Most Popular", title: "Intermediate Workspace", image: "/images/master2.png", price: "299", best: true },
    { badge: "Advanced", title: "Industry Project Review", image: "/images/master3.png", price: "499", best: false },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-20 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-brandLight/10 blur-3xl" />
      </div>

      <div className="container-main">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mt-5 text-3xl font-black leading-tight text-textPrimary sm:text-4xl lg:text-5xl">
            Start with the right project plan.
          </h2>
          <p className="mt-5 text-base leading-8 text-textGray">
            Choose a workspace experience based on your current level and the depth of review you need.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {programs.map((program, idx) => (
            <article
              key={idx}
              className={`group relative flex min-h-full flex-col overflow-hidden rounded-[2rem] border ${
                program.best
                  ? "border-brand bg-surface text-textPrimary shadow-xl"
                  : "border-borderSoft bg-white text-textPrimary shadow-md"
              } p-4 transition duration-300 hover:scale-[1.02] hover:border-brand hover:bg-surface hover:shadow-lg`}
            >
              <div className="relative h-52 overflow-hidden rounded-[1.5rem] bg-bgBody">
                <Image
                  src={program.image}
                  alt={program.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-bgSoft px-3 py-1.5 text-xs font-black text-brand">
                  {program.badge}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-2xl font-black text-textPrimary">{program.title}</h3>
                <div className="mt-5 flex items-end gap-2">
                  <span className="text-5xl font-black text-textPrimary">₹{program.price}</span>
                  <span className="pb-2 text-sm font-bold text-textSubtle">one-time</span>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    "Personal workspace",
                    "Milestone task board",
                    "GitHub submission",
                    "Review eligibility",
                    "Industry certificate",
                  ].map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-3">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-success/10 text-success">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-sm font-bold text-textGray">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={onOpenEnquiry}
                  className="mt-auto inline-flex min-h-12 items-center justify-center rounded-2xl bg-brand px-5 py-3 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-brandHover cursor-pointer"
                >
                  Enroll Now
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
