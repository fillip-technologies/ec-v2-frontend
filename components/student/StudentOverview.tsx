'use client';

import React from 'react';
import { Project } from '@/types/catalog';
import studentData from '@/config/studentData.json';
import { useAuth } from '@/context/AuthContext';
import { Clock, FolderKanban, Award, Send, ArrowRight, ShieldCheck } from 'lucide-react';

interface StudentOverviewProps {
  projects: Project[];
  programTitle?: string;
  overviewData?: any;
  onSelectSlug: (slug: string) => void;
}

export const StudentOverview: React.FC<StudentOverviewProps> = ({
  projects,
  programTitle = 'Full Stack Web Engineering (MERN & Next.js)',
  overviewData,
  onSelectSlug,
}) => {
  const { user } = useAuth();
  const metrics = overviewData?.metrics || studentData.metrics;
  const recentAiReview = overviewData?.recentAiReview || studentData.recentAiReview;
  const title = overviewData?.programTitle || programTitle;
  const projectTracks = overviewData?.projects?.length ? overviewData.projects : projects;

  const firstName =
    overviewData?.firstName ||
    (user as any)?.student?.firstName ||
    user?.firstName ||
    (user as any)?.displayName ||
    'Learner';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-[28px] bg-gradient-to-r from-brand to-purple-800 p-6 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-white/80">
              {title}
            </div>
            <h2 className="mt-1 text-2xl font-black text-white">Hi {firstName}</h2>
            <p className="mt-1 text-xs text-white/90">
              You are {metrics.hoursLogged} hours through your {metrics.totalHours} hours. Next up: Step 2 in Project #2.
            </p>
          </div>

          {/* Progress Ring Indicator */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-amber-300 bg-white/10 backdrop-blur-md">
            <span className="text-sm font-black text-white">{metrics.completionPercentage}%</span>
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
          <div className="mt-2 text-xl font-black text-textPrimary">
            {metrics.hoursLogged} <span className="text-xs font-semibold text-textMuted">/ {metrics.totalHours} Hours</span>
          </div>
        </div>

        <div className="rounded-[20px] border border-borderLight bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-textMuted">
            <FolderKanban className="h-4 w-4 text-brand" />
            <span>Projects Done</span>
          </div>
          <div className="mt-2 text-xl font-black text-textPrimary">
            {metrics.projectsDone} <span className="text-xs font-semibold text-textMuted">/ {metrics.totalProjects} Projects</span>
          </div>
        </div>

        <div className="rounded-[20px] border border-borderLight bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-textMuted">
            <Award className="h-4 w-4 text-emerald-600" />
            <span>Current Score</span>
          </div>
          <div className="mt-2 text-xl font-black text-emerald-600">
            {metrics.currentScore} / {metrics.maxScore} <span className="text-xs font-bold text-textMuted">(Grade {metrics.grade})</span>
          </div>
        </div>

        <div className="rounded-[20px] border border-borderLight bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-textMuted">
            <Send className="h-4 w-4 text-brand" />
            <span>Submissions</span>
          </div>
          <div className="mt-2 text-xl font-black text-textPrimary">
            {metrics.totalSubmissions} <span className="text-xs font-semibold text-textMuted">({metrics.gradedSubmissions} Graded)</span>
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
              onClick={() => onSelectSlug('program')}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 3).map((project, idx) => {
              const status = idx === 0 ? 'Done' : idx === 1 ? 'Active' : 'Locked';
              return (
                <div
                  key={project.id || idx}
                  className="flex items-center justify-between rounded-[16px] border border-borderLight/80 bg-bgSoft/60 p-3.5 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        status === 'Done'
                          ? 'bg-statusPassedBg text-statusPassedText'
                          : status === 'Active'
                          ? 'bg-brand/10 text-brand'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {status === 'Done' ? '✓' : idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-textPrimary">{project.title}</div>
                      <div className="text-[11px] text-textMuted">40 Hours • Capstone Project #{idx + 1}</div>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase ${
                      status === 'Done'
                        ? 'bg-statusPassedBg text-statusPassedText'
                        : status === 'Active'
                        ? 'bg-brand text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Recent AI Rubric Evaluation Review (5 cols) */}
        <div className="lg:col-span-5 space-y-4 rounded-[24px] border border-borderLight bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-borderLight pb-3 text-sm font-bold text-textPrimary">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Recent AI Rubric Review</span>
          </div>

          <div className="rounded-[18px] border border-emerald-200 bg-emerald-50/50 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-800">{recentAiReview.stepTitle}</span>
              <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">
                {recentAiReview.status}
              </span>
            </div>

            <div className="text-xl font-black text-emerald-900">
              Score: {recentAiReview.score} / {recentAiReview.maxScore}
            </div>

            <div className="space-y-1 text-xs text-emerald-950">
              {Array.isArray(recentAiReview.breakdown) && recentAiReview.breakdown.map((item: any, bIdx: number) => (
                <div key={bIdx} className="flex justify-between">
                  <span>{item.criterion}:</span>
                  <span className="font-bold">{item.score} / {item.maxScore}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-emerald-200 pt-2 text-[11px] font-medium text-emerald-800 italic">
              &quot;{recentAiReview.feedback}&quot;
            </div>

            <button
              onClick={() => onSelectSlug('rubrics')}
              className="w-full rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-all"
            >
              View Rubric Breakdown
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
