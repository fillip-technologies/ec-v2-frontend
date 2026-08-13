'use client';

import React from 'react';
import { Project } from '@/types/catalog';
import { Can } from '@/components/auth/Can';
import { CheckCircle2, Circle, Lock, Play, Edit3, Plus, ExternalLink, FileText } from 'lucide-react';

interface SharedProjectsViewProps {
  projects: Project[];
  activeProjectId?: number;
  onSelectProject?: (project: Project) => void;
  onEditProject?: (project: Project) => void;
  onSubmitTaskWork?: (projectId: number, stepId: number, taskId: number) => void;
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
        const steps = project.workspaceTemplate?.steps || [];

        return (
          <div
            key={project.id || projIdx}
            className={`rounded-[24px] border bg-white p-6 shadow-sm transition-all ${
              isSelected ? 'border-brand ring-2 ring-brand/10' : 'border-borderLight'
            }`}
          >
            {/* Project Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-borderLight pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-bold text-brand">
                    Project #{projIdx + 1}
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

            {/* Template Steps & Tasks List */}
            <div className="mt-5 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-textMuted">
                Blueprint Steps & Deliverables ({steps.length} Steps)
              </div>

              <div className="grid gap-3">
                {steps.map((step, sIdx) => (
                  <div
                    key={step.id || sIdx}
                    className="rounded-[18px] border border-borderLight/80 bg-bgSoft/50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                            (step as any).status === 'PASSED'
                              ? 'bg-statusPassedBg text-statusPassedText'
                              : (step as any).status === 'OPEN'
                              ? 'bg-brand/10 text-brand'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {(step as any).status === 'PASSED' ? '✓' : sIdx + 1}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-textPrimary">{step.title}</h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                            (step as any).status === 'PASSED'
                              ? 'bg-statusPassedBg text-statusPassedText'
                              : (step as any).status === 'OPEN'
                              ? 'bg-brand text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {(step as any).status || 'OPEN'}
                        </span>

                        <Can do="project:edit">
                          <button className="text-[11px] font-semibold text-brand hover:underline">
                            + Edit Rubric
                          </button>
                        </Can>
                      </div>
                    </div>

                    <p className="mt-1 text-[11px] text-textMuted pl-8">{step.description}</p>

                    {/* Step Tasks */}
                    {step.tasks && step.tasks.length > 0 && (
                      <div className="mt-3 pl-8 space-y-2">
                        {step.tasks.map((task, tIdx) => (
                          <div
                            key={task.id || tIdx}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-borderLight/60 bg-white p-2.5 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <Circle className="h-3.5 w-3.5 text-textMuted" />
                              <span className="font-medium text-textPrimary">{task.title}</span>
                            </div>

                            <div className="flex items-center gap-3">
                              {/* Task Resources */}
                              {task.resources && task.resources.length > 0 && (
                                <div className="flex items-center gap-2">
                                  {task.resources.map((res) => (
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

                              <button
                                onClick={() => onSubmitTaskWork?.(project.id, step.id, task.id)}
                                className="rounded-lg bg-brand/10 px-2.5 py-1 text-[11px] font-bold text-brand hover:bg-brand/20 transition-all"
                              >
                                Submit Work
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
