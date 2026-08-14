'use client';

import React, { useEffect, useState } from 'react';
import { getAdminSubmissions, reviewSubmission } from '@/lib/api/admin';
import { Search, ExternalLink, Loader2, CheckCircle, XCircle, X, Award, Pencil, AlertCircle } from 'lucide-react';

export function AdminSubmissionsView() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'EVALUATING' | 'PASSED' | 'NEEDS_WORK'>('ALL');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Review & Score Modal State
  const [reviewingSub, setReviewingSub] = useState<any | null>(null);
  const [statusDecision, setStatusDecision] = useState<'PASSED' | 'NEEDS_WORK' | 'EVALUATING'>('PASSED');
  const [score, setScore] = useState<number>(85);
  const [feedback, setFeedback] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const data = await getAdminSubmissions();
      if (Array.isArray(data)) {
        setSubmissions(data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleOpenReview = (sub: any) => {
    setReviewingSub(sub);
    const initialStatus = (sub.status as 'PASSED' | 'NEEDS_WORK' | 'EVALUATING') || 'EVALUATING';
    setStatusDecision(initialStatus === 'EVALUATING' ? 'PASSED' : initialStatus);
    setScore(
      sub.score !== undefined && sub.score !== null
        ? Number(sub.score)
        : initialStatus === 'PASSED'
        ? 85
        : initialStatus === 'NEEDS_WORK'
        ? 45
        : 85
    );
    setFeedback(
      sub.feedback ||
        (initialStatus === 'PASSED'
          ? 'Great work! Code verified and passed all requirements.'
          : initialStatus === 'NEEDS_WORK'
          ? 'Please revise your submission according to the task requirements and resubmit.'
          : 'Great work! Implementation and tests verified successfully.')
    );
  };

  const handleStatusDecisionChange = (newStatus: 'PASSED' | 'NEEDS_WORK' | 'EVALUATING') => {
    setStatusDecision(newStatus);
    if (newStatus === 'PASSED') {
      if (score < 60) setScore(85);
      if (!feedback || feedback.includes('revise')) {
        setFeedback('Great work! Code verified and passed all requirements.');
      }
    } else if (newStatus === 'NEEDS_WORK') {
      if (score >= 60) setScore(45);
      if (!feedback || feedback.includes('Great work')) {
        setFeedback('Please revise your submission according to the task requirements and resubmit.');
      }
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingSub) return;

    setSubmittingReview(true);
    try {
      const finalScore = statusDecision === 'EVALUATING' ? 0 : Number(score) || 0;
      const finalFeedback =
        feedback ||
        (statusDecision === 'PASSED'
          ? 'Approved by admin'
          : statusDecision === 'NEEDS_WORK'
          ? 'Changes requested by admin'
          : 'Moved back to evaluating');

      await reviewSubmission(reviewingSub.id, statusDecision, finalScore, finalFeedback);

      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === reviewingSub.id
            ? { ...s, status: statusDecision, score: finalScore, feedback: finalFeedback }
            : s
        )
      );
      setReviewingSub(null);
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const filtered = submissions.filter((sub) => {
    const matchesSearch =
      sub.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.taskTitle?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'ALL' || sub.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-textPrimary">Review Submissions</h2>
          <p className="text-xs text-textMuted mt-0.5">
            Vet and grade student deliverables with scores and mentoring feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchSubmissions}
            className="rounded-xl border border-borderLight/80 bg-white px-3 py-1.5 text-xs font-bold text-textPrimary hover:bg-bgSoft transition-all cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted" />
          <input
            type="text"
            placeholder="Search by student, project, or task..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-borderLight/80 bg-white pl-10 pr-4 py-2 text-xs font-bold focus:border-brand focus:outline-hidden"
          />
        </div>

        <div className="flex rounded-2xl border border-borderLight/80 bg-white p-1">
          {(['ALL', 'EVALUATING', 'PASSED', 'NEEDS_WORK'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-xl px-3 py-1.5 text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                filterStatus === status
                  ? 'bg-brand text-white'
                  : 'text-textMuted hover:text-brand'
              }`}
            >
              {status === 'EVALUATING' ? 'Pending' : status === 'ALL' ? 'All' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs font-bold text-textMuted">Loading submissions...</div>
      ) : error ? (
        <div className="py-12 text-center text-xs font-bold text-danger">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-xs font-bold text-textMuted">No submissions found matching criteria.</div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((sub) => {
            const isPending = sub.status === 'EVALUATING';
            return (
              <div
                key={sub.id}
                className={`rounded-[24px] border p-5 bg-white shadow-xs transition-all ${
                  isPending ? 'border-warningBorder bg-warningLight/15' : 'border-borderLight/80'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-textPrimary">{sub.studentName}</span>
                      <span className="text-[10px] font-semibold text-textMuted">{sub.studentEmail}</span>
                    </div>

                    <div className="text-xs font-bold text-brand">
                      {sub.projectTitle}
                    </div>

                    <div className="text-xs font-semibold text-textPrimary">
                      {sub.taskTitle}
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <a
                        href={sub.payloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-brand hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>View Repository / Submission URL</span>
                      </a>

                      {sub.score !== undefined && sub.score !== null && (
                        <span className="text-[10px] font-bold text-textMuted">
                          Score: <span className="text-textPrimary font-black">{sub.score} / 100</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Pill with Edit Button to the Left */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {updatingId === sub.id && (
                      <Loader2 className="h-4 w-4 animate-spin text-brand" />
                    )}

                    <div
                      className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase border transition-all cursor-default flex items-center gap-1.5 shadow-2xs ${
                        sub.status === 'PASSED'
                          ? 'bg-statusPassedBg text-statusPassedText border-statusPassedBorder'
                          : sub.status === 'NEEDS_WORK'
                          ? 'bg-statusErrorBg text-statusErrorText border-statusErrorBorder'
                          : 'bg-statusEvaluatingBg text-statusEvaluatingText border-statusEvaluatingBorder'
                      }`}
                    >
                      <span>
                        {sub.status === 'PASSED'
                          ? '✓ Passed'
                          : sub.status === 'NEEDS_WORK'
                          ? '✕ Needs Work'
                          : '⏳ Pending Approval'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenReview(sub)}
                      title="Edit submission status & score"
                      className="p-2 rounded-xl bg-bgSoft hover:bg-borderLight text-textPrimary hover:text-brand border border-borderLight transition-all cursor-pointer shadow-2xs"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review, Grade & Mentoring Decision Popup Modal */}
      {reviewingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 selection:bg-brand selection:text-white">
          <div className="relative w-full max-w-lg rounded-[28px] bg-white p-6 sm:p-7 shadow-2xl border border-borderLight space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-borderLight pb-3.5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand/10 text-brand text-[10px] font-black uppercase tracking-wider">
                  <Award className="h-3 w-3" />
                  Review & Grade Deliverable
                </div>
                <h3 className="text-base font-black text-textPrimary">
                  {reviewingSub.studentName}
                </h3>
                <p className="text-xs text-textMuted font-medium">
                  {reviewingSub.projectTitle} • {reviewingSub.taskTitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReviewingSub(null)}
                className="rounded-full p-1.5 text-textMuted hover:bg-bgSoft hover:text-textPrimary transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-5">
              {/* Decision Selector */}
              <div>
                <label className="text-xs font-bold text-textPrimary block mb-2">
                  Status Decision *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusDecisionChange('PASSED')}
                    className={`py-2 px-3 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      statusDecision === 'PASSED'
                        ? 'bg-statusPassedBg text-statusPassedText border-statusPassedBorder shadow-xs ring-2 ring-success/20'
                        : 'bg-bgSoft/60 text-textMuted border-borderLight hover:bg-bgSoft'
                    }`}
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Passed</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusDecisionChange('NEEDS_WORK')}
                    className={`py-2 px-3 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      statusDecision === 'NEEDS_WORK'
                        ? 'bg-statusErrorBg text-statusErrorText border-statusErrorBorder shadow-xs ring-2 ring-danger/20'
                        : 'bg-bgSoft/60 text-textMuted border-borderLight hover:bg-bgSoft'
                    }`}
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    <span>Needs Work</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusDecisionChange('EVALUATING')}
                    className={`py-2 px-3 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      statusDecision === 'EVALUATING'
                        ? 'bg-statusEvaluatingBg text-statusEvaluatingText border-statusEvaluatingBorder shadow-xs ring-2 ring-warning/20'
                        : 'bg-bgSoft/60 text-textMuted border-borderLight hover:bg-bgSoft'
                    }`}
                  >
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Evaluating</span>
                  </button>
                </div>
              </div>

              {/* Score Input & Quick Presets (For PASSED and NEEDS_WORK) */}
              {statusDecision !== 'EVALUATING' ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-textPrimary">
                      Assigned Score (0 - 100) *
                    </label>
                    <span className={`text-xs font-black ${statusDecision === 'PASSED' ? 'text-successDark' : 'text-dangerDark'}`}>
                      {score} / 100
                    </span>
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="w-full rounded-xl bg-bgSoft px-3.5 py-2.5 text-xs font-black text-textPrimary border border-borderLight outline-none focus:border-brand focus:bg-white transition-all"
                  />
                  {/* Score Quick Presets */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[10px] font-bold text-textMuted mr-1">Presets:</span>
                    {(statusDecision === 'PASSED'
                      ? [100, 95, 90, 85, 80, 75]
                      : [55, 50, 45, 35, 20, 0]
                    ).map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setScore(preset)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-black border transition-all cursor-pointer ${
                          score === preset
                            ? statusDecision === 'PASSED'
                              ? 'bg-success text-white border-success'
                              : 'bg-danger text-white border-danger'
                            : 'bg-white text-textPrimary border-borderLight hover:bg-bgSoft'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-warningLight/20 border border-warningBorder text-xs text-warningDark font-semibold">
                  This deliverable will be marked back as <strong>Pending / Evaluating</strong>. No score will be finalized until evaluated.
                </div>
              )}

              {/* Feedback Textarea */}
              <div>
                <label className="text-xs font-bold text-textPrimary block mb-1.5">
                  Mentoring Feedback / Review Instructions
                </label>
                <textarea
                  rows={3}
                  required={statusDecision !== 'EVALUATING'}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={
                    statusDecision === 'PASSED'
                      ? 'Provide approval notes, code praise, or architectural feedback...'
                      : statusDecision === 'NEEDS_WORK'
                      ? 'Explain what requirements were missed, test failures, or changes needed...'
                      : 'Optional review notes...'
                  }
                  className="w-full rounded-xl bg-bgSoft p-3 text-xs font-semibold text-textPrimary border border-borderLight outline-none focus:border-brand focus:bg-white transition-all"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-borderLight">
                <button
                  type="button"
                  onClick={() => setReviewingSub(null)}
                  className="px-4 py-2 rounded-xl border border-borderLight bg-white text-xs font-bold text-textPrimary hover:bg-bgSoft transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className={`px-5 py-2 rounded-xl text-xs font-black text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                    statusDecision === 'PASSED'
                      ? 'bg-success hover:bg-successDark'
                      : statusDecision === 'NEEDS_WORK'
                      ? 'bg-danger hover:bg-dangerDark'
                      : 'bg-warning hover:bg-warningDark'
                  }`}
                >
                  {submittingReview ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving Decision...</span>
                    </>
                  ) : (
                    <span>
                      {statusDecision === 'PASSED'
                        ? 'Pass Deliverable'
                        : statusDecision === 'NEEDS_WORK'
                        ? 'Request Changes'
                        : 'Set Evaluating'}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
