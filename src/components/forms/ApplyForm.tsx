"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

type ApplyState = {
  error?: string | null;
};

type ApplyAction = (
  prevState: ApplyState,
  formData: FormData
) => Promise<ApplyState>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting Application...
        </>
      ) : (
        <>
          Submit Application <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}

export function ApplyForm({
  jobId,
  questions,
  action,
}: {
  jobId: string;
  questions: string[];
  action: ApplyAction;
}) {
  const [state, formAction] = useActionState(action, { error: null });

  return (
    <form className="space-y-8" action={formAction}>
      <input type="hidden" name="jobId" value={jobId} />

      <div className="space-y-6 rounded-2xl border border-gray-200/80 bg-white/60 p-8 shadow-sm backdrop-blur-lg">
        <h2 className="text-2xl font-bold text-gray-900">Your Information</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              required
              placeholder="e.g. Jane Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="e.g. jane.doe@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="e.g. +1 (555) 123-4567"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Current Location</Label>
            <Input
              id="location"
              name="location"
              required
              placeholder="e.g. San Francisco, CA"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="cv">Upload CV (PDF only)</Label>
            <Input
              id="cv"
              name="cv"
              type="file"
              accept="application/pdf"
              required
              className="file:text-gray-700"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="photo">Profile photo (optional)</Label>
            <Input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              className="file:text-gray-700"
            />
          </div>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="space-y-6 rounded-2xl border border-gray-200/80 bg-white/60 p-8 shadow-sm backdrop-blur-lg">
          <h2 className="text-2xl font-bold text-gray-900">Screening Questions</h2>
          <div className="space-y-6">
            {questions.map((q, i) => (
              <div key={i} className="space-y-2">
                <Label htmlFor={`question:${q}`}>{q}</Label>
                <Textarea
                  id={`question:${q}`}
                  name={`question:${q}`}
                  required
                  placeholder="Your answer..."
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {state.error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Application Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="rounded-2xl border border-gray-200/80 bg-white/60 p-8 shadow-sm backdrop-blur-lg">
        <SubmitButton />
      </div>
    </form>
  );
}
