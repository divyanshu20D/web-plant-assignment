"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Props = {
  trigger: React.ReactNode
  defaultValues?: { title?: string; description?: string }
  onSubmit: (data: { title: string; description?: string }) => void
}

export default function ProjectDialog({ trigger, defaultValues, onSubmit }: Props) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(defaultValues?.title ?? "")
  const [description, setDescription] = useState(defaultValues?.description ?? "")

  useEffect(() => {
    if (open) {
      setTitle(defaultValues?.title ?? "")
      setDescription(defaultValues?.description ?? "")
    }
  }, [open, defaultValues])

  const handleSave = () => {
    if (!title.trim()) return
    onSubmit({ title: title.trim(), description: description.trim() || undefined })
    setOpen(false)
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
          <Button onClick={handleSave}>{defaultValues ? "Save" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
