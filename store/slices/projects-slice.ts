"use client";
import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { Project, Task, TaskStatus } from "@/lib/types";

type ProjectsState = {
  projects: Project[];
};

const initialState: ProjectsState = {
  projects: [],
};

type UpsertProject = { id?: string; title: string; description?: string };

type ApiProject = {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
};

type ApiTask = {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    setProjectWithTasks: (
      state,
      action: PayloadAction<{ project: ApiProject; tasks: ApiTask[] }>
    ) => {
      const { project, tasks } = action.payload;
      const mapped: Project = {
        id: project._id || project.id || nanoid(),
        title: project.title,
        description: project.description,
        tasks: tasks.map((t) => ({
          id: t._id || t.id || nanoid(),
          title: t.title,
          description: t.description,
          status: t.status,
          dueDate: t.dueDate,
        })),
      };
      // Replace list with this single project to ensure detail page has data on refresh
      state.projects = [mapped];
    },
    addProject: (state, action: PayloadAction<UpsertProject>) => {
      state.projects.push({
        id: nanoid(),
        title: action.payload.title,
        description: action.payload.description,
        tasks: [],
      });
    },
    updateProject: (
      state,
      action: PayloadAction<{ id: string; title: string; description?: string }>
    ) => {
      const p = state.projects.find((x) => x.id === action.payload.id);
      if (p) {
        p.title = action.payload.title;
        p.description = action.payload.description;
      }
    },
    deleteProject: (state, action: PayloadAction<{ id: string }>) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload.id);
    },
    addTask: (
      state,
      action: PayloadAction<{ projectId: string; task: Task }>
    ) => {
      const p = state.projects.find((x) => x.id === action.payload.projectId);
      if (p) p.tasks.push(action.payload.task);
    },
    updateTask: (
      state,
      action: PayloadAction<{ projectId: string; task: Task }>
    ) => {
      const p = state.projects.find((x) => x.id === action.payload.projectId);
      if (!p) return;
      const idx = p.tasks.findIndex((t) => t.id === action.payload.task.id);
      if (idx !== -1) p.tasks[idx] = action.payload.task;
    },
    deleteTask: (
      state,
      action: PayloadAction<{ projectId: string; taskId: string }>
    ) => {
      const p = state.projects.find((x) => x.id === action.payload.projectId);
      if (p) p.tasks = p.tasks.filter((t) => t.id !== action.payload.taskId);
    },
    moveTaskStatus: (
      state,
      action: PayloadAction<{
        projectId: string;
        taskId: string;
        status: TaskStatus;
      }>
    ) => {
      const p = state.projects.find((x) => x.id === action.payload.projectId);
      const t = p?.tasks.find((t) => t.id === action.payload.taskId);
      if (t) t.status = action.payload.status;
    },
  },
});

export const {
  setProjects,
  setProjectWithTasks,
  addProject,
  updateProject,
  deleteProject,
  addTask,
  updateTask,
  deleteTask,
  moveTaskStatus,
} = projectsSlice.actions;

export default projectsSlice.reducer;
