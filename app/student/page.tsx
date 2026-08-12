'use client';

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { StudentSidebar } from '@/components/student/StudentSidebar';
import { StudentOverview } from '@/components/student/StudentOverview';
import { SharedProjectsView } from '@/components/shared/SharedProjectsView';
import { Can } from '@/components/auth/Can';
import { Project } from '@/types/catalog';
import { getProgramByIdOrSlug } from '@/lib/api/catalog';
import studentData from '@/config/studentData.json';
import { User, School, Shield } from 'lucide-react';

function StudentDashboardContent() {
  const { user } = useAuth();
  const [activeSlug, setActiveSlug] = useState<string>('overview');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch default program projects from backend using JSON config slug
    getProgramByIdOrSlug(studentData.defaultProgramSlug)
      .then((data) => {
        if (data?.projects) {
          setProjects(data.projects);
        }
      })
      .catch((err) => console.error('Failed to load program projects:', err))
      .finally(() => setLoading(false));
  }, []);

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : 'Rahul Sharma';

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-bgSoft">
      {/* Pinned Left Sidebar (Independent Scroll) */}
      <StudentSidebar
        activeSlug={activeSlug}
        onSelectSlug={setActiveSlug}
        onOpenProfile={() => setActiveSlug('profile')}
      />

      {/* Main Content Area (Independent Scroll) */}
      <main className="flex-1 h-full overflow-y-auto p-6 sm:p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          {activeSlug === 'overview' && (
            <StudentOverview projects={projects} onSelectSlug={setActiveSlug} />
          )}

          {activeSlug === 'projects' && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-black text-textPrimary">Program Projects</h2>
                
                {/* Action protected by <Can do="project:edit"> */}
                <Can do="project:edit">
                  <button className="rounded-xl bg-brand px-3.5 py-1.5 text-xs font-bold text-white hover:bg-brandHover transition-all">
                    + Add New Capstone Project
                  </button>
                </Can>
              </div>

              <SharedProjectsView
                projects={projects}
                onSelectProject={(proj) => alert(`Selected ${proj.title}`)}
                onEditProject={(proj) => alert(`Editing permissions for ${proj.title}`)}
              />
            </div>
          )}

          {activeSlug === 'submissions' && (
            <div className="rounded-[24px] border border-borderLight bg-white p-8 space-y-4 shadow-xs">
              <h2 className="text-xl font-black text-textPrimary">Task Submissions</h2>
              <p className="text-xs text-textMuted">
                List of student task submissions evaluated by BullMQ AI worker pipeline.
              </p>
              
              <div className="space-y-3">
                {studentData.submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-borderLight bg-bgSoft/60 p-4 text-xs font-bold text-textPrimary"
                  >
                    <div>
                      <div className="text-sm font-extrabold">{sub.taskTitle}</div>
                      <div className="text-[11px] font-medium text-textMuted mt-0.5">
                        {sub.stepTitle} • {sub.evaluator}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {sub.score !== null && (
                        <span className="text-sm font-black text-emerald-700">
                          {sub.score} / 100
                        </span>
                      )}
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase ${
                          sub.status === 'PASSED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSlug === 'rubrics' && (
            <div className="rounded-[24px] border border-borderLight bg-white p-8 space-y-4 shadow-xs">
              <h2 className="text-xl font-black text-textPrimary">AI Rubrics & Criteria</h2>
              <p className="text-xs text-textMuted">
                Evaluation scoring criteria and minimum pass threshold across steps.
              </p>

              <div className="space-y-4">
                {studentData.rubrics.map((r) => (
                  <div key={r.stepId} className="rounded-2xl border border-borderLight bg-bgSoft/60 p-4 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-textPrimary">
                      <span>{r.stepTitle}</span>
                      <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[10px] text-brand">
                        Pass Threshold: {r.passThreshold}/100
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-textMuted pt-1">
                      {r.criteria.map((c, cIdx) => (
                        <span key={cIdx} className="rounded-lg bg-white border border-borderLight px-2.5 py-1 font-semibold text-textPrimary">
                          • {c.criterion} (Max: {c.maxScore})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSlug === 'certificate' && (
            <div className="rounded-[24px] border border-borderLight bg-white p-8 text-center space-y-4 shadow-xs">
              <h2 className="text-xl font-black text-textPrimary">Verified Certificate</h2>
              <p className="text-xs text-textMuted max-w-md mx-auto">
                Complete all {studentData.metrics.totalProjects} capstone projects to unlock your QR-verifiable certificate.
              </p>
              <div className="inline-block rounded-full bg-brand/10 px-4 py-1.5 text-xs font-bold text-brand">
                {studentData.metrics.completionPercentage}% Complete ({studentData.metrics.projectsDone} / {studentData.metrics.totalProjects} Projects)
              </div>
            </div>
          )}

          {activeSlug === 'payments' && (
            <div className="rounded-[24px] border border-borderLight bg-white p-8 space-y-4 shadow-xs">
              <h2 className="text-xl font-black text-textPrimary">Payment History & Invoices</h2>
              <div className="rounded-xl border border-borderLight bg-bgSoft p-4 flex justify-between text-xs font-bold">
                <span>EC-S-1049 • Full Stack Web Engineering</span>
                <span className="text-emerald-700">PAID (INR 2,999)</span>
              </div>
            </div>
          )}

          {/* Student Profile View */}
          {activeSlug === 'profile' && (
            <div className="rounded-[24px] border border-borderLight bg-white p-8 space-y-6 shadow-xs">
              <div className="flex items-center gap-4 border-b border-borderLight pb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand font-black text-xl">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-textPrimary">{displayName}</h2>
                  <p className="text-xs text-textMuted">{user?.email || 'student@example.com'}</p>
                  <span className="mt-1 inline-block rounded-full bg-brand/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-brand">
                    {typeof user?.role === 'string' ? user.role : 'Student Account'}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-borderLight bg-bgSoft/50 p-4 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-textMuted">
                    <School className="h-4 w-4 text-brand" />
                    <span>Institution</span>
                  </div>
                  <div className="text-sm font-bold text-textPrimary">{studentData.profile.institutionName}</div>
                </div>

                <div className="rounded-2xl border border-borderLight bg-bgSoft/50 p-4 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-textMuted">
                    <Shield className="h-4 w-4 text-brand" />
                    <span>Verification Status</span>
                  </div>
                  <div className="text-sm font-bold text-emerald-700">{studentData.profile.verificationStatus}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function StudentDashboardPage() {
  return (
    <AuthProvider>
      <StudentDashboardContent />
    </AuthProvider>
  );
}
