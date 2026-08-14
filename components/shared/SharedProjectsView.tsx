'use client';

import React from 'react';
import { Project } from '@/types/catalog';
import { Can } from '@/components/auth/Can';
import { CheckCircle2, Circle, Lock, Play, Edit3, Plus, ExternalLink, FileText, Clock } from 'lucide-react';

interface SharedProjectsViewProps {
  projects: Project[];
  activeProjectId?: number;
  onSelectProject?: (project: Project) => void;
  onEditProject?: (project: Project) => void;
  onSubmitTaskWork?: (taskId: number, taskTitle: string) => void;
}

export const SharedProjectsView: React.FC<SharedProjectsViewProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onEditProject,
  onSubmitTaskWork,
}) => {
  if (!projects || projects.length === 0) {
    return (
      <div className="rounded-[24px] border border-borderLight bg-white p-8 text-center text-textMuted">
        No projects found for this program.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {projects.map((project, projIdx) => {
        const isSelected = activeProjectId ? activeProjectId === project.id : projIdx === 0;
        const tasks = project.workspaceTemplate?.tasks || [];
        const projectStatus = (project as any).status || (projIdx === 0 ? 'Active' : 'Locked');
        const isProjectLocked = projectStatus === 'Locked';

        return (
          <div
            key={project.id || projIdx}
            className={`rounded-[24px] border p-6 shadow-xs transition-all ${
              isProjectLocked
                ? 'border-borderLight bg-bgSoft/40 opacity-80'
                : isSelected
                ? 'border-brand bg-white ring-2 ring-brand/10'
                : 'border-borderLight bg-white'
            }`}
          >
            {/* Project Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-borderLight pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-bold text-brand">
                    Project #{projIdx + 1}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                      projectStatus === 'Done'
                        ? 'bg-statusPassedBg text-statusPassedText'
                        : projectStatus === 'Active'
                        ? 'bg-brand text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {projectStatus === 'Done' ? '✓ DONE' : projectStatus === 'Active' ? '▶ ACTIVE' : '🔒 LOCKED'}
                  </span>
                  <h3 className="text-lg font-bold text-textPrimary">{project.title}</h3>
                </div>
                <p className="mt-1 text-xs text-textMuted max-w-2xl">{project.description}</p>
              </div>

              {/* Action Buttons: Edit Project button protected by <Can do="project:edit"> */}
              <div className="flex items-center gap-2">
                <Can do="project:edit">
                  <button
                    onClick={() => onEditProject?.(project)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-brand/30 bg-brand/5 px-3 py-1.5 text-xs font-bold text-brand hover:bg-brand/10 transition-all"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit Project</span>
                  </button>
                </Can>
              </div>
            </div>

            {/* Template Tasks List */}
            <div className="mt-5 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-textMuted">
                Blueprint Tasks & Deliverables ({tasks.length} Tasks)
              </div>

              <div className="grid gap-3">
                {tasks.map((task, tIdx) => {
                  const taskStatus = (task as any).status || 'LOCKED';
                  const isTaskLocked = taskStatus === 'LOCKED' || isProjectLocked;
                  const isTaskPassed = taskStatus === 'PASSED';
                  const isTaskNeedsWork = taskStatus === 'NEEDS_WORK';
                  const isTaskPending = taskStatus === 'MANUAL_REVIEW';

                  return (
                    <div
                      key={task.id || tIdx}
                      className={`rounded-[18px] border p-4 transition-all ${
                        isTaskLocked
                          ? 'border-borderLight/60 bg-gray-100/50 opacity-75'
                          : isTaskPassed
                          ? 'border-statusPassedBorder bg-statusPassedBg/30'
                          : isTaskPending
                          ? 'border-warningBorder bg-warningLight/50'
                          : 'border-borderLight/80 bg-bgSoft/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
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
                            {isTaskPassed ? '✓' : isTaskPending ? '⏳' : isTaskLocked ? '🔒' : tIdx + 1}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-textPrimary">{task.title}</h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
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
                            {isTaskPassed ? '✓ PASSED' : isTaskPending ? '⏳ PENDING REVIEW' : isTaskNeedsWork ? '⚠️ NEEDS WORK' : taskStatus === 'OPEN' ? '▶ OPEN' : '🔒 LOCKED'}
                          </span>

                          <Can do="project:edit">
                            <button className="text-[11px] font-semibold text-brand hover:underline">
                              + Edit Rubric
                            </button>
                          </Can>
                        </div>
                      </div>

                      <p className="mt-1 text-[11px] text-textMuted pl-8">{task.description}</p>

                      {/* Task Resources */}
                      {task.resources && task.resources.length > 0 && (
                        <div className="mt-3 pl-8 flex flex-wrap items-center gap-3">
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

                      <div className="mt-3 pl-8 flex justify-end">
                        {isTaskPassed ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-statusPassedBg px-3 py-1.5 text-[11px] font-extrabold text-statusPassedText">
                            <CheckCircle2 className="h-3 w-3 text-success" />
                            <span>Completed</span>
                          </span>
                        ) : isTaskPending ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-statusEvaluatingBg px-3 py-1.5 text-[11px] font-extrabold text-statusEvaluatingText">
                            <Clock className="h-3 w-3 text-warning" />
                            <span>Awaiting Review</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => onSubmitTaskWork?.(task.id ?? tIdx, task.title)}
                            disabled={isTaskLocked}
                            className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all ${
                              isTaskLocked
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-brand text-white hover:bg-brandHover cursor-pointer shadow-xs'
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
    </div>
  );
};
