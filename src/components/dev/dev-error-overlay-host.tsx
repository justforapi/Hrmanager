"use client";

import { DevErrorOverlay } from "@/components/dev/dev-error-overlay";

export function DevErrorOverlayHost() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return <DevErrorOverlay />;
}
