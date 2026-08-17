"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Building, Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { registerStudent, registerCollege } from "@/lib/api/auth";
import { showToast } from "@/lib/toast";

interface SignupFormProps {
  initialRole?: "student" | "college";
}

export const SignupForm: React.FC<SignupFormProps> = ({ initialRole = "student" }) => {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "college">(initialRole);

  const handleRoleSwitch = (newRole: "student" | "college") => {
    setRole(newRole);
    router.replace(`/signup?role=${newRole}`, { scroll: false });
  };

  // Student Fields
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentCollege, setStudentCollege] = useState("");
  const [studentCollegeOther, setStudentCollegeOther] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentConfirmPassword, setStudentConfirmPassword] = useState("");

  // College Fields
  const [collegeName, setCollegeName] = useState("");
  const [collegeEmail, setCollegeEmail] = useState("");
  const [collegePhone, setCollegePhone] = useState("");
  const [collegeAddress, setCollegeAddress] = useState("");
  const [collegePassword, setCollegePassword] = useState("");
  const [collegeConfirmPassword, setCollegeConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const collegeOptions = [
    { value: "vit", label: "Vellore Institute of Technology (VIT)" },
    { value: "srm", label: "SRM Institute of Science and Technology" },
    { value: "sastra", label: "SASTRA Deemed University" },
    { value: "manipal", label: "Manipal Academy of Higher Education" },
    { value: "iitk", label: "Indian Institute of Technology Kanpur" },
    { value: "iitb", label: "Indian Institute of Technology Bombay" },
    { value: "dtu", label: "Delhi Technological University" },
    { value: "amity", label: "Amity University" },
    { value: "other", label: "Other (Enter custom college name)" },
  ];

  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (role === "student") {
        if (studentPassword !== studentConfirmPassword) {
          throw new Error("Passwords do not match");
        }

        const collegeName =
          studentCollege === "other"
            ? studentCollegeOther
            : collegeOptions.find((c) => c.value === studentCollege)?.label || studentCollege;

        const data = await registerStudent({
          name: studentName,
          email: studentEmail,
          password: studentPassword,
          college_name: collegeName,
        });

        if (data.accessToken) {
          localStorage.setItem("token", data.accessToken);
          if (data.refreshToken) {
            localStorage.setItem("refreshToken", data.refreshToken);
          }
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        setLoading(false);
        setSuccess(true);
        showToast.success("Student account created successfully! Welcome to Engineers Clinic.", "Registration Complete");
      } else {
        if (collegePassword !== collegeConfirmPassword) {
          throw new Error("Passwords do not match");
        }

        const data = await registerCollege({
          email: collegeEmail,
          password: collegePassword,
          phoneNo: collegePhone || "N/A",
          countryId: 1, // Defaulting to India
          collegeName: collegeName,
          address: collegeAddress || "Campus Address",
        });

        setLoading(false);
        setSuccess(true);
        showToast.success("College registration submitted! An administrator will review your account.", "Registration Submitted");
      }
    } catch (err: any) {
      setLoading(false);
      const msg = err.message || "An error occurred during registration";
      setErrorMsg(msg);
      showToast.error(msg, "Registration Failed");
    }
  };

  return (
    <div className="w-full">
      <div className="rounded-[2rem] border border-borderLight bg-white/40 p-4 shadow-2xl backdrop-blur-2xl">
        <div className="rounded-[1.75rem] border border-white/80 bg-white/95 p-6 sm:p-8 shadow-xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-borderLight pb-6">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand">
                {role === "student" ? "Student" : "College Partner"} Registration
              </p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-textPrimary">
                Create your account
              </h2>
            </div>

            {/* Role Toggle Switch */}
            <div className="inline-flex rounded-full bg-bgSoft p-1 border border-borderLight">
              <button
                type="button"
                onClick={() => handleRoleSwitch("student")}
                className={`rounded-full px-4 py-2 text-xs font-black transition cursor-pointer ${
                  role === "student"
                    ? "bg-brand text-white shadow-md"
                    : "text-textSecondary hover:text-brand"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleRoleSwitch("college")}
                className={`rounded-full px-4 py-2 text-xs font-black transition cursor-pointer ${
                  role === "college"
                    ? "bg-brand text-white shadow-md"
                    : "text-textSecondary hover:text-brand"
                }`}
              >
                College
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mt-4 rounded-2xl border border-dangerBorder bg-dangerLight p-4 text-sm font-bold text-dangerDark">
              {errorMsg}
            </div>
          )}

          {success ? (
            <div className="my-8 rounded-2xl border border-successBorder bg-successLight p-6 text-center text-successDark">
              <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
              <h3 className="mt-3 text-lg font-extrabold">
                {role === "college" ? "Registration Completed!" : "Account Created Successfully!"}
              </h3>
              <p className="mt-2 text-sm text-successDark font-medium">
                {role === "college"
                  ? "Your registration is submitted and is currently pending admin vetting. Please wait for admin approval before logging in."
                  : "Welcome to Engineers Clinic. Please log in to access your portal."}
              </p>
              <Link
                href="/login"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-brandHover"
              >
                Go to Login <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {role === "student" ? (
                /* STUDENT FORM FIELDS */
                <>
                  {/* Full Name */}
                  <div>
                    <label className="text-sm font-bold text-textPrimary">Full Name</label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted" />
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full rounded-2xl border border-borderLight bg-bgSoft/50 pl-11 pr-4 py-3 text-sm text-textPrimary outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-sm font-bold text-textPrimary">Student Email</label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted" />
                      <input
                        type="email"
                        required
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="Enter your student email"
                        className="w-full rounded-2xl border border-borderLight bg-bgSoft/50 pl-11 pr-4 py-3 text-sm text-textPrimary outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15"
                      />
                    </div>
                  </div>

                  {/* College Select */}
                  <div>
                    <label className="text-sm font-bold text-textPrimary">College Name</label>
                    <div className="relative mt-1.5">
                      <Building className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted" />
                      <select
                        required
                        value={studentCollege}
                        onChange={(e) => setStudentCollege(e.target.value)}
                        className="w-full appearance-none rounded-2xl border border-borderLight bg-bgSoft/50 pl-11 pr-4 py-3 text-sm text-textPrimary outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15 cursor-pointer"
                      >
                        <option value="">Select your college</option>
                        {collegeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Custom College Name if 'other' is selected */}
                  {studentCollege === "other" && (
                    <div>
                      <label className="text-sm font-bold text-brand">
                        Enter Your Custom College Name
                      </label>
                      <input
                        type="text"
                        required
                        value={studentCollegeOther}
                        onChange={(e) => setStudentCollegeOther(e.target.value)}
                        placeholder="e.g. ABC Institute of Technology"
                        className="mt-1.5 w-full rounded-2xl border border-brand bg-white px-4 py-3 text-sm text-textPrimary outline-none transition focus:ring-4 focus:ring-brand/15"
                      />
                    </div>
                  )}

                  {/* Password Grid */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-bold text-textPrimary">Password</label>
                      <div className="relative mt-1.5">
                        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted" />
                        <input
                          type="password"
                          required
                          value={studentPassword}
                          onChange={(e) => setStudentPassword(e.target.value)}
                          placeholder="Create a password"
                          className="w-full rounded-2xl border border-borderLight bg-bgSoft/50 pl-11 pr-4 py-3 text-sm text-textPrimary outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-textPrimary">Confirm Password</label>
                      <div className="relative mt-1.5">
                        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted" />
                        <input
                          type="password"
                          required
                          value={studentConfirmPassword}
                          onChange={(e) => setStudentConfirmPassword(e.target.value)}
                          placeholder="Confirm password"
                          className="w-full rounded-2xl border border-borderLight bg-bgSoft/50 pl-11 pr-4 py-3 text-sm text-textPrimary outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-bold text-textPrimary">College / Institution Name *</label>
                    <input
                      type="text"
                      required
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      placeholder="e.g. Vellore Institute of Technology"
                      className="mt-1.5 w-full rounded-2xl border border-borderLight bg-bgSoft/50 px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-bold text-textPrimary">Official TPO / Coordinator Email *</label>
                      <input
                        type="email"
                        required
                        value={collegeEmail}
                        onChange={(e) => setCollegeEmail(e.target.value)}
                        placeholder="e.g. coordinator@vit.ac.in"
                        className="mt-1.5 w-full rounded-2xl border border-borderLight bg-bgSoft/50 px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-textPrimary">Contact Phone Number *</label>
                      <input
                        type="text"
                        required
                        value={collegePhone}
                        onChange={(e) => setCollegePhone(e.target.value)}
                        placeholder="e.g. +91 9876543210"
                        className="mt-1.5 w-full rounded-2xl border border-borderLight bg-bgSoft/50 px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-textPrimary">Physical Campus Address *</label>
                    <input
                      type="text"
                      required
                      value={collegeAddress}
                      onChange={(e) => setCollegeAddress(e.target.value)}
                      placeholder="e.g. Katpadi, Vellore, Tamil Nadu 632014"
                      className="mt-1.5 w-full rounded-2xl border border-borderLight bg-bgSoft/50 px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15"
                    />
                  </div>

                  {/* Password Grid */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-bold text-textPrimary">Password *</label>
                      <input
                        type="password"
                        required
                        value={collegePassword}
                        onChange={(e) => setCollegePassword(e.target.value)}
                        placeholder="Create a secure password"
                        className="mt-1.5 w-full rounded-2xl border border-borderLight bg-bgSoft/50 px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-textPrimary">Confirm Password *</label>
                      <input
                        type="password"
                        required
                        value={collegeConfirmPassword}
                        onChange={(e) => setCollegeConfirmPassword(e.target.value)}
                        placeholder="Confirm secure password"
                        className="mt-1.5 w-full rounded-2xl border border-borderLight bg-bgSoft/50 px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-secondary px-5 py-4 text-sm font-black text-white shadow-lg transition hover:scale-[1.01] cursor-pointer disabled:opacity-70"
              >
                <span>
                  {loading
                    ? "Creating Account..."
                    : `Sign up as ${role === "student" ? "Student" : "College"}`}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="mt-4 text-center">
                <p className="text-sm text-textGray">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-extrabold text-brand transition hover:text-textPrimary"
                  >
                    Log in here
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
