'use client';

import React, { useState } from 'react';
import { Project } from '@/types/catalog';
import { SharedProjectsView } from '@/components/shared/SharedProjectsView';
import { BookOpen, Clock, Award, CheckCircle2, ChevronRight, Layers, Sparkles, FolderKanban } from 'lucide-react';

interface ProgramDetail {
  id: number;
  title: string;
  slug: string;
  clusterName?: string;
  durationHours: number;
  description: string;
  outcomes?: string;
  status: string;
  hoursLogged: number;
  completionPercentage: number;
  projectsDone: number;
  totalProjects: number;
  projects: Project[];
}

interface StudentProgramViewProps {
  programsData?: ProgramDetail[];
  fallbackProjects: Project[];
  onSelectProject?: (project: Project) => void;
  onEditProject?: (project: Project) => void;
}

export const StudentProgramView: React.FC<StudentProgramViewProps> = ({
  programsData,
  fallbackProjects,
  onSelectProject,
  onEditProject,
}) => {
  // Default mock programs list if no multi-program data passed
  const programs: ProgramDetail[] = Array.isArray(programsData) && programsData.length > 0
    ? programsData
    : [
        {
          id: 1,
          title: 'Full Stack Web Engineering (MERN & Next.js)',
          slug: 'fullstack-web-engineering-mern-nextjs',
          clusterName: 'Software Engineering',
          durationHours: 120,
          description:
            'Master enterprise full-stack web application development using React, Next.js, Node.js, and MariaDB with AI evaluation rubric gating.',
          outcomes:
            'Design microservice architectures, build secure REST APIs with NestJS, and deploy responsive Next.js web applications.',
          status: 'ACTIVE',
          hoursLogged: 40,
          completionPercentage: 33,
          projectsDone: 1,
          totalProjects: 3,
          projects: fallbackProjects,
        },
        {
          id: 2,
          title: 'Cybersecurity Incident Response & Digital Forensics',
          slug: 'cybersecurity-incident-response-digital-forensics',
          clusterName: 'Cybersecurity & Infrastructure',
          durationHours: 120,
          description:
            'Hands-on network packet analysis, vulnerability threat hunting, and automated incident response scripts.',
          outcomes:
            'Conduct digital forensic analysis, audit OWASP top 10 web vulnerabilities, and automate SIEM log detection.',
          status: 'ACTIVE',
          hoursLogged: 0,
          completionPercentage: 0,
          projectsDone: 0,
          totalProjects: 3,
          projects: fallbackProjects.map((p, idx) => ({
            ...p,
            id: p.id + 100,
            title: idx === 0
              ? 'Network Packet Sniffer & Security Auditor'
              : idx === 1
              ? 'Automated Web Vulnerability Exploitation Suite'
              : 'SIEM Incident Detection & Log Analyzer',
          })),
        },
      ];

  const [activeProgramId, setActiveProgramId] = useState<number>(programs[0].id);
  const selectedProgram = programs.find((p) => p.id === activeProgramId) || programs[0];

  return (
    <div className="space-y-6">
      {/* 1. Multi-Program Selector Bar (If student has multiple programs) */}
      <div className="rounded-[24px] border border-borderLight bg-white p-4 shadow-xs">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-textMuted mb-2 px-1">
          YOUR ENROLLED INTERNSHIP PROGRAMMES ({programs.length})
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {programs.map((prog) => {
            const isActive = prog.id === activeProgramId;
            return (
              <button
                key={prog.id}
                onClick={() => setActiveProgramId(prog.id)}
                className={`flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-brand text-white shadow-xs ring-2 ring-brand/20'
                    : 'bg-bgSoft text-textPrimary hover:bg-white hover:border-borderLight border border-borderLight/60'
                }`}
              >
                <BookOpen className="h-4 w-4 shrink-0" />
                <span className="truncate max-w-[240px]">{prog.title}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                    isActive ? 'bg-white/20 text-white' : 'bg-brand/10 text-brand'
                  }`}
                >
                  {prog.status}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Program Details Header Card */}
      <div className="rounded-[28px] border border-borderLight bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-borderLight pb-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
                {selectedProgram.clusterName || 'Engineering Stream'}
              </span>
              <span className="rounded-full bg-bgSoft px-3 py-1 text-xs font-bold text-textMuted border border-borderLight/60">
                {selectedProgram.durationHours} Hours Internship
              </span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 uppercase">
                {selectedProgram.status}
              </span>
            </div>

            <h2 className="text-2xl font-black text-textPrimary">{selectedProgram.title}</h2>
            <p className="text-xs text-textMuted leading-relaxed">{selectedProgram.description}</p>
          </div>

          {/* Program Progress Counter Badge */}
          <div className="rounded-2xl border border-borderLight bg-bgSoft p-4 text-center min-w-[160px] space-y-1">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-textMuted">
              PROGRAMME PROGRESS
            </div>
            <div className="text-xl font-black text-brand">
              {selectedProgram.completionPercentage}%
            </div>
            <div className="text-[11px] font-bold text-textPrimary">
              {selectedProgram.hoursLogged} / {selectedProgram.durationHours} Hours
            </div>
          </div>
        </div>

        {/* Program Learning Outcomes */}
        {selectedProgram.outcomes && (
          <div className="rounded-2xl border border-brand/20 bg-brand/5 p-4 flex items-start gap-3 text-xs text-textPrimary">
            <Sparkles className="h-5 w-5 text-brand shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-brand uppercase tracking-wider block mb-0.5">
                Core Internship Outcomes:
              </span>
              <span>{selectedProgram.outcomes}</span>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-textMuted">
            <span>Overall Programme Completion</span>
            <span>{selectedProgram.projectsDone} of {selectedProgram.totalProjects} Projects Completed</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-bgSoft overflow-hidden border border-borderLight/60">
            <div
              className="h-full bg-brand rounded-full transition-all duration-500"
              style={{ width: `${selectedProgram.completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Nested Projects Inside Program Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-brand" />
            <h3 className="text-lg font-black text-textPrimary">
              Capstone Projects ({selectedProgram.projects?.length || 0})
            </h3>
          </div>
          <span className="text-xs font-medium text-textMuted">
            All 3 capstone projects live inside this programme
          </span>
        </div>

        {/* Render nested capstone projects */}
        <SharedProjectsView
          projects={selectedProgram.projects}
          onSelectProject={onSelectProject}
          onEditProject={onEditProject}
        />
      </div>
    </div>
  );
};
