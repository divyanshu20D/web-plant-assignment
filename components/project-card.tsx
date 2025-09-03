"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { Pencil, Trash } from "lucide-react";
import ConfirmationDialog from "@/components/confirmation-dialog";

type Props = {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ProjectCard({ project, onEdit, onDelete }: Props) {
  const todo = project.tasks.filter((t) => t.status === "todo").length;
  const doing = project.tasks.filter((t) => t.status === "in-progress").length;
  const done = project.tasks.filter((t) => t.status === "done").length;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-pretty">{project.title}</CardTitle>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={onEdit}
              aria-label="Edit project"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <ConfirmationDialog
              trigger={
                <Button size="icon" variant="ghost" aria-label="Delete project">
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              }
              title="Delete Project"
              description={`Are you sure you want to delete "${project.title}"? This action cannot be undone and will also delete all tasks in this project.`}
              confirmText="Delete"
              onConfirm={onDelete}
              variant="destructive"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pb-2">
        {project.description ? (
          <p className="text-sm text-slate-600">{project.description}</p>
        ) : (
          <p className="text-sm text-slate-400">No description</p>
        )}
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Todo {todo}</Badge>
          <Badge className="bg-blue-600 text-white hover:bg-blue-600">
            Doing {doing}
          </Badge>
          <Badge className="bg-emerald-500 text-white hover:bg-emerald-500">
            Done {done}
          </Badge>
        </div>
        <Link href={`/projects/${project.id}`}>
          <Button className="w-full">Open</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
