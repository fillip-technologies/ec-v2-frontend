"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { BACKEND_URL } from "@/config/api";

export const LoginForm: React.FC = () => {
  const [activeRole, setActiveRole] = useState<"student" | "college" | "admin">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const roles = {
    student: {
      label: "Student",
      signupLabel: "Sign up as Student",
      signupUrl: "/signup?role=student",
    },
    college: {
      label: "College",
      signupLabel: "Sign up as College",
      signupUrl: "/signup?role=college",
    },
    admin: {
      label: "Admin",
      signupLabel: null,
      signupUrl: null,
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          role: activeRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      // Store JWT Tokens in localStorage
      if (data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setLoading(false);
      const rawRole = data.user?.role?.name || data.user?.role || "";
      const userRole = typeof rawRole === "string" ? rawRole.toLowerCase() : "";

      if (userRole === "super_admin" || userRole === "admin") {
        window.location.href = "/admin";
      } else if (userRole === "college") {
        window.location.href = "/college";
      } else {
        window.location.href = "/student";
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err.message || "Something went wrong during login");
    }
  };

  return (
    <div className="w-full">
      <div className="rounded-[2rem] border border-white/50 bg-white/25 p-4 shadow-2xl shadow-brand/10 backdrop-blur-2xl">
        <div className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
          {/* Header */}
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-brand">
              Secure Portal
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-textPrimary">
              Login
            </h2>
            <p className="mt-2 text-sm leading-6 text-textGray">
              Access your Engineers Clinic portal
            </p>
          </div>

          {errorMessage && (
            <div className="mt-6 rounded-2xl border border-dangerBorder bg-dangerLight px-4 py-3 text-sm text-dangerDark font-medium">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email Field */}
            <div>
              <label className="text-sm font-bold text-textPrimary">Email Address</label>
              <div className="relative mt-2">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full rounded-2xl border border-borderLight bg-surface pl-11 pr-4 py-3.5 text-sm text-textPrimary outline-none transition placeholder:text-textMuted focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-sm font-bold text-textPrimary">Password</label>
              <div className="relative mt-2">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-borderLight bg-surface pl-11 pr-4 py-3.5 text-sm text-textPrimary outline-none transition placeholder:text-textMuted focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-brandLight px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-brand/25 transition hover:scale-[1.01] cursor-pointer disabled:opacity-70"
            >
              <span>{loading ? "Signing in..." : `Login as ${roles[activeRole].label}`}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Role Switcher */}
            <div className="mt-6 text-center">
              <p className="text-sm font-bold text-textGray">Login as:</p>
              <div className="mt-3 flex flex-wrap justify-center gap-3">
                {(["student", "college", "admin"] as const).map((roleKey) => (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => setActiveRole(roleKey)}
                    className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-xs font-black transition cursor-pointer ${
                      activeRole === roleKey
                        ? "border-transparent bg-gradient-to-r from-brand to-brandLight text-white shadow-lg shadow-brand/20"
                        : "border-borderLight bg-white text-textGray hover:border-brand/40 hover:bg-brand/5 hover:text-textPrimary"
                    }`}
                  >
                    {roles[roleKey].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Signup Link */}
            {roles[activeRole].signupUrl && (
              <div className="mt-4 text-center">
                <p className="text-sm text-textGray">
                  New here?{" "}
                  <Link
                    href={roles[activeRole].signupUrl!}
                    className="font-extrabold text-brand transition hover:text-textPrimary"
                  >
                    {roles[activeRole].signupLabel}
                  </Link>
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
