export type TaskStatus = "todo" | "in-progress" | "done"

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  dueDate?: string // ISO
}

export interface Project {
  id: string
  title: string
  description?: string
  tasks: Task[]
}
