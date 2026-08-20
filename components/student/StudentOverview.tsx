'use client';

import React, { useState, useEffect } from 'react';
import { Project } from '@/types/catalog';
import { useAuth } from '@/context/AuthContext';
import { Clock, FolderKanban, Award, Send, ArrowRight, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

interface StudentOverviewProps {
  projects?: Project[];
  programTitle?: string;
  overview?: any;
  overviewData?: any;
  profile?: any;
  programs?: any[];
  programsData?: any[];
  onSelectSlug?: (slug: string) => void;
  onNavigateSlug?: (slug: string) => void;
  onOpenSubmitModal?: (taskId: number, taskTitle: string, repoUrl?: string, workspaceId?: number) => void;
}

export const StudentOverview: React.FC<StudentOverviewProps> = ({
  projects = [],
  programTitle = 'Enrolled Internship Track',
  overview,
  overviewData: overviewDataProp,
  onSelectSlug,
  onNavigateSlug,
}) => {
  const effectiveOverview = overview || overviewDataProp;
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigateFn = onSelectSlug || onNavigateSlug || (() => {});

  const metrics = effectiveOverview?.metrics || {
    hoursLogged: 0,
    totalHours: 120,
    completionPercentage: 0,
    projectsDone: 0,
    totalProjects: 3,
    currentScore: 0,
    maxScore: 100,
    grade: 'N/A',
    totalSubmissions: 0,
    gradedSubmissions: 0,
  };

  const recentAiReview = effectiveOverview?.recentAiReview || null;
  const title = effectiveOverview?.programTitle || programTitle;

  const projectTracks: any[] =
    effectiveOverview?.projects && Array.isArray(effectiveOverview.projects)
      ? effectiveOverview.projects
      : Array.isArray(projects)
      ? projects
      : [];

  const firstName = mounted
    ? effectiveOverview?.firstName ||
      (user as any)?.student?.firstName ||
      user?.firstName ||
      (user as any)?.displayName ||
      user?.email?.split('@')[0] ||
      'Learner'
    : 'Learner';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-[28px] bg-gradient-to-r from-brand to-brandDark p-6 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-white/80" suppressHydrationWarning>
              {title}
            </div>
            <h2 className="mt-1 text-2xl font-black text-white" suppressHydrationWarning>
              Hi {firstName}
            </h2>
            <p className="mt-1 text-xs text-white/90" suppressHydrationWarning>
              {metrics.hoursLogged > 0
                ? `You have logged ${metrics.hoursLogged} hours out of ${metrics.totalHours} total curriculum hours.`
                : 'Welcome to your workspace. Start working on your capstone projects to log hours and build your verified portfolio.'}
            </p>
          </div>

          {/* Progress Ring Indicator */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-secondary bg-white/10 backdrop-blur-md">
            <span className="text-sm font-black text-white" suppressHydrationWarning>
              {metrics.completionPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[20px] border border-borderLight bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-textMuted">
            <Clock className="h-4 w-4 text-brand" />
            <span>Hours Logged</span>
          </div>
          <div className="mt-2 text-xl font-black text-textPrimary" suppressHydrationWarning>
            {metrics.hoursLogged} <span className="text-xs font-semibold text-textMuted">/ {metrics.totalHours} Hours</span>
          </div>
        </div>

        <div className="rounded-[20px] border border-borderLight bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-textMuted">
            <FolderKanban className="h-4 w-4 text-brand" />
            <span>Projects Done</span>
          </div>
          <div className="mt-2 text-xl font-black text-textPrimary" suppressHydrationWarning>
            {metrics.projectsDone} <span className="text-xs font-semibold text-textMuted">/ {metrics.totalProjects || 3} Projects</span>
          </div>
        </div>

        <div className="rounded-[20px] border border-borderLight bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-textMuted">
            <Award className="h-4 w-4 text-emerald-600" />
            <span>Current Score</span>
          </div>
          <div className="mt-2 text-xl font-black text-emerald-600" suppressHydrationWarning>
            {metrics.currentScore} / {metrics.maxScore || 100}{' '}
            <span className="text-xs font-bold text-textMuted">(Grade {metrics.grade})</span>
          </div>
        </div>

        <div className="rounded-[20px] border border-borderLight bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-textMuted">
            <Send className="h-4 w-4 text-brand" />
            <span>Submissions</span>
          </div>
          <div className="mt-2 text-xl font-black text-textPrimary" suppressHydrationWarning>
            {metrics.totalSubmissions}{' '}
            <span className="text-xs font-semibold text-textMuted">({metrics.gradedSubmissions} Graded)</span>
          </div>
        </div>
      </div>

      {/* Main Overview Grid: Projects Track + AI Review Box */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Program Projects Track (7 cols) */}
        <div className="lg:col-span-7 space-y-4 rounded-[24px] border border-borderLight bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-borderLight pb-3">
            <h3 className="text-sm font-bold text-textPrimary">Program Projects</h3>
            <button
              onClick={() => navigateFn('program')}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {projectTracks.length === 0 ? (
              <div className="text-xs text-textMuted py-8 text-center space-y-2">
                <BookOpen className="h-8 w-8 text-textMuted/40 mx-auto" />
                <p className="font-bold">No active capstone projects enrolled yet.</p>
                <button
                  onClick={() => navigateFn('program')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand text-white text-xs font-bold shadow-xs hover:bg-brandHover transition cursor-pointer"
                >
                  <span>Explore Programme Tracks</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              projectTracks.slice(0, 3).map((project: any, idx: number) => {
                const steps = project.workspaceTemplate?.steps || project.workspaceTemplate?.tasks || [];
                let calculatedStatus = project.status;

                if (!calculatedStatus) {
                  if (steps.length > 0) {
                    const allCompleted = steps.every(
                      (s: any) =>
                        s.status === 'COMPLETED' ||
                        s.status === 'completed' ||
                        s.status === 'PASSED' ||
                        s.status === 'passed'
                    );
                    const anyStarted = steps.some(
                      (s: any) =>
                        s.status === 'COMPLETED' ||
                        s.status === 'completed' ||
                        s.status === 'IN_PROGRESS' ||
                        s.status === 'in_progress' ||
                        s.status === 'PASSED' ||
                        s.status === 'passed'
                    );

                    if (allCompleted) {
                      calculatedStatus = 'Done';
                    } else if (anyStarted) {
                      calculatedStatus = 'Active';
                    } else {
                      calculatedStatus = idx === 0 ? 'Active' : 'Locked';
                    }
                  } else {
                    calculatedStatus = idx === 0 ? 'Active' : 'Locked';
                  }
                }

                return (
                  <div
                    key={project.id || idx}
                    onClick={() => navigateFn('program')}
                    className="flex items-center justify-between rounded-[16px] border border-borderLight/80 bg-bgSoft/60 p-3.5 text-xs hover:border-brand/40 hover:bg-white transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                          calculatedStatus === 'Done'
                            ? 'bg-emerald-100 text-emerald-700'
                            : calculatedStatus === 'Active'
                            ? 'bg-brand/10 text-brand'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {calculatedStatus === 'Done' ? '✓' : idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-textPrimary">{project.title}</div>
                        <div className="text-[11px] text-textMuted">Capstone Project #{idx + 1}</div>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase ${
                        calculatedStatus === 'Done'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : calculatedStatus === 'Active'
                          ? 'bg-brand text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {calculatedStatus}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Recent AI Rubric Evaluation Review (5 cols) */}
        <div className="lg:col-span-5 space-y-4 rounded-[24px] border border-borderLight bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-borderLight pb-3 text-sm font-bold text-textPrimary">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Recent AI Rubric Review</span>
          </div>

          {recentAiReview ? (
            <div className="rounded-[18px] border border-emerald-200 bg-emerald-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-900">{recentAiReview?.stepTitle || 'Milestone Task Review'}</span>
                <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">
                  {recentAiReview?.status || 'GRADED'}
                </span>
              </div>

              <div className="text-xl font-black text-emerald-900">
                Score: {recentAiReview?.score ?? 0} / {recentAiReview?.maxScore ?? 100}
              </div>

              <div className="space-y-1 text-xs text-textPrimary">
                {Array.isArray(recentAiReview?.breakdown) &&
                  recentAiReview.breakdown.map((item: any, bIdx: number) => (
                    <div key={bIdx} className="flex justify-between">
                      <span>{item.criterion}:</span>
                      <span className="font-bold text-emerald-800">
                        {item.score} / {item.maxScore}
                      </span>
                    </div>
                  ))}
              </div>

              {recentAiReview?.feedback && (
                <div className="border-t border-emerald-200/80 pt-2 text-[11px] font-medium text-emerald-900 italic">
                  &quot;{recentAiReview.feedback}&quot;
                </div>
              )}

              <button
                onClick={() => navigateFn('submissions')}
                className="w-full rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-all cursor-pointer shadow-2xs"
              >
                View Submission Scores
              </button>
            </div>
          ) : (
            <div className="rounded-[18px] border border-dashed border-borderLight bg-bgSoft/40 p-6 text-center space-y-3">
              <Sparkles className="h-7 w-7 text-textMuted/40 mx-auto" />
              <div className="text-xs font-bold text-textPrimary">No AI Reviews Yet</div>
              <p className="text-[11px] text-textMuted leading-relaxed">
                Submit task deliverables with your commit hash or live URL in the Program workspace to receive automated AI rubric evaluations.
              </p>
              <button
                onClick={() => navigateFn('program')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-borderLight bg-white text-xs font-bold text-textPrimary hover:bg-bgSoft transition cursor-pointer shadow-2xs"
              >
                <span>Go to Program Deliverables</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
