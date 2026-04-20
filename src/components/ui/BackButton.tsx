"use client";

import { useRouter } from "next/navigation";
import { Button } from "./button";
import { ChevronLeft } from "lucide-react";

type BackButtonProps = {
  fallbackHref?: string;
  label?: string;
};

export function BackButton({ fallbackHref = "/", label = "Back" }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleClick}>
      <ChevronLeft className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
