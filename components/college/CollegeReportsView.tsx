'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';

interface CollegeReportsViewProps {
  reportsData: any;
}

export const CollegeReportsView: React.FC<CollegeReportsViewProps> = ({ reportsData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[24px] border border-borderLight shadow-xs">
        <h1 className="text-xl font-black text-textPrimary flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-info" />
          Institutional Cohort Completion Reports
        </h1>
        <p className="text-xs text-textMuted mt-1">
          Scored outcomes, completion analytics, and QR certificate verification summary for {reportsData?.institutionName || 'your college'}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-[24px] border border-borderLight shadow-xs space-y-2">
          <div className="text-xs font-bold uppercase text-textMuted">Total Enrolled Cohort</div>
          <div className="text-3xl font-black text-textPrimary">{reportsData?.totalEnrolledCohort || 0}</div>
          <div className="text-xs text-textMuted">Registered campus learners</div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-borderLight shadow-xs space-y-2">
          <div className="text-xs font-bold uppercase text-textMuted">Completed Internships</div>
          <div className="text-3xl font-black text-successDark">{reportsData?.completedInternships || 0}</div>
          <div className="text-xs text-successDark font-semibold">{reportsData?.completionRatePercentage || 0}% Completion Rate</div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-borderLight shadow-xs space-y-2">
          <div className="text-xs font-bold uppercase text-textMuted">Certificates Issued</div>
          <div className="text-3xl font-black text-brand">{reportsData?.certificatesIssued || 0}</div>
          <div className="text-xs text-brand font-semibold">Verified QR Credentials</div>
        </div>
      </div>
    </div>
  );
};
