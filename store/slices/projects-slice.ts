"use client"
import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit"
import type { Project, Task, TaskStatus } from "@/lib/types"

type ProjectsState = {
  projects: Project[]
}

const initialState: ProjectsState = {
  projects: [
    {
      id: "p1",
      title: "Website Redesign",
      description: "Update landing page and docs",
      tasks: [
        {
          id: "t1",
          title: "Hero section",
          description: "Tight copy + CTA",
          status: "in-progress",
          dueDate: new Date(Date.now() + 86400000).toISOString(),
        },
        {
          id: "t2",
          title: "Pricing table",
          status: "todo",
          dueDate: new Date(Date.now() + 3 * 86400000).toISOString(),
        },
        {
          id: "t3",
          title: "Changelog page",
          status: "done",
          dueDate: new Date(Date.now() - 2 * 86400000).toISOString(),
        },
      ],
    },
    {
      id: "p2",
      title: "Mobile App",
      description: "MVP iOS/Android",
      tasks: [
        { id: "t4", title: "Auth screens", status: "todo" },
        { id: "t5", title: "Offline cache", status: "todo" },
      ],
    },
  ],
}

type UpsertProject = { id?: string; title: string; description?: string }

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    addProject: (state, action: PayloadAction<UpsertProject>) => {
      state.projects.push({
        id: nanoid(),
        title: action.payload.title,
        description: action.payload.description,
        tasks: [],
      })
    },
    updateProject: (state, action: PayloadAction<{ id: string; title: string; description?: string }>) => {
      const p = state.projects.find((x) => x.id === action.payload.id)
      if (p) {
        p.title = action.payload.title
        p.description = action.payload.description
      }
    },
    deleteProject: (state, action: PayloadAction<{ id: string }>) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload.id)
    },
    addTask: (state, action: PayloadAction<{ projectId: string; task: Omit<Task, "id"> }>) => {
      const p = state.projects.find((x) => x.id === action.payload.projectId)
      if (p) p.tasks.push({ ...action.payload.task, id: nanoid() })
    },
    updateTask: (state, action: PayloadAction<{ projectId: string; task: Task }>) => {
      const p = state.projects.find((x) => x.id === action.payload.projectId)
      if (!p) return
      const idx = p.tasks.findIndex((t) => t.id === action.payload.task.id)
      if (idx !== -1) p.tasks[idx] = action.payload.task
    },
    deleteTask: (state, action: PayloadAction<{ projectId: string; taskId: string }>) => {
      const p = state.projects.find((x) => x.id === action.payload.projectId)
      if (p) p.tasks = p.tasks.filter((t) => t.id !== action.payload.taskId)
    },
    moveTaskStatus: (
      state,
      action: PayloadAction<{
        projectId: string
        taskId: string
        status: TaskStatus
      }>,
    ) => {
      const p = state.projects.find((x) => x.id === action.payload.projectId)
      const t = p?.tasks.find((t) => t.id === action.payload.taskId)
      if (t) t.status = action.payload.status
    },
  },
})

export const { addProject, updateProject, deleteProject, addTask, updateTask, deleteTask, moveTaskStatus } =
  projectsSlice.actions

export default projectsSlice.reducer
