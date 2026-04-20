"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check, X, Star } from "lucide-react";

export function ApplicantDetailActions({ applicantId }: { applicantId: string }) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  async function updateStatus(status: string) {
    setLoading(status);
    await fetch(`/api/admin/applicants/${applicantId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reason }),
    });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="reason" className="text-sm font-medium text-gray-700">
          Reason (Optional)
        </Label>
        <Textarea
          id="reason"
          placeholder="Provide a reason for shortlisting or rejecting..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-2"
          rows={3}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={() => updateStatus("shortlisted")}
          disabled={!!loading}
          className="flex-1"
        >
          {loading === "shortlisted" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Star className="mr-2 h-4 w-4" />
          )}
          Shortlist
        </Button>
        <Button
          variant="destructive"
          onClick={() => updateStatus("rejected")}
          disabled={!!loading}
          className="flex-1"
        >
          {loading === "rejected" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <X className="mr-2 h-4 w-4" />
          )}
          Reject
        </Button>
        <Button
          variant="outline"
          onClick={() => updateStatus("reviewed")}
          disabled={!!loading}
        >
          {loading === "reviewed" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Check className="mr-2 h-4 w-4" />
          )}
          Mark as Reviewed
        </Button>
      </div>
    </div>
  );
}
