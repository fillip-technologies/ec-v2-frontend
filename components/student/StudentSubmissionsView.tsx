'use client';

import React, { useState, useMemo } from 'react';
import {
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface StudentSubmissionsViewProps {
  submissions: any[];
  onNavigateProgram?: () => void;
}

const ITEMS_PER_PAGE = 8;

export const StudentSubmissionsView: React.FC<StudentSubmissionsViewProps> = ({
  submissions = [],
  onNavigateProgram,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PASSED' | 'EVALUATING' | 'NEEDS_WORK'>('ALL');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filtered = useMemo(() => {
    return submissions.filter((sub) => {
      const title = (sub.taskTitle || sub.stepTitle || `Submission #${sub.id}`).toLowerCase();
      const evaluator = (sub.evaluator || '').toLowerCase();
      const matchesSearch = title.includes(searchTerm.toLowerCase()) || evaluator.includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'ALL' || sub.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchTerm, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const activePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedItems = useMemo(() => {
    const startIdx = (activePage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filtered, activePage]);

  const passedCount = submissions.filter((s) => s.status === 'PASSED').length;
  const evaluatingCount = submissions.filter((s) => s.status === 'EVALUATING').length;
  const needsWorkCount = submissions.filter((s) => s.status === 'NEEDS_WORK').length;

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleFilterChange = (status: 'ALL' | 'PASSED' | 'EVALUATING' | 'NEEDS_WORK') => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const startIndex = filtered.length === 0 ? 0 : (activePage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(activePage * ITEMS_PER_PAGE, filtered.length);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-[24px] bg-white p-6 border border-borderLight shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand text-xs font-black uppercase tracking-wider mb-1">
            <Send className="h-4 w-4" />
            <span>Task Deliverables & Evaluations</span>
          </div>
          <h1 className="text-2xl font-black text-textPrimary">Your Submissions</h1>
          <p className="text-xs text-textMuted mt-1">
            Track AI worker grading scores, rubric breakdown, and automated feedback for your completed tasks.
          </p>
        </div>

        {onNavigateProgram && (
          <button
            onClick={onNavigateProgram}
            className="inline-flex items-center gap-2 rounded-2xl bg-brand px-4 py-2.5 text-xs font-bold text-white hover:bg-brandDark transition-all cursor-pointer shrink-0 shadow-xs"
          >
            <span>Open Workspaces</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Summary KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div
          onClick={() => handleFilterChange('ALL')}
          className={`rounded-[20px] p-4 border transition-all cursor-pointer ${
            filterStatus === 'ALL'
              ? 'bg-brand/5 border-brand ring-2 ring-brand/20'
              : 'bg-white border-borderLight hover:border-borderLight/80'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-textMuted">Total Submissions</div>
          <div className="mt-1 text-2xl font-black text-textPrimary">{submissions.length}</div>
        </div>

        <div
          onClick={() => handleFilterChange('PASSED')}
          className={`rounded-[20px] p-4 border transition-all cursor-pointer ${
            filterStatus === 'PASSED'
              ? 'bg-statusPassedBg border-success ring-2 ring-success/20'
              : 'bg-white border-borderLight hover:border-borderLight/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-statusPassedText">Passed</span>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </div>
          <div className="mt-1 text-2xl font-black text-statusPassedText">{passedCount}</div>
        </div>

        <div
          onClick={() => handleFilterChange('EVALUATING')}
          className={`rounded-[20px] p-4 border transition-all cursor-pointer ${
            filterStatus === 'EVALUATING'
              ? 'bg-statusEvaluatingBg border-warning ring-2 ring-warning/20'
              : 'bg-white border-borderLight hover:border-borderLight/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-statusEvaluatingText">In Evaluation</span>
            <Clock className="h-4 w-4 text-warning" />
          </div>
          <div className="mt-1 text-2xl font-black text-statusEvaluatingText">{evaluatingCount}</div>
        </div>

        <div
          onClick={() => handleFilterChange('NEEDS_WORK')}
          className={`rounded-[20px] p-4 border transition-all cursor-pointer ${
            filterStatus === 'NEEDS_WORK'
              ? 'bg-statusErrorBg border-danger ring-2 ring-danger/20'
              : 'bg-white border-borderLight hover:border-borderLight/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-statusErrorText">Needs Work</span>
            <XCircle className="h-4 w-4 text-danger" />
          </div>
          <div className="mt-1 text-2xl font-black text-statusErrorText">{needsWorkCount}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
          <input
            type="text"
            placeholder="Search by task title or evaluation engine..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-2xl border border-borderLight bg-white py-2.5 pl-10 pr-4 text-xs font-semibold text-textPrimary placeholder:text-textMuted focus:border-brand focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-borderLight shrink-0">
          {(['ALL', 'PASSED', 'EVALUATING', 'NEEDS_WORK'] as const).map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterStatus === status
                  ? 'bg-brand text-white shadow-xs'
                  : 'text-textMuted hover:text-textPrimary'
              }`}
            >
              {status === 'ALL' ? 'All' : status === 'PASSED' ? 'Passed' : status === 'EVALUATING' ? 'Evaluating' : 'Needs Work'}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List Container */}
      <div className="rounded-[24px] border border-borderLight bg-white p-6 shadow-xs space-y-4">
        {filtered.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto">
              <Send className="h-6 w-6" />
            </div>
            <h3 className="text-base font-black text-textPrimary">No task submissions found</h3>
            <p className="text-xs text-textMuted max-w-sm mx-auto">
              {submissions.length === 0
                ? "You haven't submitted any workspace tasks yet. Navigate to your enrolled program to submit your first milestone!"
                : "No submissions matched your current search or status filter."}
            </p>
            {onNavigateProgram && (
              <button
                onClick={onNavigateProgram}
                className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-xs font-bold text-white hover:bg-brandDark transition-all cursor-pointer"
              >
                <span>Go to Program Workspaces</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paginatedItems.map((sub: any) => {
                const isExpanded = expandedId === sub.id;
                const formattedDate = sub.submittedAt
                  ? new Date(sub.submittedAt).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Recent';

                return (
                  <div
                    key={sub.id}
                    className="rounded-2xl border border-borderLight/80 bg-bgSoft/50 hover:bg-bgSoft transition-all p-4 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                            sub.status === 'PASSED'
                              ? 'bg-statusPassedBg text-statusPassedText'
                              : sub.status === 'EVALUATING'
                              ? 'bg-statusEvaluatingBg text-statusEvaluatingText'
                              : 'bg-statusErrorBg text-statusErrorText'
                          }`}
                        >
                          {sub.status === 'PASSED' ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : sub.status === 'EVALUATING' ? (
                            <Clock className="h-5 w-5 animate-pulse" />
                          ) : (
                            <XCircle className="h-5 w-5" />
                          )}
                        </div>

                        <div>
                          <div className="text-sm font-extrabold text-textPrimary">
                            {sub.taskTitle || sub.stepTitle || `Deliverable #${sub.id}`}
                          </div>
                          <div className="text-[11px] font-medium text-textMuted mt-0.5 flex items-center gap-2">
                            <span>{formattedDate}</span>
                            <span>•</span>
                            <span>{sub.evaluator || 'AI Reviewer Engine'}</span>
                            {sub.attemptIndex && (
                              <>
                                <span>•</span>
                                <span>Attempt #{sub.attemptIndex}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {sub.score !== null && sub.score !== undefined && (
                          <div className="text-right">
                            <div className="text-base font-black text-statusPassedText">
                              {sub.score} <span className="text-xs font-bold text-textMuted">/ {sub.maxScore || 100}</span>
                            </div>
                            <div className="text-[10px] font-semibold text-textMuted">AI Evaluated</div>
                          </div>
                        )}

                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase ${
                            sub.status === 'PASSED'
                              ? 'bg-statusPassedBg text-statusPassedText'
                              : sub.status === 'EVALUATING'
                              ? 'bg-statusEvaluatingBg text-statusEvaluatingText'
                              : 'bg-statusErrorBg text-statusErrorText'
                          }`}
                        >
                          {sub.status}
                        </span>

                        {(sub.feedback || (sub.criteriaBreakdown && Array.isArray(sub.criteriaBreakdown))) && (
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                            className="rounded-xl border border-borderLight bg-white px-2.5 py-1 text-[11px] font-bold text-textPrimary hover:bg-bgSoft transition-all cursor-pointer"
                          >
                            {isExpanded ? 'Hide Details' : 'Details'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expanded Breakdown & AI Feedback Section */}
                    {isExpanded && (
                      <div className="mt-3 border-t border-borderLight/80 pt-3 space-y-3">
                        {sub.feedback && (
                          <div className="rounded-xl bg-white border border-borderLight/80 p-3 text-xs">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-brand mb-1">
                              <ShieldCheck className="h-4 w-4" />
                              <span>AI Evaluator Feedback:</span>
                            </div>
                            <p className="text-textPrimary italic">&quot;{sub.feedback}&quot;</p>
                          </div>
                        )}

                        {Array.isArray(sub.criteriaBreakdown) && sub.criteriaBreakdown.length > 0 && (
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-textMuted">
                              Rubric Criteria Evaluation:
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2">
                              {sub.criteriaBreakdown.map((crit: any, cIdx: number) => (
                                <div
                                  key={cIdx}
                                  className="rounded-xl bg-white border border-borderLight/60 p-2.5 flex items-center justify-between text-xs"
                                >
                                  <span className="font-semibold text-textPrimary truncate">{crit.criterion}</span>
                                  <span className="font-black text-statusPassedText shrink-0 ml-2">
                                    {crit.score} / {crit.maxScore}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-borderLight">
                <div className="text-xs text-textMuted font-medium">
                  Showing <span className="font-bold text-textPrimary">{startIndex}</span> to{' '}
                  <span className="font-bold text-textPrimary">{endIndex}</span> of{' '}
                  <span className="font-bold text-textPrimary">{filtered.length}</span> submissions
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={activePage <= 1}
                    className="flex h-8 items-center gap-1 rounded-xl border border-borderLight bg-white px-3 text-xs font-bold text-textPrimary transition-all hover:bg-bgSoft disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-8 min-w-[32px] rounded-xl px-2 text-xs font-bold transition-all cursor-pointer ${
                          activePage === pageNum
                            ? 'bg-brand text-white shadow-xs'
                            : 'border border-borderLight bg-white text-textPrimary hover:bg-bgSoft'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={activePage >= totalPages}
                    className="flex h-8 items-center gap-1 rounded-xl border border-borderLight bg-white px-3 text-xs font-bold text-textPrimary transition-all hover:bg-bgSoft disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
