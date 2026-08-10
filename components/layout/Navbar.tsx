"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MegaMenu } from "./MegaMenu";
import { ChevronDown, Gift, Menu, X, LayoutGrid, Megaphone } from "lucide-react";

interface NavbarProps {
  onOpenEnquiry?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEnquiry }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [enterpriseOpen, setEnterpriseOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const [mobileInternshipOpen, setMobileInternshipOpen] = useState(false);
  const [mobileEnterpriseOpen, setMobileEnterpriseOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E2D9FF]/70 bg-white/60 backdrop-blur-2xl transition-all duration-300">
      <div className="container-main flex items-center justify-between py-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3" aria-label="Engineers Clinic home">
          <Image
            src="/images/Engineers-clinic-logo-black.png"
            alt="Engineers Clinic"
            width={190}
            height={48}
            priority
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation Shell */}
        <nav className="nav-shell hidden items-center gap-1 p-2 lg:flex">
          <Link href="/" className="nav-link nav-link-active">
            Home
          </Link>

          {/* Internships Mega Menu */}
          <MegaMenu />

          {/* College Tie-ups */}
          <a href="#college-tieup" className="nav-link">
            College Tie-ups
          </a>

          {/* For Enterprises & Employers */}
          <div
            className="relative"
            onMouseEnter={() => setEnterpriseOpen(true)}
            onMouseLeave={() => setEnterpriseOpen(false)}
          >
            <button type="button" className="nav-link cursor-pointer">
              For Enterprises & Employers
              <ChevronDown
                className={`h-4 w-4 transition duration-200 ${
                  enterpriseOpen ? "rotate-180 text-[#7C5CFC]" : ""
                }`}
              />
            </button>

            {enterpriseOpen && (
              <div className="dropdown-panel absolute left-0 top-full mt-3 w-[340px] p-3 shadow-2xl">
                <a
                  href="#college-tieup"
                  onClick={() => setEnterpriseOpen(false)}
                  className="group flex items-start gap-4 rounded-[14px] p-4 transition hover:bg-[#EEF5FF]"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-[#7C5CFC] text-white shadow-sm">
                    <LayoutGrid className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-[#160840]">
                      Company For Branding
                    </span>
                    <span className="mt-1 block text-caption">
                      Promote your brand among students and colleges through campaigns.
                    </span>
                  </span>
                </a>

                <a
                  href="#college-tieup"
                  onClick={() => setEnterpriseOpen(false)}
                  className="group mt-2 flex items-start gap-4 rounded-[14px] p-4 transition hover:bg-[#EEF5FF]"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-[#7C5CFC]/15 text-[#7C5CFC]">
                    <Megaphone className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-[#160840]">
                      For Selling Services & Products
                    </span>
                    <span className="mt-1 block text-caption">
                      Reach verified students, colleges, and young professionals.
                    </span>
                  </span>
                </a>
              </div>
            )}
          </div>

          {/* More Menu Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <button type="button" className="nav-link cursor-pointer">
              More
              <ChevronDown
                className={`h-4 w-4 transition duration-200 ${
                  moreOpen ? "rotate-180 text-[#7C5CFC]" : ""
                }`}
              />
            </button>

            {moreOpen && (
              <div className="dropdown-panel absolute right-0 top-full mt-3 w-[260px] p-3 shadow-2xl">
                <a
                  href="#how-it-works"
                  onClick={() => setMoreOpen(false)}
                  className="block rounded-[14px] px-4 py-3 text-sm font-semibold text-[#3D2090] transition hover:bg-[#EEF5FF] hover:text-[#7C5CFC]"
                >
                  AI Tools
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMoreOpen(false);
                    onOpenEnquiry?.();
                  }}
                  className="mt-1 w-full text-left block rounded-[14px] px-4 py-3 text-sm font-semibold text-[#3D2090] transition hover:bg-[#EEF5FF] hover:text-[#7C5CFC] cursor-pointer"
                >
                  Refer & Earn
                </button>
                <a
                  href="#faq"
                  onClick={() => setMoreOpen(false)}
                  className="mt-1 block rounded-[14px] px-4 py-3 text-sm font-semibold text-[#3D2090] transition hover:bg-[#EEF5FF] hover:text-[#7C5CFC]"
                >
                  Blog
                </a>
                <a
                  href="#about"
                  onClick={() => setMoreOpen(false)}
                  className="mt-1 block rounded-[14px] px-4 py-3 text-sm font-semibold text-[#3D2090] transition hover:bg-[#EEF5FF] hover:text-[#7C5CFC]"
                >
                  About Us
                </a>
              </div>
            )}
          </div>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {/* Refer & Earn Button */}
          <button
            type="button"
            onClick={onOpenEnquiry}
            className="group relative hidden items-center gap-2 overflow-hidden rounded-full border border-[#F5C842]/50 bg-[#F5C842]/18 px-4 py-2.5 text-sm font-black text-[#160840] shadow-[0_10px_28px_rgba(245,200,66,0.22)] transition hover:-translate-y-0.5 hover:border-[#F5C842] hover:bg-[#F5C842] lg:inline-flex cursor-pointer"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-[#F5C842]/25 opacity-40" />
            <span className="relative grid h-5 w-5 place-items-center rounded-full bg-white text-[#7C5CFC] shadow-sm">
              <Gift className="h-3.5 w-3.5" />
            </span>
            <span className="relative">Refer & Earn</span>
          </button>

          {/* Login Button */}
          <button
            type="button"
            onClick={onOpenEnquiry}
            className="btn-primary hidden lg:inline-flex"
          >
            Login
          </button>

          {/* Mobile Drawer Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="grid h-11 w-11 place-items-center rounded-[14px] border border-[#E2D9FF] bg-white text-[#160840] shadow-sm lg:hidden cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-[#E2D9FF] bg-white lg:hidden">
          <nav className="container-main space-y-2 py-5">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block rounded-[14px] bg-[#7C5CFC] px-5 py-4 text-sm font-bold text-white"
            >
              Home
            </Link>

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenEnquiry?.();
              }}
              className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-[14px] border border-[#F5C842]/50 bg-[#F5C842]/18 px-5 py-4 text-sm font-black text-[#160840] shadow-sm cursor-pointer"
            >
              <Gift className="relative text-[#7C5CFC] h-4 w-4" />
              <span className="relative">Refer & Earn</span>
            </button>

            {/* Mobile Internships Accordion */}
            <div className="rounded-[14px] border border-[#E2D9FF] bg-white">
              <button
                type="button"
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-bold text-[#160840]"
                onClick={() => setMobileInternshipOpen(!mobileInternshipOpen)}
              >
                <span>Internships</span>
                <ChevronDown
                  className={`h-4 w-4 transition ${
                    mobileInternshipOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {mobileInternshipOpen && (
                <div className="border-t border-[#E2D9FF] p-4">
                  <MegaMenu mobile onSelect={() => setMobileOpen(false)} />
                </div>
              )}
            </div>

            <a
              href="#college-tieup"
              onClick={() => setMobileOpen(false)}
              className="block rounded-[14px] px-5 py-4 text-sm font-bold text-[#3D2090] transition hover:bg-[#EEF5FF] hover:text-[#7C5CFC]"
            >
              College Tie-ups
            </a>

            {/* Mobile Enterprise Accordion */}
            <div className="rounded-[14px] border border-[#E2D9FF] bg-white">
              <button
                type="button"
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-bold text-[#160840]"
                onClick={() => setMobileEnterpriseOpen(!mobileEnterpriseOpen)}
              >
                <span>For Enterprises & Employers</span>
                <ChevronDown
                  className={`h-4 w-4 transition ${
                    mobileEnterpriseOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {mobileEnterpriseOpen && (
                <div className="space-y-2 border-t border-[#E2D9FF] p-4">
                  <a
                    href="#college-tieup"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-[14px] bg-[#EEF5FF] px-4 py-3 text-sm font-semibold text-[#160840]"
                  >
                    Company For Branding
                  </a>
                  <a
                    href="#college-tieup"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-[14px] bg-[#EEF5FF] px-4 py-3 text-sm font-semibold text-[#160840]"
                  >
                    For Selling Services & Products
                  </a>
                </div>
              )}
            </div>

            {/* Mobile More Accordion */}
            <div className="rounded-[14px] border border-[#E2D9FF] bg-white">
              <button
                type="button"
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-bold text-[#160840]"
                onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
              >
                <span>More</span>
                <ChevronDown
                  className={`h-4 w-4 transition ${
                    mobileMoreOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {mobileMoreOpen && (
                <div className="space-y-2 border-t border-[#E2D9FF] p-4">
                  <a
                    href="#how-it-works"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-[14px] bg-[#EEF5FF] px-4 py-3 text-sm font-semibold text-[#160840]"
                  >
                    AI Tools
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      onOpenEnquiry?.();
                    }}
                    className="w-full text-left block rounded-[14px] bg-[#EEF5FF] px-4 py-3 text-sm font-semibold text-[#160840]"
                  >
                    Refer & Earn
                  </button>
                  <a
                    href="#faq"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-[14px] bg-[#EEF5FF] px-4 py-3 text-sm font-semibold text-[#160840]"
                  >
                    Blog
                  </a>
                  <a
                    href="#about"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-[14px] bg-[#EEF5FF] px-4 py-3 text-sm font-semibold text-[#160840]"
                  >
                    About Us
                  </a>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenEnquiry?.();
              }}
              className="block w-full rounded-[14px] bg-[#7C5CFC] px-5 py-4 text-center text-sm font-bold text-white cursor-pointer"
            >
              Login
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
