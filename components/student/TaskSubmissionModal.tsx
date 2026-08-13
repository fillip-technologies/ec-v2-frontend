'use client';

import React, { useState } from 'react';
import { Send, Link2, CheckSquare, Sparkles, Loader2 } from 'lucide-react';

interface TaskSubmissionModalProps {
  isOpen: boolean;
  stepId: number;
  stepTitle: string;
  onClose: () => void;
  onSubmitSuccess: (data: any) => void;
  submitFn: (workspaceStepId: number, payloadUrl: string) => Promise<any>;
}

export const TaskSubmissionModal: React.FC<TaskSubmissionModalProps> = ({
  isOpen,
  stepId,
  stepTitle,
  onClose,
  onSubmitSuccess,
  submitFn,
}) => {
  const [payloadUrl, setPayloadUrl] = useState<string>('');
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payloadUrl.trim()) {
      setErrorMsg('Please enter a valid GitHub repository or project deliverable URL.');
      return;
    }
    if (!isConfirmed) {
      setErrorMsg('Please check the honor code confirmation before submitting.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const result = await submitFn(stepId, payloadUrl.trim());
      onSubmitSuccess(result);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit work. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg rounded-[28px] border border-borderLight bg-white p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="border-b border-borderLight pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-brand uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>AI Rubric Evaluation Pipeline</span>
          </div>
          <h3 className="mt-1 text-lg font-black text-textPrimary">Submit Task Deliverable</h3>
          <p className="text-xs text-textMuted mt-0.5 max-w-md truncate">{stepTitle}</p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Deliverable URL Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-textPrimary">
              Repository / Deliverable URL <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-textMuted">
                <Link2 className="h-4 w-4" />
              </div>
              <input
                type="url"
                required
                placeholder="https://github.com/username/capstone-repo"
                value={payloadUrl}
                onChange={(e) => setPayloadUrl(e.target.value)}
                className="w-full rounded-2xl border border-borderLight bg-bgSoft/50 py-3 pl-10 pr-4 text-xs font-semibold text-textPrimary placeholder:text-textMuted focus:border-brand focus:bg-white focus:outline-none transition-all"
              />
            </div>
            <p className="text-[11px] text-textMuted">
              Provide your public GitHub repository or deployed project link for AI evaluation.
            </p>
          </div>

          {/* Honor Code Confirmation Checkbox */}
          <label className="flex items-start gap-3 rounded-2xl border border-borderLight/80 bg-bgSoft/60 p-3.5 cursor-pointer hover:bg-bgSoft transition-all">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded-md border-borderLight text-brand focus:ring-brand accent-brand cursor-pointer"
            />
            <span className="text-xs font-semibold text-textPrimary leading-snug">
              I confirm that this submission contains my original project work and is ready for automated AI Rubric evaluation.
            </span>
          </label>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-borderLight">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl px-4 py-2 text-xs font-bold text-textMuted hover:bg-bgSoft hover:text-textPrimary transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !payloadUrl.trim() || !isConfirmed}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white transition-all ${
                loading || !payloadUrl.trim() || !isConfirmed
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-brand hover:bg-brandHover shadow-xs cursor-pointer'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Evaluating with AI...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit for AI Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
