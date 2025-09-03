"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { projectApi, ApiError } from "@/lib/api"

type Props = {
  trigger: React.ReactNode
  defaultValues?: { title?: string; description?: string; id?: string }
  onSubmit?: (data: { title: string; description?: string }) => void
  onSuccess?: () => void
}

export default function ProjectDialog({ trigger, defaultValues, onSubmit, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(defaultValues?.title ?? "")
  const [description, setDescription] = useState(defaultValues?.description ?? "")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      setTitle(defaultValues?.title ?? "")
      setDescription(defaultValues?.description ?? "")
    }
  }, [open, defaultValues])

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Project title is required",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const projectData = {
        title: title.trim(),
        description: description.trim() || undefined,
      }

      if (defaultValues?.id) {
        await projectApi.update(defaultValues.id, projectData)
      } else {
        await projectApi.create(projectData)
      }

      toast({
        title: "Success",
        description: defaultValues?.id
          ? "Project updated successfully"
          : "Project created successfully",
      })

      // Call legacy onSubmit for backward compatibility
      if (onSubmit) {
        onSubmit(projectData)
      }

      // Call new onSuccess callback
      if (onSuccess) {
        onSuccess()
      }

      setOpen(false)
    } catch (error) {
      console.error('Project save error:', error)

      let errorMessage = "Failed to save project"

      if (error instanceof ApiError) {
        if (error.status === 401) {
          errorMessage = "Please login to continue"
        } else {
          errorMessage = error.message
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultValues ? "Edit project" : "New project"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <Input placeholder="Project title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea
            placeholder="Short description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : (defaultValues?.id ? "Save" : "Create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
