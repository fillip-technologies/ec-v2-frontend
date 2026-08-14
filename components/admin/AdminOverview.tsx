'use client';

import React from 'react';
import { Users, School, BookOpen, Layers, Award, CheckCircle2, XCircle, Clock, ArrowUpRight } from 'lucide-react';

interface AdminOverviewProps {
  overviewData: any;
  onApproveCollege?: (id: number) => void;
  onRejectCollege?: (id: number) => void;
  onNavigateSlug?: (slug: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  overviewData,
  onApproveCollege,
  onRejectCollege,
  onNavigateSlug,
}) => {
  const metrics = overviewData?.metrics || {
    totalUsers: 0,
    totalStudents: 0,
    totalColleges: 0,
    pendingCollegesCount: 0,
    totalPrograms: 0,
    totalEnrollments: 0,
    totalSubmissions: 0,
  };

  const pendingColleges = overviewData?.pendingColleges || [];
  const recentUsers = overviewData?.recentUsers || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-[24px] bg-gradient-to-r from-textPrimary via-gray-900 to-brand p-6 text-white shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-md mb-2">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse"></span>
            Super Admin Console Active
          </div>
          <h1 className="text-2xl font-black tracking-tight">Platform Overview & Telemetry</h1>
          <p className="text-xs text-white/70 mt-1">
            Real-time management of catalog programs, B2B college institutions, user roles, and AI evaluation metrics.
          </p>
        </div>
      </div>

      {/* Telemetry Stat Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="rounded-[20px] bg-white p-4 border border-borderLight shadow-xs">
          <div className="flex items-center justify-between text-textMuted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Users</span>
            <Users className="h-4 w-4 text-brand" />
          </div>
          <div className="text-2xl font-black text-textPrimary">{metrics.totalUsers}</div>
          <div className="text-[10px] font-semibold text-successDark mt-1">Registered Platform Accounts</div>
        </div>

        <div className="rounded-[20px] bg-white p-4 border border-borderLight shadow-xs">
          <div className="flex items-center justify-between text-textMuted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Students</span>
            <Award className="h-4 w-4 text-info" />
          </div>
          <div className="text-2xl font-black text-textPrimary">{metrics.totalStudents}</div>
          <div className="text-[10px] font-semibold text-textMuted mt-1">Learner Profiles</div>
        </div>

        <div className="rounded-[20px] bg-white p-4 border border-borderLight shadow-xs">
          <div className="flex items-center justify-between text-textMuted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Colleges</span>
            <School className="h-4 w-4 text-warning" />
          </div>
          <div className="text-2xl font-black text-textPrimary">{metrics.totalColleges}</div>
          <div className="text-[10px] font-semibold text-warningDark mt-1">
            {metrics.pendingCollegesCount} Pending Vetting
          </div>
        </div>

        <div className="rounded-[20px] bg-white p-4 border border-borderLight shadow-xs">
          <div className="flex items-center justify-between text-textMuted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Programs</span>
            <BookOpen className="h-4 w-4 text-brand" />
          </div>
          <div className="text-2xl font-black text-textPrimary">{metrics.totalPrograms}</div>
          <div className="text-[10px] font-semibold text-textMuted mt-1">Active Catalog Tracks</div>
        </div>

        <div className="rounded-[20px] bg-white p-4 border border-borderLight shadow-xs">
          <div className="flex items-center justify-between text-textMuted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Enrollments</span>
            <Layers className="h-4 w-4 text-brand" />
          </div>
          <div className="text-2xl font-black text-textPrimary">{metrics.totalEnrollments}</div>
          <div className="text-[10px] font-semibold text-successDark mt-1">Active Workspaces</div>
        </div>

        <div className="rounded-[20px] bg-white p-4 border border-borderLight shadow-xs">
          <div className="flex items-center justify-between text-textMuted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Submissions</span>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </div>
          <div className="text-2xl font-black text-textPrimary">{metrics.totalSubmissions}</div>
          <div className="text-[10px] font-semibold text-textMuted mt-1">AI Evaluated Tasks</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending B2B College Approvals Queue */}
        <div className="rounded-[24px] bg-white p-6 border border-borderLight shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-textPrimary flex items-center gap-2">
                <School className="h-5 w-5 text-warning" />
                Pending B2B Institution Vetting
              </h2>
              <p className="text-xs text-textMuted">Colleges awaiting Super Admin approval for seat allocation</p>
            </div>
            {onNavigateSlug && (
              <button
                onClick={() => onNavigateSlug('colleges')}
                className="text-xs font-bold text-brand hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All <ArrowUpRight className="h-3 w-3" />
              </button>
            )}
          </div>

          {pendingColleges.length === 0 ? (
            <div className="rounded-[16px] bg-bgSoft p-6 text-center text-xs font-bold text-textMuted">
              No pending college applications. All institutions are vetted!
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scroll-smooth">
              {pendingColleges.map((college: any) => (
                <div
                  key={college.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-[16px] bg-bgSoft border border-borderLight/60 hover:border-borderLight transition-all shrink-0"
                >
                  <div>
                    <div className="text-xs font-black text-textPrimary">{college.name}</div>
                    <div className="text-[11px] font-medium text-textMuted mt-0.5">
                      {college.address} • {college.countryName}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {onRejectCollege && (
                      <button
                        onClick={() => onRejectCollege(college.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-dangerLight text-danger hover:bg-danger hover:text-white text-xs font-extrabold transition-all cursor-pointer"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </button>
                    )}
                    {onApproveCollege && (
                      <button
                        onClick={() => onApproveCollege(college.id)}
                        className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-success text-white hover:bg-successDark text-xs font-extrabold transition-all cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Registered Users Feed */}
        <div className="rounded-[24px] bg-white p-6 border border-borderLight shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-textPrimary flex items-center gap-2">
                <Users className="h-5 w-5 text-brand" />
                Recent System User Registrations
              </h2>
              <p className="text-xs text-textMuted">Latest accounts registered on Engineers Clinic</p>
            </div>
            {onNavigateSlug && (
              <button
                onClick={() => onNavigateSlug('users')}
                className="text-xs font-bold text-brand hover:underline flex items-center gap-1 cursor-pointer"
              >
                Manage Users <ArrowUpRight className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="divide-y divide-borderLight/60 max-h-[400px] overflow-y-auto pr-2 scroll-smooth">
            {recentUsers.map((user: any) => (
              <div key={user.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-brand/10 text-brand font-black text-xs flex items-center justify-center">
                    {user.email[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-textPrimary">{user.email}</div>
                    <div className="text-[10px] font-medium text-textMuted">
                      {user.countryName} • {user.phoneNo || 'No phone'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      user.roleName === 'super_admin'
                        ? 'bg-brand/10 text-brand'
                        : user.roleName === 'college'
                        ? 'bg-warningLight text-warningDark'
                        : 'bg-infoLight text-infoDark'
                    }`}
                  >
                    {user.roleName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
