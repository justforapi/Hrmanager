"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FormSubmitButtonProps = {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "link";
  size?: "default" | "sm" | "lg" | "icon";
};

export function FormSubmitButton({
  children,
  pendingText,
  className,
  variant = "default",
  size = "default",
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      className={cn("w-full sm:min-w-[160px] sm:w-auto", className)}
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {pendingText ?? "Processing"}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
