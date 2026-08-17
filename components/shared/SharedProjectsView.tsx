'use client';

import React, { useState } from 'react';
import { Project } from '@/types/catalog';
import { Can } from '@/components/auth/Can';
import { updateProjectWorkspaceRepo } from '@/lib/api/student';
import {
  CheckCircle2,
  Edit3,
  ExternalLink,
  FileText,
  Clock,
  AlertCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  GitBranch,
  Code2,
  Link2,
  Loader2,
  X,
} from 'lucide-react';

interface SharedProjectsViewProps {
  projects: Project[];
  activeProjectId?: number;
  onSelectProject?: (project: Project) => void;
  onEditProject?: (project: Project) => void;
  onSubmitTaskWork?: (
    taskId: number,
    taskTitle: string,
    repoUrl?: string,
    workspaceId?: number
  ) => void;
  onRepoUpdated?: () => void;
}

export const SharedProjectsView: React.FC<SharedProjectsViewProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onEditProject,
  onSubmitTaskWork,
  onRepoUpdated,
}) => {
  const [expandedFeedbackTaskIds, setExpandedFeedbackTaskIds] = useState<Record<number, boolean>>({});

  // Repo Setup Modal State
  const [repoModalProject, setRepoModalProject] = useState<Project | null>(null);
  const [repoInput, setRepoInput] = useState<string>('');
  const [savingRepo, setSavingRepo] = useState<boolean>(false);
  const [repoError, setRepoError] = useState<string>('');

  const toggleFeedback = (taskId: number) => {
    setExpandedFeedbackTaskIds((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const handleOpenRepoModal = (project: Project) => {
    setRepoModalProject(project);
    setRepoInput(project.repoUrl || '');
    setRepoError('');
  };

  const handleSaveRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoModalProject) return;

    const workspaceId = repoModalProject.workspaceId;
    if (!workspaceId) {
      setRepoError('No active workspace ID found for this project.');
      return;
    }

    const clean = repoInput.trim();
    if (!clean || !clean.includes('github.com')) {
      setRepoError('Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo).');
      return;
    }

    try {
      setSavingRepo(true);
      setRepoError('');
      await updateProjectWorkspaceRepo(workspaceId, clean);
      setRepoModalProject(null);
      if (onRepoUpdated) onRepoUpdated();
    } catch (err: any) {
      setRepoError(err.message || 'Failed to update repository link.');
    } finally {
      setSavingRepo(false);
    }
  };

  if (!projects || projects.length === 0) {
    return (
      <div className="rounded-[24px] border border-borderLight bg-white p-8 text-center text-textMuted">
        No projects found for this program.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {projects.map((project, pIdx) => {
        const isProjectActive = project.status === 'Active' || project.status === 'ACTIVE';
        const isProjectDone = project.status === 'Done' || project.status === 'DONE';
        const isProjectLocked = project.status === 'Locked' || project.status === 'LOCKED';

        // Extract tasks from workspaceTemplate or directly
        const tasks = project.workspaceTemplate?.tasks || [];
        const projectRepoUrl = project.repoUrl || project.workspaceTemplate?.repoUrl;

        return (
          <div
            key={project.id}
            className={`rounded-[28px] border bg-white p-6 transition-all sm:p-8 ${
              isProjectActive
                ? 'border-brand/40 shadow-md ring-1 ring-brand/20'
                : isProjectDone
                ? 'border-statusPassedBorder shadow-xs'
                : 'border-borderLight opacity-70'
            }`}
          >
            {/* Project Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-borderLight pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                      isProjectDone
                        ? 'bg-statusPassedBg text-statusPassedText'
                        : isProjectActive
                        ? 'bg-brand text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    Capstone {pIdx + 1} • {project.status}
                  </span>
                  {project.hours && (
                    <span className="text-xs font-semibold text-textMuted">
                      {project.hours} Hours
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black text-textPrimary">{project.title}</h3>
                <p className="mt-1 text-xs text-textMuted max-w-2xl">{project.description}</p>
              </div>

              {/* Action Buttons: Edit Project button protected by <Can do="project:edit"> */}
              <div className="flex items-center gap-2">
                <Can do="project:edit">
                  <button
                    onClick={() => onEditProject?.(project)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-brand/30 bg-brand/5 px-3 py-1.5 text-xs font-bold text-brand hover:bg-brand/10 transition-all cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit Project</span>
                  </button>
                </Can>
              </div>
            </div>

            {/* GitHub Repository Bar for this Project */}
            <div className="mt-4 rounded-2xl bg-bgSoft/80 p-3.5 border border-borderLight flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {projectRepoUrl ? (
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-textPrimary text-white">
                    <Code2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-textMuted">
                      Project GitHub Repository
                    </div>
                    <a
                      href={projectRepoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono font-bold text-brand hover:underline truncate block"
                    >
                      {projectRepoUrl.replace(/^https?:\/\//, '')} ↗
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-bold text-textMuted">
                  <GitBranch className="h-4 w-4 text-brand shrink-0" />
                  <span>⚡ Link your GitHub repository for this project to start submitting task commit hashes.</span>
                </div>
              )}

              {project.workspaceId && (
                <button
                  type="button"
                  onClick={() => handleOpenRepoModal(project)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                    projectRepoUrl
                      ? 'border border-borderLight bg-white text-textPrimary hover:bg-bgSoft'
                      : 'bg-brand text-white hover:bg-brandDark shadow-xs'
                  }`}
                >
                  {projectRepoUrl ? 'Change Repo' : 'Connect GitHub Repo'}
                </button>
              )}
            </div>

            {/* Template Tasks List */}
            <div className="mt-5 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-textMuted">
                Blueprint Tasks & Deliverables ({tasks.length} Tasks)
              </div>

              <div className="grid gap-3">
                {tasks.map((task: any, tIdx: number) => {
                  const taskId = task.id ?? tIdx;
                  const taskStatus = task.status || 'LOCKED';
                  const isTaskLocked = taskStatus === 'LOCKED' || isProjectLocked;
                  const isTaskPassed = taskStatus === 'PASSED';
                  const isTaskNeedsWork = taskStatus === 'NEEDS_WORK';
                  const isTaskPending = taskStatus === 'MANUAL_REVIEW' || taskStatus === 'EVALUATING';
                  const review = task.latestReview;
                  const isFeedbackOpen = expandedFeedbackTaskIds[taskId] ?? isTaskNeedsWork;

                  return (
                    <div
                      key={taskId}
                      className={`rounded-[20px] border p-4 transition-all ${
                        isTaskLocked
                          ? 'border-borderLight/60 bg-gray-100/50 opacity-75'
                          : isTaskPassed
                          ? 'border-statusPassedBorder bg-statusPassedBg/20'
                          : isTaskNeedsWork
                          ? 'border-statusErrorBorder bg-statusErrorBg/25 ring-1 ring-danger/20'
                          : isTaskPending
                          ? 'border-statusEvaluatingBorder bg-statusEvaluatingBg/30'
                          : 'border-borderLight/80 bg-bgSoft/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shrink-0 ${
                              isTaskPassed
                                ? 'bg-statusPassedBg text-statusPassedText'
                                : taskStatus === 'OPEN'
                                ? 'bg-brand text-white'
                                : isTaskPending
                                ? 'bg-statusEvaluatingBg text-statusEvaluatingText'
                                : isTaskNeedsWork
                                ? 'bg-statusErrorBg text-statusErrorText'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                          >
                            {isTaskPassed ? '✓' : isTaskPending ? '⏳' : isTaskNeedsWork ? '✕' : isTaskLocked ? '🔒' : tIdx + 1}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-textPrimary">{task.title}</h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          {review?.score !== undefined && review?.score !== null && (
                            <span
                              className={`rounded-lg px-2 py-0.5 text-[10px] font-black ${
                                isTaskPassed
                                  ? 'bg-statusPassedBg text-statusPassedText border border-statusPassedBorder'
                                  : 'bg-statusErrorBg text-statusErrorText border border-statusErrorBorder'
                              }`}
                            >
                              Score: {review.score} / {review.maxScore || 100}
                            </span>
                          )}

                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                              isTaskPassed
                                ? 'bg-statusPassedBg text-statusPassedText'
                                : taskStatus === 'OPEN'
                                ? 'bg-brand text-white'
                                : isTaskPending
                                ? 'bg-statusEvaluatingBg text-statusEvaluatingText'
                                : isTaskNeedsWork
                                ? 'bg-statusErrorBg text-statusErrorText'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {isTaskPassed
                              ? '✓ PASSED'
                              : isTaskPending
                              ? '⏳ PENDING REVIEW'
                              : isTaskNeedsWork
                              ? '⚠️ NEEDS WORK'
                              : taskStatus === 'OPEN'
                              ? '▶ OPEN'
                              : '🔒 LOCKED'}
                          </span>

                          <Can do="project:edit">
                            <button className="text-[11px] font-semibold text-brand hover:underline cursor-pointer">
                              + Edit Rubric
                            </button>
                          </Can>
                        </div>
                      </div>

                      <p className="mt-1 text-[11px] text-textMuted pl-8">{task.description}</p>

                      {/* Task Resources */}
                      {task.resources && task.resources.length > 0 && (
                        <div className="mt-2.5 pl-8 flex flex-wrap items-center gap-3">
                          {task.resources.map((res: any) => (
                            <a
                              key={res.id}
                              href={res.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand hover:underline"
                            >
                              {res.type === 'DOCUMENT' ? (
                                <FileText className="h-3 w-3" />
                              ) : (
                                <ExternalLink className="h-3 w-3" />
                              )}
                              <span>{res.title}</span>
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Evaluator Review Feedback Box (For NEEDS_WORK or Passed feedback) */}
                      {review && (review.feedback || (review.criteriaBreakdown && review.criteriaBreakdown.length > 0)) && (
                        <div className="mt-3 ml-8 space-y-2">
                          {isTaskPassed && (
                            <button
                              type="button"
                              onClick={() => toggleFeedback(taskId)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-brand hover:underline cursor-pointer"
                            >
                              <ShieldCheck className="h-3.5 w-3.5" />
                              <span>{isFeedbackOpen ? 'Hide Evaluator Feedback' : 'View Evaluator Feedback'}</span>
                              {isFeedbackOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            </button>
                          )}

                          {isFeedbackOpen && (
                            <div
                              className={`rounded-2xl border p-3.5 space-y-2.5 text-xs ${
                                isTaskNeedsWork
                                  ? 'border-statusErrorBorder bg-white/90 shadow-2xs'
                                  : 'border-statusPassedBorder bg-white/90'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2 border-b border-borderLight/60 pb-2">
                                <div className="flex items-center gap-1.5 font-black text-xs">
                                  {isTaskNeedsWork ? (
                                    <>
                                      <AlertCircle className="h-4 w-4 text-danger shrink-0" />
                                      <span className="text-statusErrorText">
                                        Reviewer Feedback & Instructions
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <ShieldCheck className="h-4 w-4 text-success shrink-0" />
                                      <span className="text-statusPassedText">
                                        Evaluator Review Notes
                                      </span>
                                    </>
                                  )}
                                </div>

                                <div className="text-[10px] font-extrabold text-textMuted">
                                  Pass Threshold: ≥{review.passThreshold || 60} / {review.maxScore || 100}
                                </div>
                              </div>

                              {/* Feedback Text */}
                              {review.feedback && (
                                <div className="space-y-1">
                                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-textMuted">
                                    Feedback / Instructions:
                                  </span>
                                  <p className="rounded-xl bg-bgSoft/80 p-2.5 text-xs font-semibold text-textPrimary italic leading-relaxed border border-borderLight/40">
                                    &ldquo;{review.feedback}&rdquo;
                                  </p>
                                </div>
                              )}

                              {/* Rubric Criteria Breakdown */}
                              {Array.isArray(review.criteriaBreakdown) && review.criteriaBreakdown.length > 0 && (
                                <div className="space-y-1.5 pt-1">
                                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-textMuted block">
                                    Rubric Criteria Breakdown:
                                  </span>
                                  <div className="grid gap-1.5 sm:grid-cols-2">
                                    {review.criteriaBreakdown.map((crit: any, cIdx: number) => (
                                      <div
                                        key={cIdx}
                                        className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-bgSoft border border-borderLight/60 text-xs"
                                      >
                                        <span className="font-semibold text-textPrimary truncate mr-2">
                                          {crit.criterion || crit.name || `Criterion ${cIdx + 1}`}
                                        </span>
                                        <span
                                          className={`font-black text-[11px] shrink-0 ${
                                            crit.score >= (crit.maxScore || 10) * 0.6
                                              ? 'text-statusPassedText'
                                              : 'text-statusErrorText'
                                          }`}
                                        >
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
                      )}

                      {/* Action Submission Buttons */}
                      <div className="mt-3 pl-8 flex items-center justify-end gap-2">
                        {isTaskPassed ? (
                          <span className="inline-flex items-center gap-1 rounded-xl bg-statusPassedBg px-3 py-1.5 text-[11px] font-extrabold text-statusPassedText border border-statusPassedBorder">
                            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                            <span>Passed</span>
                          </span>
                        ) : isTaskPending ? (
                          <span className="inline-flex items-center gap-1 rounded-xl bg-statusEvaluatingBg px-3 py-1.5 text-[11px] font-extrabold text-statusEvaluatingText border border-statusEvaluatingBorder">
                            <Clock className="h-3.5 w-3.5 text-warning animate-pulse" />
                            <span>Awaiting Review</span>
                          </span>
                        ) : isTaskNeedsWork ? (
                          <button
                            onClick={() =>
                              onSubmitTaskWork?.(taskId, task.title, projectRepoUrl, project.workspaceId)
                            }
                            className="inline-flex items-center gap-1.5 rounded-xl bg-danger px-4 py-2 text-xs font-black text-white hover:bg-dangerDark transition-all cursor-pointer shadow-xs"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                            <span>Revise & Resubmit Work</span>
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              onSubmitTaskWork?.(taskId, task.title, projectRepoUrl, project.workspaceId)
                            }
                            disabled={isTaskLocked}
                            className={`rounded-xl px-4 py-2 text-xs font-black transition-all ${
                              isTaskLocked
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-brand text-white hover:bg-brandDark cursor-pointer shadow-xs'
                            }`}
                          >
                            Submit Work
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      {/* GitHub Repository Connection Modal */}
      {repoModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-[28px] border border-borderLight bg-white p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-borderLight pb-3">
              <div className="flex items-center gap-2 text-textPrimary">
                <Code2 className="h-5 w-5 text-brand" />
                <h3 className="text-base font-black">Link GitHub Repository</h3>
              </div>
              <button
                type="button"
                onClick={() => setRepoModalProject(null)}
                className="p-1 rounded-full text-textMuted hover:bg-bgSoft hover:text-textPrimary transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-textMuted font-medium">
              Configure the GitHub repository for <strong>{repoModalProject.title}</strong>. All task submissions will reference this repository.
            </p>

            {repoError && (
              <div className="rounded-xl border border-dangerBorder bg-dangerLight p-2.5 text-xs font-bold text-dangerDark flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-danger" />
                <span>{repoError}</span>
              </div>
            )}

            <form onSubmit={handleSaveRepo} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-textPrimary">
                  GitHub Repository URL <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-textMuted">
                    <Link2 className="h-4 w-4" />
                  </div>
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/username/capstone-repo"
                    value={repoInput}
                    onChange={(e) => setRepoInput(e.target.value)}
                    className="w-full rounded-xl border border-borderLight bg-bgSoft/50 py-2.5 pl-10 pr-3.5 text-xs font-semibold text-textPrimary placeholder:text-textMuted focus:border-brand focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-borderLight">
                <button
                  type="button"
                  onClick={() => setRepoModalProject(null)}
                  disabled={savingRepo}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-textMuted hover:bg-bgSoft hover:text-textPrimary transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingRepo || !repoInput.trim()}
                  className="px-5 py-2 rounded-xl bg-brand text-xs font-black text-white hover:bg-brandDark shadow-xs transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {savingRepo ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Linking Repo...</span>
                    </>
                  ) : (
                    <span>Save Repository</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
