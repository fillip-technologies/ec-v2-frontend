'use client';

import React from 'react';
import { Users, Award, Ticket, CheckCircle2, ArrowUpRight, School } from 'lucide-react';

interface CollegeOverviewProps {
  overviewData: any;
  onNavigateSlug?: (slug: string) => void;
}

export const CollegeOverview: React.FC<CollegeOverviewProps> = ({
  overviewData,
  onNavigateSlug,
}) => {
  const collegeInfo = overviewData?.college || {
    name: 'College Campus',
    address: 'Campus Address',
  };

  const metrics = overviewData?.metrics || {
    totalStudents: 0,
    activeEnrollments: 0,
    completedEnrollments: 0,
    totalSeatsAllocated: 0,
  };

  const recentCohortStudents = overviewData?.recentCohortStudents || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-[24px] bg-gradient-to-r from-textPrimary via-gray-900 to-brand p-6 text-white shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-md mb-2">
            <School className="h-3.5 w-3.5" />
            Institutional Portal Active
          </div>
          <h1 className="text-2xl font-black tracking-tight">{collegeInfo.name}</h1>
          <p className="text-xs text-white/80 mt-1">
            {collegeInfo.address} • Approved Partner Campus
          </p>
        </div>
      </div>

      {/* Scoped Telemetry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-[20px] bg-white p-5 border border-borderLight shadow-xs">
          <div className="flex items-center justify-between text-textMuted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Cohort Students</span>
            <Users className="h-4 w-4 text-warning" />
          </div>
          <div className="text-2xl font-black text-textPrimary">{metrics.totalStudents}</div>
          <div className="text-[10px] font-semibold text-textMuted mt-1">Institutional Enrolments</div>
        </div>

        <div className="rounded-[20px] bg-white p-5 border border-borderLight shadow-xs">
          <div className="flex items-center justify-between text-textMuted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Workspaces</span>
            <Award className="h-4 w-4 text-info" />
          </div>
          <div className="text-2xl font-black text-textPrimary">{metrics.activeEnrollments}</div>
          <div className="text-[10px] font-semibold text-infoDark mt-1">In-Progress Internships</div>
        </div>

        <div className="rounded-[20px] bg-white p-5 border border-borderLight shadow-xs">
          <div className="flex items-center justify-between text-textMuted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </div>
          <div className="text-2xl font-black text-textPrimary">{metrics.completedEnrollments}</div>
          <div className="text-[10px] font-semibold text-successDark mt-1">Certificates Earned</div>
        </div>

        <div className="rounded-[20px] bg-white p-5 border border-borderLight shadow-xs">
          <div className="flex items-center justify-between text-textMuted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Allocated Seats</span>
            <Ticket className="h-4 w-4 text-brand" />
          </div>
          <div className="text-2xl font-black text-textPrimary">{metrics.totalSeatsAllocated}</div>
          <div className="text-[10px] font-semibold text-brand mt-1">Total Seat Capacity</div>
        </div>
      </div>

      {/* Cohort Student Table Preview */}
      <div className="rounded-[24px] bg-white p-6 border border-borderLight shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-textPrimary flex items-center gap-2">
              <Users className="h-5 w-5 text-warning" />
              Recent Institutional Cohort Progress
            </h2>
            <p className="text-xs text-textMuted">Live progress metrics of students enrolled under {collegeInfo.name}</p>
          </div>
          {onNavigateSlug && (
            <button
              onClick={() => onNavigateSlug('students')}
              className="text-xs font-bold text-brand hover:underline flex items-center gap-1 cursor-pointer"
            >
              View Full Cohort <ArrowUpRight className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="divide-y divide-borderLight/60">
          {recentCohortStudents.length === 0 ? (
            <div className="py-8 text-center text-xs font-bold text-textMuted">
              No students currently enrolled in this college cohort.
            </div>
          ) : (
            recentCohortStudents.map((student: any) => (
              <div key={student.id} className="py-3.5 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-extrabold text-textPrimary">{student.displayName}</div>
                  <div className="text-[10px] text-textMuted font-medium">{student.email} • {student.programTitle}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-black text-successDark">{student.completionPercentage}% Complete</div>
                    <div className="text-[10px] text-textMuted font-semibold">{student.enrollmentStatus}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
