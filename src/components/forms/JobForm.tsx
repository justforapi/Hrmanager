"use client";

import { useRef, useState } from "react";
import { Job } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, PlusCircle, Trash2 } from "lucide-react";

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
    <div className="md:col-span-1">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
    <div className="rounded-2xl border border-gray-200/80 bg-white/60 p-6 shadow-sm backdrop-blur-lg md:col-span-2">
      <div className="space-y-6">{children}</div>
    </div>
  </div>
);

const Field = ({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) => (
  <div>
    <Label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label}
    </Label>
    <div className="mt-2">{children}</div>
  </div>
);

export function JobForm({
  onSuccess,
  initial,
}: {
  onSuccess?: () => void;
  initial?: Job;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [screeningQuestions, setScreeningQuestions] = useState<string[]>(
    initial?.screening_questions?.length ? initial.screening_questions : [""]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const parseNumber = (value: FormDataEntryValue | null) => {
      if (!value) return null;
      const parsed = Number(value);
      return isNaN(parsed) ? null : parsed;
    };

    const payload = {
      title: formData.get("title"),
      department: formData.get("department"),
      location: formData.get("location"),
      description,
      requirements: formData.get("requirements"),
      employment_type: formData.get("employment_type"),
      remote_type: formData.get("remote_type"),
      education_level: formData.get("education_level"),
      experience_required: formData.get("experience_required"),
      salary_min: parseNumber(formData.get("salary_min")),
      salary_max: parseNumber(formData.get("salary_max")),
      currency: "GHS",
      status: "open",
      screening_questions: screeningQuestions.filter(Boolean),
    };

    const response = await fetch(
      initial?.id ? `/api/admin/jobs/${initial.id}` : "/api/admin/jobs",
      {
        method: initial?.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const message = await response.text();
      setError(message || "Unable to save job.");
    } else {
      onSuccess?.();
    }
    setIsSaving(false);
  }

  async function handleGenerateDescription() {
    if (!formRef.current) return;
    setIsGenerating(true);
    setError(null);
    const formData = new FormData(formRef.current);
    const payload = {
      title: formData.get("title"),
      department: formData.get("department"),
      requirements: formData.get("requirements"),
    };
    const response = await fetch("/api/admin/jobs/description", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const data = await response.json();
      setDescription(data.description ?? "");
    } else {
      setError("Failed to generate description.");
    }
    setIsGenerating(false);
  }

  return (
    <form ref={formRef} className="space-y-10" onSubmit={handleSubmit}>
      <Section
        title="Role Details"
        description="Provide the fundamental information about the job."
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field label="Job Title" id="title">
            <Input
              id="title"
              name="title"
              defaultValue={initial?.title}
              required
            />
          </Field>
          <Field label="Department" id="department">
            <Input
              id="department"
              name="department"
              defaultValue={initial?.department}
              required
            />
          </Field>
        </div>
        <Field label="Location" id="location">
          <Input
            id="location"
            name="location"
            defaultValue={initial?.location ?? ""}
            placeholder="e.g., Accra, Ghana"
          />
        </Field>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field label="Employment Type" id="employment_type">
            <Select
              name="employment_type"
              defaultValue={initial?.employment_type ?? ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Remote Type" id="remote_type">
            <Select name="remote_type" defaultValue={initial?.remote_type ?? ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Onsite">Onsite</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </Section>

      <Section
        title="Description & Requirements"
        description="Describe the role and list the necessary qualifications."
      >
        <Field label="Role Description" id="description">
          <Textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            required
          />
          <div className="mt-2 flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleGenerateDescription}
              disabled={isGenerating}
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {isGenerating ? "Generating..." : "AI Generate"}
            </Button>
          </div>
        </Field>
        <Field label="Requirements" id="requirements">
          <Textarea
            id="requirements"
            name="requirements"
            defaultValue={initial?.requirements}
            rows={6}
            required
            placeholder="List one requirement per line."
          />
        </Field>
      </Section>

      <Section
        title="Qualifications"
        description="Specify the required experience and education."
      >
        <Field label="Years of Experience" id="experience_required">
          <Input
            id="experience_required"
            name="experience_required"
            defaultValue={initial?.experience_required ?? ""}
            placeholder="e.g., 3-5 years"
          />
        </Field>
        <Field label="Education Level" id="education_level">
          <Select
            name="education_level"
            defaultValue={initial?.education_level ?? ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select minimum education" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High School">High School</SelectItem>
              <SelectItem value="Diploma">Diploma</SelectItem>
              <SelectItem value="Bachelor">Bachelor&apos;s Degree</SelectItem>
              <SelectItem value="Master">Master&apos;s Degree</SelectItem>
              <SelectItem value="PhD">PhD</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </Section>

      <Section
        title="Compensation"
        description="Set the salary range for this position."
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field label="Minimum Salary (GHS)" id="salary_min">
            <Input
              id="salary_min"
              name="salary_min"
              type="number"
              defaultValue={initial?.salary_min ?? ""}
              placeholder="e.g., 3000"
            />
          </Field>
          <Field label="Maximum Salary (GHS)" id="salary_max">
            <Input
              id="salary_max"
              name="salary_max"
              type="number"
              defaultValue={initial?.salary_max ?? ""}
              placeholder="e.g., 5000"
            />
          </Field>
        </div>
      </Section>

      <Section
        title="Screening Questions"
        description="Add questions to help you screen candidates."
      >
        <div className="space-y-4">
          {screeningQuestions.map((q, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={q}
                onChange={(e) => {
                  const newQuestions = [...screeningQuestions];
                  newQuestions[i] = e.target.value;
                  setScreeningQuestions(newQuestions);
                }}
                placeholder={`Question ${i + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  setScreeningQuestions(screeningQuestions.filter((_, idx) => idx !== i))
                }
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setScreeningQuestions([...screeningQuestions, ""])}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>
      </Section>

      <div className="flex justify-end gap-4 pt-6">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Job"}
        </Button>
      </div>
    </form>
  );
}
