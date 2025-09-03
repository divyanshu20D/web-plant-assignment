"use client"

import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { addProject, deleteProject, updateProject } from "@/store/slices/projects-slice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMemo, useState } from "react"
import NavBar from "@/components/nav-bar"
import ProjectCard from "@/components/project-card"
import ProjectDialog from "@/components/project-dialog"
import { Plus } from "lucide-react"

export default function ProjectsPage() {
  const { projects } = useSelector((s: RootState) => s.projects)
  const user = useSelector((s: RootState) => s.auth.user)
  const dispatch = useDispatch()
  const [q, setQ] = useState("")

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return projects
    return projects.filter((p) => p.title.toLowerCase().includes(t) || (p.description ?? "").toLowerCase().includes(t))
  }, [projects, q])

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
            onSubmit={(data) => dispatch(addProject(data))}
          />
        </div>

        {!user && (
          <p className="text-sm text-amber-600">
            Note: Authentication is frontend-only. Hook it to your backend and JWT later.
          </p>
        )}

        <div className="flex items-center gap-3">
          <Input placeholder="Search projects" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onEdit={() =>
                // open dialog with defaults
                (document.getElementById(`edit-${p.id}`) as HTMLButtonElement)?.click()
              }
              onDelete={() => dispatch(deleteProject({ id: p.id }))}
            />
          ))}
        </div>

        {/* Hidden edit dialogs to keep code simple */}
        {filtered.map((p) => (
          <ProjectDialog
            key={p.id}
            trigger={<button id={`edit-${p.id}`} className="hidden" />}
            defaultValues={{ title: p.title, description: p.description }}
            onSubmit={(data) => dispatch(updateProject({ id: p.id, ...data }))}
          />
        ))}
      </section>
    </main>
  )
}
