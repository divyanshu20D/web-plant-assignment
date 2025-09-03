"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Task, TaskStatus } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { taskApi, ApiError } from "@/lib/api";

type Props = {
  trigger: React.ReactNode;
  projectId: string;
  defaultValues?: Task & { id?: string };
  onSubmit?: (data: Task) => void;
  onSuccess?: () => void;
};

export default function TaskDialog({
  trigger,
  projectId,
  defaultValues,
  onSubmit,
  onSuccess,
}: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [due, setDue] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setTitle(defaultValues?.title ?? "");
      setDescription(defaultValues?.description ?? "");
      setStatus(defaultValues?.status ?? "todo");
      setDue(defaultValues?.dueDate ? defaultValues.dueDate.slice(0, 10) : "");
    }
  }, [open, defaultValues]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        dueDate: due ? new Date(due).toISOString() : undefined,
      };

      if (defaultValues?.id) {
        // Update existing task
        await taskApi.update(defaultValues.id, taskData);
        const updated: Task = {
          id: defaultValues.id,
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          dueDate: taskData.dueDate,
        };
        if (onSubmit) onSubmit(updated);
      } else {
        // Create new task and return server id
        const { task } = await taskApi.create(projectId, taskData);
        const created: Task = {
          id: task._id || task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          dueDate: task.dueDate
            ? new Date(task.dueDate).toISOString()
            : undefined,
        };
        if (onSubmit) onSubmit(created);
      }

      toast({
        title: "Success",
        description: defaultValues?.id
          ? "Task updated successfully"
          : "Task created successfully",
      });

      if (onSuccess) onSuccess();
      setOpen(false);
    } catch (error) {
      console.error("Task save error:", error);

      let errorMessage = "Failed to save task";

      if (error instanceof ApiError) {
        if (error.status === 401) {
          errorMessage = "Please login to continue";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultValues ? "Edit task" : "New task"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <Input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as TaskStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">Todo</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1">
              <Label>Due date</Label>
              <Input
                type="date"
                value={due}
                onChange={(e) => setDue(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : defaultValues?.id ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
