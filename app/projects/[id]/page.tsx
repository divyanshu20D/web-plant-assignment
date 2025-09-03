"use client";

import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/nav-bar";
import TaskCard from "@/components/task-card";
import TaskDialog from "@/components/task-dialog";
import TaskFilters from "@/components/task-filters";
import {
  addTask,
  deleteTask,
  moveTaskStatus,
  setProjectWithTasks,
  setProjects,
  updateTask,
} from "@/store/slices/projects-slice";
import { ArrowLeft, Plus } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import type { Task, TaskStatus } from "@/lib/types";
import { taskApi, projectApi, ApiError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounce";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch();
  const project = useSelector((s: RootState) =>
    s.projects.projects.find((p) => p.id === params.id)
  );

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TaskStatus | "all">("all");
  const [sort, setSort] = useState<"due-asc" | "due-desc" | "created">(
    "created"
  );

  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      if (project || !params.id) return;
      try {
        const { project: apiProject } = await projectApi.getById(params.id);
        const { tasks } = await taskApi.getByProject(params.id);
        dispatch(setProjectWithTasks({ project: apiProject, tasks }));
      } catch (e) {
        const err = e as any;
        if (err?.status === 404) {
          // Let render show Project not found UI
          return;
        }
        toast({
          title: "Error",
          description: "Failed to load project",
          variant: "destructive",
        });
      }
    };
    load();
  }, [dispatch, params.id, project, toast]);

  const tasks = useMemo(() => {
    if (!project) return [];
    let list = [...project.tasks];
    if (status !== "all") list = list.filter((t) => t.status === status);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description ?? "").toLowerCase().includes(q)
      );
    }
    if (sort === "due-asc") {
      list.sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""));
    } else if (sort === "due-desc") {
      list.sort((a, b) => (b.dueDate ?? "").localeCompare(a.dueDate ?? ""));
    }
    return list;
  }, [project, search, status, sort]);

  if (!project) {
    return (
      <main>
        <NavBar />
        <div className="mx-auto max-w-5xl px-4 py-8">
          <Button variant="ghost" onClick={() => router.push("/projects")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to projects
          </Button>
          <p className="mt-4 text-slate-600">Project not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <NavBar />
      <section className="mx-auto max-w-5xl px-4 py-6 grid gap-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Button variant="ghost" onClick={() => router.push("/projects")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <h1 className="text-2xl font-semibold mt-2 text-pretty">
              {project.title}
            </h1>
            {project.description ? (
              <p className="text-slate-600">{project.description}</p>
            ) : null}
          </div>

          <TaskDialog
            trigger={
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> New task
              </Button>
            }
            projectId={project.id}
            onSubmit={(data) =>
              dispatch(addTask({ projectId: project.id, task: data }))
            }
          />
        </div>

        <TaskFilters
          search={search}
          onSearch={setSearch}
          status={status}
          onStatus={setStatus}
          sort={sort}
          onSort={setSort}
        />

        <div className="grid gap-3">
          {tasks.length === 0 && (
            <p className="text-slate-500">No tasks match your filters.</p>
          )}
          {tasks.map((t: Task) => (
            <TaskCard
              key={t.id}
              task={t}
              onEdit={() =>
                (
                  document.getElementById(
                    `edit-task-${t.id}`
                  ) as HTMLButtonElement
                )?.click()
              }
              onDelete={() =>
                dispatch(deleteTask({ projectId: project.id, taskId: t.id }))
              }
              onMove={(next) =>
                dispatch(
                  moveTaskStatus({
                    projectId: project.id,
                    taskId: t.id,
                    status: next,
                  })
                )
              }
            />
          ))}
        </div>

        {/* Hidden edit dialogs for simplicity */}
        {project.tasks.map((t) => (
          <TaskDialog
            key={t.id}
            trigger={<button id={`edit-task-${t.id}`} className="hidden" />}
            defaultValues={t}
            projectId={project.id}
            onSubmit={(data) =>
              dispatch(
                updateTask({ projectId: project.id, task: { ...t, ...data } })
              )
            }
          />
        ))}
      </section>
    </main>
  );
}
