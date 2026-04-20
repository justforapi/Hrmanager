"use client";

import { useState } from "react";
import { Job } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { JobForm } from "@/components/forms/JobForm";
import { JobsTable } from "@/components/forms/JobsTable";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PlusCircle } from "lucide-react";

export function JobsManager({ initialJobs }: { initialJobs: Job[] }) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  async function refreshJobs() {
    const response = await fetch("/api/admin/jobs/list");
    if (response.ok) {
      const data = await response.json();
      setJobs(data.jobs);
    }
  }

  async function handleClose(job: Job) {
    await fetch(`/api/admin/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...job, status: "closed" }),
    });
    refreshJobs();
  }

  async function handleDelete(job: Job) {
    await fetch(`/api/admin/jobs/${job.id}`, { method: "DELETE" });
    refreshJobs();
  }

  const openDialog = (job: Job | null = null) => {
    setEditingJob(job);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
          <p className="text-sm text-gray-500">
            Create, edit, and manage your company&apos;s open positions.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] w-[95vw] max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {editingJob ? "Edit Job" : "Create a New Job"}
              </DialogTitle>
              <DialogDescription>
                Fill out the details below to post a new job opening.
              </DialogDescription>
            </DialogHeader>
            <div className="thin-scrollbar max-h-[70vh] overflow-y-auto p-1">
              <JobForm
                initial={editingJob ?? undefined}
                onSuccess={() => {
                  setDialogOpen(false);
                  setEditingJob(null);
                  refreshJobs();
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          title="No Jobs Posted"
          description="Get started by creating your first job posting."
          actionLabel="Create Job"
          onAction={() => openDialog()}
        />
      ) : (
        <JobsTable
          jobs={jobs}
          onEdit={(job) => openDialog(job)}
          onClose={handleClose}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
