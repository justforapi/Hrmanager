"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
import { Loader2 } from "lucide-react";

export function CreateCvForm({
  jobId,
  questions,
}: {
  jobId: string;
  questions: string[];
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [educationLevel, setEducationLevel] = useState("");

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    formData.append("jobId", jobId);

    const response = await fetch("/api/create-cv", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const message = await response.text();
      setError(message || "Something went wrong.");
      setIsSubmitting(false);
      return;
    }

    router.push(`/apply/${jobId}/success`);
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <motion.div
        className="grid gap-4 md:grid-cols-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required placeholder="Jordan Lee" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="jordan@domain.com" />
        </div>
        <div className="space-y-2">
          <Label>Education level</Label>
          <input type="hidden" name="education" value={educationLevel} />
          <Select value={educationLevel} onValueChange={setEducationLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High School">High School</SelectItem>
              <SelectItem value="Diploma">Diploma</SelectItem>
              <SelectItem value="Associate">Associate</SelectItem>
              <SelectItem value="Bachelor">Bachelor</SelectItem>
              <SelectItem value="Master">Master</SelectItem>
              <SelectItem value="MBA">MBA</SelectItem>
              <SelectItem value="PhD">PhD</SelectItem>
              <SelectItem value="Professional Certification">
                Professional Certification
              </SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="skills">Skills</Label>
          <Textarea id="skills" name="skills" required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="experience">Experience</Label>
          <Textarea id="experience" name="experience" required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="projects">Projects</Label>
          <Textarea id="projects" name="projects" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salary_expectation">Min</Label>
          <Input
            id="salary_expectation"
            name="salary_expectation"
            type="number"
            min={0}
            max={1000000}
            placeholder="70000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salary_currency">Max</Label>
          <Input id="salary_currency" name="salary_currency" placeholder="GHS" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="photo">Profile photo (optional)</Label>
          <Input
            id="photo"
            name="photo"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) {
                if (photoPreview) {
                  URL.revokeObjectURL(photoPreview);
                }
                setPhotoPreview(null);
                return;
              }
              const url = URL.createObjectURL(file);
              if (photoPreview) {
                URL.revokeObjectURL(photoPreview);
              }
              setPhotoPreview(url);
            }}
          />
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Selected profile preview"
              className="mt-3 h-24 w-24 rounded-2xl object-cover"
            />
          )}
        </div>
      </motion.div>

      {questions.length > 0 && (
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Job Questions
          </div>
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div className="space-y-2" key={question}>
                <Label htmlFor={`question-${index}`}>
                  {index + 1}. {question}
                </Label>
                <Textarea
                  id={`question-${index}`}
                  name={`question:${question}`}
                  required
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating
          </>
        ) : (
          "Generate CV and apply"
        )}
      </Button>
    </form>
  );
}
