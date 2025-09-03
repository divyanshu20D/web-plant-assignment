"use client";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { setProjects, deleteProject } from "@/store/slices/projects-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState, useEffect } from "react";
import NavBar from "@/components/nav-bar";
import ProjectCard from "@/components/project-card";
import ProjectDialog from "@/components/project-dialog";
import { Plus } from "lucide-react";
import { projectApi, ApiError, taskApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";

export default function ProjectsPage() {
  const { projects } = useSelector((s: RootState) => s.projects);
  const user = useSelector((s: RootState) => s.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const debouncedQuery = useDebounce(q, 300); // 300ms debounce delay

  // Load projects from API
  const loadProjects = async () => {
    try {
      const response = await projectApi.getAll();
      // For each project, fetch tasks to compute counts
      const projectsWithTasks = await Promise.all(
        response.projects.map(async (p: any) => {
          try {
            const { tasks } = await taskApi.getByProject(p._id || p.id);
            return {
              id: p._id || p.id,
              title: p.title,
              description: p.description,
              tasks: tasks.map((t: any) => ({
                id: t._id || t.id,
                title: t.title,
                description: t.description,
                status: t.status,
                dueDate: t.dueDate,
              })),
            };
          } catch {
            // If tasks fetch fails, still return project without tasks
            return {
              id: p._id || p.id,
              title: p.title,
              description: p.description,
              tasks: [],
            };
          }
        })
      );
      dispatch(setProjects(projectsWithTasks));
    } catch (error) {
      console.error("Load projects error:", error);

      if (error instanceof ApiError && error.status === 401) {
        toast({
          title: "Error",
          description: "Please login to continue",
          variant: "destructive",
        });
        router.push("/login");
        return;
      }

      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDeleteProject = async (id: string) => {
    try {
      await projectApi.delete(id);
      dispatch(deleteProject({ id }));
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (error) {
      console.error("Delete project error:", error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const filtered = useMemo(() => {
    const t = debouncedQuery.trim().toLowerCase();
    if (!t) return projects;
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(t) ||
        (p.description ?? "").toLowerCase().includes(t)
    );
  }, [projects, debouncedQuery]);

  return (
    <main>
      <NavBar />
      <section className="mx-auto max-w-5xl px-4 py-6 grid gap-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-pretty">Projects</h1>
          <ProjectDialog
            trigger={
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> New project
              </Button>
            }
            onSuccess={loadProjects}
          />
        </div>
        {/* 
        {!user && (
          <p className="text-sm text-amber-600">
            Note: Authentication is frontend-only. Hook it to your backend and JWT later.
          </p>
        )} */}

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Input
              placeholder="Search projects"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {q !== debouncedQuery && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p>Loading projects...</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onEdit={() =>
                    // open dialog with defaults
                    (
                      document.getElementById(
                        `edit-${p.id}`
                      ) as HTMLButtonElement
                    )?.click()
                  }
                  onDelete={() => handleDeleteProject(p.id)}
                />
              ))}
            </div>

            {filtered.length === 0 && !loading && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {debouncedQuery
                    ? "No projects found matching your search."
                    : "No projects yet. Create your first project!"}
                </p>
              </div>
            )}

            {/* Hidden edit dialogs to keep code simple */}
            {filtered.map((p) => (
              <ProjectDialog
                key={p.id}
                trigger={<button id={`edit-${p.id}`} className="hidden" />}
                defaultValues={{
                  title: p.title,
                  description: p.description,
                  id: p.id,
                }}
                onSuccess={loadProjects}
              />
            ))}
          </>
        )}
      </section>
    </main>
  );
}
