"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { INTERNSHIP_DATA } from "@/config/internshipTopics";

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = "mt-16" }) => {
  const levels = ["Beginner", "Intermediate", "Advanced"];

  const mainLinks = [
    { label: "Home", href: "/" },
    { label: "College Tie-ups", href: "/college-tieup" },
    { label: "Company Branding", href: "/company-branding" },
    { label: "About Us", href: "/about" },
    { label: "Login", href: "/login" },
  ];

  return (
    <footer className={`bg-surfaceDark text-white ${className}`}>
      <div className="container-main py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_2.1fr_0.9fr]">
          {/* Column 1: Brand & Contact Info */}
          <div>
            <Image
              src="/images/Engineers-clinics.png"
              alt="Engineers Clinic"
              width={200}
              height={48}
              className="h-12 w-auto object-contain"
            />

            <p className="mt-5 max-w-sm text-sm leading-7 text-bgSoft/80">
              A practical internship operating system for students, colleges, and career-focused learning teams.
            </p>

            <div className="mt-6 space-y-3 text-sm text-bgSoft/75">
              <a
                href="mailto:info@engineersclinic.com"
                className="flex items-start gap-3 transition hover:text-secondary"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                <span className="break-all">info@engineersclinic.com</span>
              </a>
              <a
                href="tel:+917545999990"
                className="flex items-start gap-3 transition hover:text-secondary"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                <span>+91-75459-99990</span>
              </a>
              <a
                href="tel:+917979030298"
                className="flex items-start gap-3 transition hover:text-secondary"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                <span>+91-79790-30298</span>
              </a>
            </div>

            <div className="mt-8">
              <h3 className="text-xs font-black uppercase tracking-[0.16em] text-brandLight">
                Our Verticals
              </h3>
              <div className="mt-4 space-y-2 text-sm text-bgSoft/75">
                <a
                  href="https://fillipskillacademy.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 transition hover:text-secondary"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                  <span>Fillip Skill Academy</span>
                </a>
                <a
                  href="https://filliptechnologies.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 transition hover:text-secondary"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                  <span>Fillip Technologies</span>
                </a>
                <a
                  href="https://technosysmanagement.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 transition hover:text-secondary"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                  <span>Technosys Management</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Internship Tracks Grid */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.16em] text-brandLight">
              Internship Tracks
            </h3>

            <div className="mt-5 grid gap-6 md:grid-cols-3">
              {levels.map((level) => {
                const levelData = INTERNSHIP_DATA[level];
                const topTopics = levelData.categories
                  .flatMap((c) => c.topics)
                  .slice(0, 6);

                return (
                  <div key={level}>
                    <p className="text-sm font-bold text-white">{level} Level</p>
                    <div className="mt-3 space-y-2">
                      {topTopics.map((topic) => (
                        <a
                          key={topic.slug}
                          href="#courses"
                          className="block text-sm leading-6 text-bgSoft/75 transition hover:text-secondary"
                        >
                          {topic.title}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 3: Platform Links & Contact */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.16em] text-brandLight">
              Platform
            </h3>
            <ul className="mt-5 space-y-2">
              {mainLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-sm text-bgSoft/75 transition hover:text-secondary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <a
              href="mailto:info@engineersclinic.com"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-2xl bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20 hover:text-secondary"
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-center text-sm text-bgSoft/65 md:flex-row md:text-left">
          <p className="text-white">
            &copy; {new Date().getFullYear()} Engineers Clinic. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="transition hover:text-secondary">
              Privacy
            </a>
            <a href="#refund" className="transition hover:text-secondary">
              Refund Policy
            </a>
          </div>
        </div>

        <p className="mt-5 text-center text-sm text-white">
          Designed and Developed By{" "}
          <a
            href="https://filliptechnologies.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline decoration-brandLight underline-offset-4 hover:text-secondary"
          >
            Fillip Technologies
          </a>
        </p>
      </div>
    </footer>
  );
};
