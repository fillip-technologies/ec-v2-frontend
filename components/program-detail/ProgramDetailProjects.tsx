"use client";

import React, { useState } from "react";
import { FolderGit2, ChevronDown, CheckCircle2, FileText, ExternalLink, Code2, Cpu } from "lucide-react";
import { Project, TemplateStep, TemplateTask, Resource } from "@/types/catalog";

interface ProgramDetailProjectsProps {
  projects?: Project[];
}

export const ProgramDetailProjects: React.FC<ProgramDetailProjectsProps> = ({
  projects = [],
}) => {
  const [activeStepId, setActiveStepId] = useState<number | null>(null);

  if (projects.length === 0) {
    return (
      <div className="rounded-3xl border border-glassBorder bg-white p-8 text-center shadow-sm">
        <FolderGit2 className="mx-auto h-10 w-10 text-brand" />
        <h3 className="mt-3 text-lg font-extrabold text-textPrimary">Capstones Loading</h3>
        <p className="mt-1 text-xs text-textMuted">Capstone projects for this program are being loaded.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {projects.map((project, projIdx) => {
        const template = project.workspaceTemplate;
        const steps = template?.steps || [];

        return (
          <section
            key={project.id}
            className="rounded-3xl border border-glassBorder bg-white p-6 md:p-8 shadow-sm"
          >
            {/* Project Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-borderLight/70 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand">
                  <FolderGit2 className="h-4 w-4" />
                  <span>Capstone Project #{projIdx + 1}</span>
                </div>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-textPrimary">
                  {project.title}
                </h2>
                <p className="mt-1 text-xs font-medium text-textMuted max-w-2xl">
                  {project.description || "Industry client brief capstone built inside guided workspace."}
                </p>
              </div>

              <span className="rounded-full bg-brandSoft px-3 py-1 text-xs font-extrabold text-brand">
                {steps.length} {steps.length === 1 ? "Step" : "Steps"} Blueprint
              </span>
            </div>

            {/* Template Steps & Tasks Accordion */}
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-extrabold text-textPrimary flex items-center gap-2">
                <Code2 className="h-4 w-4 text-brand" /> Guided Workspace Curriculum & Tasks
              </h3>

              {steps.map((step: TemplateStep, stepIdx: number) => {
                const isOpen = activeStepId === step.id || (activeStepId === null && stepIdx === 0);
                const tasks = step.tasks || [];
                const rubric = step.rubric;

                return (
                  <div
                    key={step.id}
                    className="overflow-hidden rounded-2xl border border-borderLight bg-bgBody/70 transition-all"
                  >
                    {/* Step Header Toggle */}
                    <button
                      type="button"
                      onClick={() => setActiveStepId(isOpen ? -1 : step.id)}
                      className="flex w-full items-center justify-between p-4 text-left font-bold transition hover:bg-white cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-brand text-xs font-black text-white">
                          {step.orderIndex || stepIdx + 1}
                        </span>
                        <div>
                          <h4 className="text-sm font-extrabold text-textPrimary">{step.title}</h4>
                          <p className="text-[11px] font-medium text-textMuted line-clamp-1">
                            {step.description || "System blueprint step"}
                          </p>
                        </div>
                      </div>

                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-textMuted transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-brand" : ""
                        }`}
                      />
                    </button>

                    {/* Step Content: Tasks & Task-level Resources */}
                    {isOpen && (
                      <div className="border-t border-borderLight/60 bg-white p-5 space-y-4">
                        {/* Tasks List */}
                        <div className="space-y-3">
                          <h5 className="text-xs font-extrabold uppercase tracking-wider text-textMuted flex items-center gap-1.5">
                             Tasks & Deliverables:
                          </h5>

                          {tasks.length > 0 ? (
                            tasks.map((task: TemplateTask, taskIdx: number) => (
                              <div
                                key={task.id}
                                className="rounded-xl border border-borderLight/60 bg-bgSoft/50 p-3.5 space-y-2"
                              >
                                <div className="flex items-start gap-2.5">
                                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-brand shrink-0" />
                                  <div className="flex-1">
                                    <h6 className="text-xs font-extrabold text-textPrimary">
                                      Task {task.orderIndex || taskIdx + 1}: {task.title}
                                    </h6>
                                    {task.description && (
                                      <p className="mt-0.5 text-[11px] text-textMuted">
                                        {task.description}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Task-Level Resources Attached directly to Task */}
                                {task.resources && task.resources.length > 0 && (
                                  <div className="mt-2.5 pt-2 border-t border-borderLight/50 flex flex-wrap items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-textMuted flex items-center gap-1">
                                      <FileText className="h-3 w-3 text-brand" /> Task Resource:
                                    </span>
                                    {task.resources.map((res: Resource) => (
                                      <a
                                        key={res.id}
                                        href={res.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 rounded-md border border-brand/20 bg-brandSoft px-2 py-0.5 text-[10px] font-extrabold text-brand hover:underline cursor-pointer"
                                      >
                                        <span>{res.title}</span>
                                        <ExternalLink className="h-2.5 w-2.5" />
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-textMuted italic">No explicit tasks assigned to this step.</p>
                          )}
                        </div>

                        {/* Rubric Evaluation Metrics */}
                        {rubric && (
                          <div className="mt-3 rounded-xl bg-bgBody p-3 border border-borderLight/60">
                            <div className="flex items-center justify-between text-xs font-bold text-textPrimary">
                              <span>AI Rubric Pass Threshold:</span>
                              <span className="text-brand font-black">{rubric.passThreshold} / {rubric.maxScore} Score</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};
