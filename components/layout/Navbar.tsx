"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MegaMenu } from "./MegaMenu";
import { ChevronDown, Gift, Menu, X, LayoutGrid, Megaphone, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  onOpenEnquiry?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEnquiry }) => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [enterpriseOpen, setEnterpriseOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const [mobileInternshipOpen, setMobileInternshipOpen] = useState(false);
  const [mobileEnterpriseOpen, setMobileEnterpriseOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-borderLight/70 bg-white/60 backdrop-blur-2xl transition-all duration-300">
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
          <Link href="/college-tieup" className="nav-link">
            College Tie-ups
          </Link>

          {/* For Enterprises & Employers */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setEnterpriseOpen(!enterpriseOpen);
                setMoreOpen(false);
              }}
              className={`nav-link cursor-pointer ${enterpriseOpen ? "nav-link-active" : ""}`}
            >
              <span>For Enterprises & Employers</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  enterpriseOpen ? "rotate-180 text-white" : "text-current"
                }`}
              />
            </button>

            {enterpriseOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setEnterpriseOpen(false)} />
                <div className="dropdown-panel absolute left-0 top-full z-50 mt-3 w-[340px] p-3 shadow-2xl">
                  <Link
                    href="/company-branding"
                    onClick={() => setEnterpriseOpen(false)}
                    className="group flex items-start gap-4 rounded-[14px] p-4 transition hover:bg-bgSoft"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-brand text-white shadow-sm">
                      <LayoutGrid className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-textPrimary">
                        Company For Branding
                      </span>
                      <span className="mt-1 block text-caption">
                        Promote your brand among students and colleges through campaigns.
                      </span>
                    </span>
                  </Link>

                  <a
                    href="#college-tieup"
                    onClick={() => setEnterpriseOpen(false)}
                    className="group mt-2 flex items-start gap-4 rounded-[14px] p-4 transition hover:bg-bgSoft"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-brand/15 text-brand">
                      <Megaphone className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-textPrimary">
                        For Selling Services & Products
                      </span>
                      <span className="mt-1 block text-caption">
                        Reach verified students, colleges, and young professionals.
                      </span>
                    </span>
                  </a>
                </div>
              </>
            )}
          </div>

          {/* More Menu Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setMoreOpen(!moreOpen);
                setEnterpriseOpen(false);
              }}
              className={`nav-link cursor-pointer ${moreOpen ? "nav-link-active" : ""}`}
            >
              <span>More</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  moreOpen ? "rotate-180 text-white" : "text-current"
                }`}
              />
            </button>

            {moreOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                <div className="dropdown-panel absolute right-0 top-full z-50 mt-3 w-[260px] p-3 shadow-2xl">
                  <a
                    href="#how-it-works"
                    onClick={() => setMoreOpen(false)}
                    className="block rounded-[14px] px-4 py-3 text-sm font-semibold text-textSecondary transition hover:bg-bgSoft hover:text-brand"
                  >
                    AI Tools
                  </a>
                  <Link
                    href="/about"
                    onClick={() => setMoreOpen(false)}
                    className="mt-1 block rounded-[14px] px-4 py-3 text-sm font-semibold text-textSecondary transition hover:bg-bgSoft hover:text-brand"
                  >
                    About Us
                  </Link>
                </div>
              </>
            )}
          </div>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">

          {/* User Profile Dropdown or Login Button */}
          {user ? (
            <div className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-borderLight bg-white hover:bg-bgSoft transition-all cursor-pointer"
                title={user.email}
              >
                <div className="flex h-full w-full items-center justify-center rounded-full bg-brand/10 text-brand font-black text-xl">
                  {user.email?.[0].toUpperCase() || "U"}
                </div>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-[20px] border border-borderLight bg-white p-2 shadow-lg z-50">
                  <Link
                    href={
                      user.role === 'college'
                        ? '/college'
                        : user.role === 'admin' || user.role === 'super_admin'
                        ? '/admin'
                        : '/student'
                    }
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-textPrimary hover:bg-bgSoft hover:text-brand transition-all text-left"
                  >
                    <User className="h-4 w-4" />
                    <span>Go to Dashboard</span>
                  </Link>

                  <Link
                    href={
                      user.role === 'college'
                        ? '/college?tab=profile'
                        : user.role === 'admin' || user.role === 'super_admin'
                        ? '/admin?tab=profile'
                        : '/student?tab=profile'
                    }
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-textPrimary hover:bg-bgSoft hover:text-brand transition-all text-left"
                  >
                    <User className="h-4 w-4 text-brand" />
                    <span>My Profile</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-danger hover:bg-dangerLight transition-all text-left cursor-pointer border-t border-borderLight mt-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="btn-primary hidden lg:inline-flex"
            >
              Login
            </Link>
          )}

          {/* Mobile Drawer Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="grid h-11 w-11 place-items-center rounded-[14px] border border-borderLight bg-white text-textPrimary shadow-sm lg:hidden cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-borderLight bg-white lg:hidden">
          <nav className="container-main space-y-2 py-5">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block rounded-[14px] bg-brand px-5 py-4 text-sm font-bold text-white"
            >
              Home
            </Link>

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenEnquiry?.();
              }}
              className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-[14px] border border-secondary/50 bg-secondarySoft px-5 py-4 text-sm font-black text-textPrimary shadow-sm cursor-pointer"
            >
              <Gift className="relative text-brand h-4 w-4" />
              <span className="relative">Refer & Earn</span>
            </button>

            {/* Mobile Internships Accordion */}
            <div className="rounded-[14px] border border-borderLight bg-white">
              <button
                type="button"
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-bold text-textPrimary"
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
                <div className="border-t border-borderLight p-4">
                  <MegaMenu mobile onSelect={() => setMobileOpen(false)} />
                </div>
              )}
            </div>

            <a
              href="#college-tieup"
              onClick={() => setMobileOpen(false)}
              className="block rounded-[14px] px-5 py-4 text-sm font-bold text-textSecondary transition hover:bg-bgSoft hover:text-brand"
            >
              College Tie-ups
            </a>

            {/* Mobile Enterprise Accordion */}
            <div className="rounded-[14px] border border-borderLight bg-white">
              <button
                type="button"
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-bold text-textPrimary"
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
                <div className="space-y-2 border-t border-borderLight p-4">
                  <a
                    href="#college-tieup"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-[14px] bg-bgSoft px-4 py-3 text-sm font-semibold text-textPrimary"
                  >
                    Company For Branding
                  </a>
                  <a
                    href="#college-tieup"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-[14px] bg-bgSoft px-4 py-3 text-sm font-semibold text-textPrimary"
                  >
                    For Selling Services & Products
                  </a>
                </div>
              )}
            </div>

            {/* Mobile More Accordion */}
            <div className="rounded-[14px] border border-borderLight bg-white">
              <button
                type="button"
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-bold text-textPrimary"
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
                <div className="space-y-2 border-t border-borderLight p-4">
                  <a
                    href="#how-it-works"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-[14px] bg-bgSoft px-4 py-3 text-sm font-semibold text-textPrimary"
                  >
                    AI Tools
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      onOpenEnquiry?.();
                    }}
                    className="w-full text-left block rounded-[14px] bg-bgSoft px-4 py-3 text-sm font-semibold text-textPrimary"
                  >
                    Refer & Earn
                  </button>
                  <a
                    href="#faq"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-[14px] bg-bgSoft px-4 py-3 text-sm font-semibold text-textPrimary"
                  >
                    Blog
                  </a>
                  <a
                    href="#about"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-[14px] bg-bgSoft px-4 py-3 text-sm font-semibold text-textPrimary"
                  >
                    About Us
                  </a>
                </div>
              )}
            </div>

            {user ? (
              <div className="space-y-2">
                <Link
                  href="/student"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full rounded-[14px] bg-brand px-5 py-4 text-center text-sm font-bold text-white cursor-pointer"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="block w-full rounded-[14px] bg-rose-600 px-5 py-4 text-center text-sm font-bold text-white cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block w-full rounded-[14px] bg-brand px-5 py-4 text-center text-sm font-bold text-white cursor-pointer"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
