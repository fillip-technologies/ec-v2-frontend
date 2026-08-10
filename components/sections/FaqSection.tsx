"use client";

import React, { useState } from "react";
import { Container } from "../ui/Container";
import { Badge } from "../ui/Badge";
import { Plus, Minus, HelpCircle } from "lucide-react";

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Is Engineers Clinic a course website?",
      a: "No. It is a project-based learning platform where students select projects, complete guided step-by-step milestones, submit deliverables to GitHub, receive AI rubric evaluation, and earn verifiable certificates.",
    },
    {
      q: "What happens after I enroll in a project track?",
      a: "You receive access to a personal workspace snapshot containing step milestones, task requirements, submission gateways, and live progress metrics.",
    },
    {
      q: "Do I need to upload code to GitHub?",
      a: "Yes, for technical projects. Submitting your code and commit history to GitHub provides transparent, recruiter-verifiable proof of work.",
    },
    {
      q: "When do I receive the certificate?",
      a: "You receive your industry certificate after completing all 3 required projects in your program and meeting the minimum rubric score verified by our AI engine.",
    },
    {
      q: "Is this beginner friendly?",
      a: "Yes. Projects are organized by level (Beginner 45d, Intermediate 75d, Advanced 90d), allowing beginners to build foundational skills while advanced students take on deep architectures.",
    },
    {
      q: "Can I use the certificate on LinkedIn and resume?",
      a: "Yes. Every certificate features a unique ID and a QR code resolving to a public verification URL showing your program credentials, issue date, and evaluated status.",
    },
  ];

  return (
    <section id="faq" className="relative isolate overflow-hidden bg-[#FAFBFF] py-16 sm:py-20 lg:py-24">
      <Container size="narrow">
        <div className="mb-10 text-center">
          <Badge variant="brand">Frequently Asked Questions</Badge>
          <h2 className="mt-5 text-3xl font-black leading-tight text-[#161326] sm:text-4xl lg:text-5xl">
            Questions students ask before starting.
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="overflow-hidden rounded-3xl border border-[#ECEBFF] bg-white shadow-sm transition duration-300 hover:border-[#6D5DF6]"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
                >
                  <span className="text-base font-black text-[#161326] sm:text-lg">{faq.q}</span>
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition duration-300 ${
                      isOpen ? "bg-[#6D5DF6] text-white rotate-180" : "bg-[#F5F3FF] text-[#6D5DF6]"
                    }`}
                  >
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-[#ECEBFF] px-5 pb-6 pt-4 text-sm leading-7 text-[#6B7280] sm:px-6">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
