"use client";

import type { Task, TaskStatus } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { taskApi, ApiError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

function statusBadge(status: TaskStatus) {
  if (status === "done") return "bg-emerald-500 text-white";
  if (status === "in-progress") return "bg-blue-600 text-white";
  return "bg-slate-200 text-slate-800";
}

type Props = {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (next: TaskStatus) => void;
};

export default function TaskCard({ task, onEdit, onDelete, onMove }: Props) {
  const cycle: Record<TaskStatus, TaskStatus> = {
    todo: "in-progress",
    "in-progress": "done",
    done: "todo",
  };

  const next = cycle[task.status];
  const [loadingMove, setLoadingMove] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { toast } = useToast();

  const handleMove = async () => {
    setLoadingMove(true);
    try {
      await taskApi.update(task.id, { status: next });
      onMove(next);
      toast({ title: "Task updated", description: `Moved to ${next}` });
    } catch (e) {
      const err = e as unknown;
      let msg = "Failed to move task";
      if (err instanceof ApiError) {
        msg = err.status === 401 ? "Please login to continue" : err.message;
      }
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoadingMove(false);
    }
  };

  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      await taskApi.delete(task.id);
      onDelete();
      toast({ title: "Task deleted" });
      setConfirmOpen(false);
    } catch (e) {
      const err = e as unknown;
      let msg = "Failed to delete task";
      if (err instanceof ApiError) {
        msg = err.status === 401 ? "Please login to continue" : err.message;
      }
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{task.title}</h4>
              <Badge className={statusBadge(task.status)}>{task.status}</Badge>
            </div>
            {task.description ? (
              <p className="text-sm text-slate-600">{task.description}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={onEdit}
              aria-label="Edit task"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setConfirmOpen(true)}
              aria-label="Delete task"
              disabled={loadingDelete}
            >
              <Trash className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {task.dueDate
              ? `Due: ${new Date(task.dueDate).toLocaleDateString()}`
              : "No due date"}
          </span>
          {task.status !== "done" && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleMove}
              disabled={loadingMove}
            >
              {loadingMove ? "Moving..." : `Move to ${next}`}
            </Button>
          )}
        </div>
      </CardContent>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this task?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            This action cannot be undone. This will permanently delete the task
            "{task.title}".
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={loadingDelete}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loadingDelete}
            >
              {loadingDelete ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
