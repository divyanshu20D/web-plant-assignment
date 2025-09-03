"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { TaskStatus } from "@/lib/types"

type Props = {
  search: string
  onSearch: (v: string) => void
  status: TaskStatus | "all"
  onStatus: (s: TaskStatus | "all") => void
  sort: "due-asc" | "due-desc" | "created"
  onSort: (s: "due-asc" | "due-desc" | "created") => void
}

export default function TaskFilters({ search, onSearch, status, onStatus, sort, onSort }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Input placeholder="Search tasks" value={search} onChange={(e) => onSearch(e.target.value)} />
      <Select value={status} onValueChange={(v) => onStatus(v as TaskStatus | "all")}>
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="todo">Todo</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sort} onValueChange={(v) => onSort(v as Props["sort"])}>
        <SelectTrigger>
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="created">Created (Default)</SelectItem>
          <SelectItem value="due-asc">Due date ↑</SelectItem>
          <SelectItem value="due-desc">Due date ↓</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
