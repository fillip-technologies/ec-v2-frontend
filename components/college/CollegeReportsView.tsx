'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Award,
  Users,
  CheckCircle2,
  Download,
  Search,
  ShieldCheck,
  GraduationCap,
  Calendar,
} from 'lucide-react';
import { showToast } from '@/lib/toast';

interface CollegeReportsViewProps {
  reportsData: any;
}

export const CollegeReportsView: React.FC<CollegeReportsViewProps> = ({ reportsData }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const cohortData = reportsData?.cohortSummary || [
    {
      id: 1,
      programTitle: 'Full Stack Web Engineering (MERN & Next.js)',
      enrolledCount: 18,
      completedCount: 14,
      avgScore: '89.4%',
      status: 'ACTIVE',
    },
    {
      id: 2,
      programTitle: 'Cloud Native & Kubernetes DevOps',
      enrolledCount: 12,
      completedCount: 10,
      avgScore: '92.1%',
      status: 'ACTIVE',
    },
    {
      id: 3,
      programTitle: 'Cybersecurity Incident Response',
      enrolledCount: 8,
      completedCount: 6,
      avgScore: '87.8%',
      status: 'ACTIVE',
    },
    {
      id: 4,
      programTitle: 'Embedded Systems & IoT Firmware',
      enrolledCount: 10,
      completedCount: 9,
      avgScore: '94.0%',
      status: 'ACTIVE',
    },
  ];

  const filteredCohort = useMemo(() => {
    return cohortData.filter((item: any) =>
      item.programTitle.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [cohortData, searchQuery]);

  const handleExportSummaryCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Program Track,Enrolled Count,Completed Count,Average Score,Status']
        .concat(
          cohortData.map(
            (c: any) =>
              `"${c.programTitle}",${c.enrolledCount},${c.completedCount},"${c.avgScore}","${c.status}"`,
          ),
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Institutional_Completion_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast.success('Exported completion summary as CSV!', 'Export Complete');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-borderLight shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand">
            <BarChart3 className="h-4 w-4" />
            <span>Academic Performance Telemetry</span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-textPrimary tracking-tight">
            Institutional Completion & Verification Reports
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Scored outcomes, completion analytics, and QR certificate verification summary for {reportsData?.institutionName || 'your campus'}.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportSummaryCSV}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-bgSoft hover:bg-borderLight text-textPrimary font-extrabold text-xs transition cursor-pointer"
        >
          <Download className="h-4 w-4" />
          <span>Export Report CSV</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-[24px] border border-borderLight shadow-xs space-y-2">
          <div className="flex items-center justify-between text-textMuted">
            <span className="text-xs font-bold uppercase">Total Enrolled Cohort</span>
            <Users className="h-4 w-4 text-brand" />
          </div>
          <div className="text-3xl font-black text-textPrimary">
            {reportsData?.totalEnrolledCohort || 48}
          </div>
          <div className="text-xs text-textMuted">Registered campus learners</div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-borderLight shadow-xs space-y-2">
          <div className="flex items-center justify-between text-textMuted">
            <span className="text-xs font-bold uppercase">Completed Internships</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600">
            {reportsData?.completedInternships || 39}
          </div>
          <div className="text-xs text-emerald-700 font-semibold">
            {reportsData?.completionRatePercentage || 81.25}% Overall Completion Rate
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-borderLight shadow-xs space-y-2">
          <div className="flex items-center justify-between text-textMuted">
            <span className="text-xs font-bold uppercase">Certificates Issued</span>
            <Award className="h-4 w-4 text-brand" />
          </div>
          <div className="text-3xl font-black text-brand">
            {reportsData?.certificatesIssued || 39}
          </div>
          <div className="text-xs text-brand font-semibold">Verified QR Credentials</div>
        </div>
      </div>

      {/* Program-Wise Completion DataTable */}
      <div className="rounded-[28px] border border-borderLight bg-white shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-borderLight flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-bgBody/30">
          <div className="text-sm font-black text-textPrimary flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-brand" />
            <span>Program Track Completion Breakdown</span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
            <input
              type="text"
              placeholder="Search program track..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs font-bold rounded-xl border border-borderLight bg-white text-textPrimary placeholder:text-textMuted focus:border-brand focus:outline-hidden focus:ring-2 focus:ring-brand/20 transition"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-borderLight bg-bgBody/50 text-[11px] font-black uppercase tracking-wider text-textMuted">
                <th className="py-3.5 px-4 sm:px-6">Program Track</th>
                <th className="py-3.5 px-4">Cohort Enrolled</th>
                <th className="py-3.5 px-4">Completion Progress</th>
                <th className="py-3.5 px-4">Average Evaluation Score</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight text-xs font-medium">
              {filteredCohort.map((item: any) => {
                const completionPct = Math.round((item.completedCount / item.enrolledCount) * 100);

                return (
                  <tr key={item.id} className="hover:bg-bgSoft/40 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-extrabold text-textPrimary">
                      {item.programTitle}
                    </td>

                    <td className="py-4 px-4 font-black text-textPrimary">
                      {item.enrolledCount} Students
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-textPrimary">
                          {item.completedCount} / {item.enrolledCount}
                        </span>
                        <span className="text-[10px] text-textMuted font-bold">
                          ({completionPct}%)
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-28 rounded-full bg-bgSoft overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all"
                          style={{ width: `${completionPct}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap font-black text-emerald-700">
                      {item.avgScore}
                    </td>

                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800">
                        <ShieldCheck className="h-3 w-3" />
                        <span>Verified</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
