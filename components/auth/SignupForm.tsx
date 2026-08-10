"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Building, Lock, CheckCircle2, ArrowRight } from "lucide-react";

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
  const [collegeContact, setCollegeContact] = useState("");
  const [studentsBeginner, setStudentsBeginner] = useState<number>(0);
  const [studentsIntermediate, setStudentsIntermediate] = useState<number>(0);
  const [studentsAdvanced, setStudentsAdvanced] = useState<number>(0);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <div className="w-full">
      <div className="rounded-[2rem] border border-[#E2D9FF] bg-white/40 p-4 shadow-2xl backdrop-blur-2xl">
        <div className="rounded-[1.75rem] border border-white/80 bg-white/95 p-6 sm:p-8 shadow-xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2D9FF] pb-6">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7C5CFC]">
                {role === "student" ? "Student" : "College Partner"} Registration
              </p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#160840]">
                Create your account
              </h2>
            </div>

            {/* Role Toggle Switch */}
            <div className="inline-flex rounded-full bg-[#EEF5FF] p-1 border border-[#E2D9FF]">
              <button
                type="button"
                onClick={() => handleRoleSwitch("student")}
                className={`rounded-full px-4 py-2 text-xs font-black transition cursor-pointer ${
                  role === "student"
                    ? "bg-[#7C5CFC] text-white shadow-md"
                    : "text-[#3D2090] hover:text-[#7C5CFC]"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleRoleSwitch("college")}
                className={`rounded-full px-4 py-2 text-xs font-black transition cursor-pointer ${
                  role === "college"
                    ? "bg-[#7C5CFC] text-white shadow-md"
                    : "text-[#3D2090] hover:text-[#7C5CFC]"
                }`}
              >
                College
              </button>
            </div>
          </div>

          {success ? (
            <div className="my-8 rounded-2xl border border-green-200 bg-green-50 p-6 text-center text-green-800">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
              <h3 className="mt-3 text-lg font-extrabold">Account Created Successfully!</h3>
              <p className="mt-2 text-sm text-green-700">
                Welcome to Engineers Clinic. Please log in to access your portal.
              </p>
              <Link
                href="/login"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#7C5CFC] px-6 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-[#6a49f3]"
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
                    <label className="text-sm font-bold text-[#160840]">Full Name</label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B7FBF]" />
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full rounded-2xl border border-[#E2D9FF] bg-[#EEF5FF]/50 pl-11 pr-4 py-3 text-sm text-[#160840] outline-none transition focus:border-[#7C5CFC] focus:bg-white focus:ring-4 focus:ring-[#7C5CFC]/15"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-sm font-bold text-[#160840]">Student Email</label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B7FBF]" />
                      <input
                        type="email"
                        required
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="Enter your student email"
                        className="w-full rounded-2xl border border-[#E2D9FF] bg-[#EEF5FF]/50 pl-11 pr-4 py-3 text-sm text-[#160840] outline-none transition focus:border-[#7C5CFC] focus:bg-white focus:ring-4 focus:ring-[#7C5CFC]/15"
                      />
                    </div>
                  </div>

                  {/* College Select */}
                  <div>
                    <label className="text-sm font-bold text-[#160840]">College Name</label>
                    <div className="relative mt-1.5">
                      <Building className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B7FBF]" />
                      <select
                        required
                        value={studentCollege}
                        onChange={(e) => setStudentCollege(e.target.value)}
                        className="w-full appearance-none rounded-2xl border border-[#E2D9FF] bg-[#EEF5FF]/50 pl-11 pr-4 py-3 text-sm text-[#160840] outline-none transition focus:border-[#7C5CFC] focus:bg-white focus:ring-4 focus:ring-[#7C5CFC]/15 cursor-pointer"
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
                      <label className="text-sm font-bold text-[#7C5CFC]">
                        Enter Your Custom College Name
                      </label>
                      <input
                        type="text"
                        required
                        value={studentCollegeOther}
                        onChange={(e) => setStudentCollegeOther(e.target.value)}
                        placeholder="e.g. ABC Institute of Technology"
                        className="mt-1.5 w-full rounded-2xl border border-[#7C5CFC] bg-white px-4 py-3 text-sm text-[#160840] outline-none transition focus:ring-4 focus:ring-[#7C5CFC]/15"
                      />
                    </div>
                  )}

                  {/* Password Grid */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-bold text-[#160840]">Password</label>
                      <div className="relative mt-1.5">
                        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B7FBF]" />
                        <input
                          type="password"
                          required
                          value={studentPassword}
                          onChange={(e) => setStudentPassword(e.target.value)}
                          placeholder="Create a password"
                          className="w-full rounded-2xl border border-[#E2D9FF] bg-[#EEF5FF]/50 pl-11 pr-4 py-3 text-sm text-[#160840] outline-none transition focus:border-[#7C5CFC] focus:bg-white focus:ring-4 focus:ring-[#7C5CFC]/15"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-[#160840]">Confirm Password</label>
                      <div className="relative mt-1.5">
                        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B7FBF]" />
                        <input
                          type="password"
                          required
                          value={studentConfirmPassword}
                          onChange={(e) => setStudentConfirmPassword(e.target.value)}
                          placeholder="Confirm password"
                          className="w-full rounded-2xl border border-[#E2D9FF] bg-[#EEF5FF]/50 pl-11 pr-4 py-3 text-sm text-[#160840] outline-none transition focus:border-[#7C5CFC] focus:bg-white focus:ring-4 focus:ring-[#7C5CFC]/15"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* COLLEGE FORM FIELDS */
                <>
                  <div>
                    <label className="text-sm font-bold text-[#160840]">College Name</label>
                    <input
                      type="text"
                      required
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      placeholder="Enter institution full name"
                      className="mt-1.5 w-full rounded-2xl border border-[#E2D9FF] bg-[#EEF5FF]/50 px-4 py-3 text-sm text-[#160840] outline-none transition focus:border-[#7C5CFC] focus:bg-white focus:ring-4 focus:ring-[#7C5CFC]/15"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-bold text-[#160840]">Official Email</label>
                      <input
                        type="email"
                        required
                        value={collegeEmail}
                        onChange={(e) => setCollegeEmail(e.target.value)}
                        placeholder="e.g. tpo@university.edu.in"
                        className="mt-1.5 w-full rounded-2xl border border-[#E2D9FF] bg-[#EEF5FF]/50 px-4 py-3 text-sm text-[#160840] outline-none transition focus:border-[#7C5CFC] focus:bg-white focus:ring-4 focus:ring-[#7C5CFC]/15"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-[#160840]">Contact Person</label>
                      <input
                        type="text"
                        required
                        value={collegeContact}
                        onChange={(e) => setCollegeContact(e.target.value)}
                        placeholder="Coordinator / TPO Name"
                        className="mt-1.5 w-full rounded-2xl border border-[#E2D9FF] bg-[#EEF5FF]/50 px-4 py-3 text-sm text-[#160840] outline-none transition focus:border-[#7C5CFC] focus:bg-white focus:ring-4 focus:ring-[#7C5CFC]/15"
                      />
                    </div>
                  </div>

                  {/* Level-Wise Student Count Group */}
                  <div className="rounded-2xl border border-[#E2D9FF] bg-[#EEF5FF]/40 p-4">
                    <p className="text-sm font-bold text-[#160840]">
                      Number of Students (Level-wise)
                    </p>
                    <p className="text-xs text-[#8B7FBF]">
                      How many students do you plan to enroll at each level?
                    </p>
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      <div>
                        <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-[#160840]">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Beginner
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={studentsBeginner}
                          onChange={(e) => setStudentsBeginner(Number(e.target.value))}
                          className="w-full rounded-xl border border-[#E2D9FF] bg-white px-3 py-2 text-sm font-extrabold text-[#160840] outline-none focus:border-[#7C5CFC]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-[#160840]">
                          <span className="h-2 w-2 rounded-full bg-blue-500" /> Intermediate
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={studentsIntermediate}
                          onChange={(e) => setStudentsIntermediate(Number(e.target.value))}
                          className="w-full rounded-xl border border-[#E2D9FF] bg-white px-3 py-2 text-sm font-extrabold text-[#160840] outline-none focus:border-[#7C5CFC]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-[#160840]">
                          <span className="h-2 w-2 rounded-full bg-violet-500" /> Advanced
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={studentsAdvanced}
                          onChange={(e) => setStudentsAdvanced(Number(e.target.value))}
                          className="w-full rounded-xl border border-[#E2D9FF] bg-white px-3 py-2 text-sm font-extrabold text-[#160840] outline-none focus:border-[#7C5CFC]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password Grid */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-bold text-[#160840]">Password</label>
                      <input
                        type="password"
                        required
                        value={collegePassword}
                        onChange={(e) => setCollegePassword(e.target.value)}
                        placeholder="Create a password"
                        className="mt-1.5 w-full rounded-2xl border border-[#E2D9FF] bg-[#EEF5FF]/50 px-4 py-3 text-sm text-[#160840] outline-none transition focus:border-[#7C5CFC] focus:bg-white focus:ring-4 focus:ring-[#7C5CFC]/15"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-[#160840]">Confirm Password</label>
                      <input
                        type="password"
                        required
                        value={collegeConfirmPassword}
                        onChange={(e) => setCollegeConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="mt-1.5 w-full rounded-2xl border border-[#E2D9FF] bg-[#EEF5FF]/50 px-4 py-3 text-sm text-[#160840] outline-none transition focus:border-[#7C5CFC] focus:bg-white focus:ring-4 focus:ring-[#7C5CFC]/15"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7C5CFC] to-[#F5C842] px-5 py-4 text-sm font-black text-white shadow-lg transition hover:scale-[1.01] cursor-pointer disabled:opacity-70"
              >
                <span>
                  {loading
                    ? "Creating Account..."
                    : `Sign up as ${role === "student" ? "Student" : "College"}`}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="mt-4 text-center">
                <p className="text-sm text-[#6B7280]">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-extrabold text-[#7C5CFC] transition hover:text-[#160840]"
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
