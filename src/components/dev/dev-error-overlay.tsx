"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type DevErrorItem = {
  id: string;
  message: string;
  stack?: string;
  source?: string;
  timestamp: number;
};

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString();
}

function serializeConsoleArgs(args: unknown[]) {
  return args
    .map((arg) => {
      if (typeof arg === "string") {
        return arg;
      }
      try {
        return JSON.stringify(arg, null, 2);
      } catch {
        return String(arg);
      }
    })
    .join(" ");
}

function extractErrorDetails(error: unknown) {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack };
  }
  if (typeof error === "string") {
    return { message: error };
  }
  try {
    return { message: JSON.stringify(error) };
  } catch {
    return { message: String(error) };
  }
}

export function DevErrorOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [errors, setErrors] = useState<DevErrorItem[]>([]);
  const originalConsoleError = useRef<typeof console.error | null>(null);

  const errorCount = errors.length;

  const latestErrors = useMemo(() => {
    return [...errors].reverse();
  }, [errors]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    function pushError(item: Omit<DevErrorItem, "id">) {
      setErrors((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          ...item,
        },
      ]);
    }

    function handleRuntimeError(
      event: ErrorEvent
    ) {
      const details = extractErrorDetails(event.error ?? event.message);
      pushError({
        message: details.message,
        stack: details.stack,
        source: event.filename ? `${event.filename}:${event.lineno}:${event.colno}` : undefined,
        timestamp: Date.now(),
      });
    }

    function handleRejection(event: PromiseRejectionEvent) {
      const details = extractErrorDetails(event.reason);
      pushError({
        message: details.message,
        stack: details.stack,
        timestamp: Date.now(),
      });
    }

    originalConsoleError.current = console.error;
    console.error = (...args: unknown[]) => {
      const message = serializeConsoleArgs(args);
      pushError({
        message,
        timestamp: Date.now(),
      });
      originalConsoleError.current?.(...args);
    };

    window.addEventListener("error", handleRuntimeError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleRuntimeError);
      window.removeEventListener("unhandledrejection", handleRejection);
      if (originalConsoleError.current) {
        console.error = originalConsoleError.current;
      }
    };
  }, []);

  function handleCopy(item: DevErrorItem) {
    const payload = [
      `Time: ${formatTime(item.timestamp)}`,
      `Message: ${item.message}`,
      item.source ? `Source: ${item.source}` : null,
      item.stack ? `Stack:\n${item.stack}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(payload);
    }
  }

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="pointer-events-none">
      <div className="fixed bottom-6 left-6 z-[9999] flex items-center gap-3">
        <button
          type="button"
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white shadow-lg"
          onClick={() => setIsOpen((value) => !value)}
        >
          DEV
        </button>
        {errorCount > 0 && (
          <span className="pointer-events-none rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white shadow">
            {errorCount}
          </span>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-20 left-6 z-[9999] w-[420px] max-w-[90vw] overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-900/80 text-slate-100 shadow-lg backdrop-blur"
          >
            <div className="flex items-center justify-between border-b border-slate-700/50 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Dev Errors
                </p>
                <p className="text-sm text-slate-200">
                  {errorCount} captured
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:bg-slate-800"
                  onClick={() => setIsCollapsed((value) => !value)}
                >
                  {isCollapsed ? "Expand" : "Collapse"}
                </button>
                <button
                  type="button"
                  className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:bg-slate-800"
                  onClick={() => setErrors([])}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:bg-slate-800"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            {!isCollapsed && (
              <div className="max-h-[60vh] space-y-4 overflow-y-auto px-5 py-4">
                {latestErrors.length === 0 && (
                  <p className="text-sm text-slate-400">No errors captured.</p>
                )}
                {latestErrors.map((item) => (
                  <div
                    key={item.id}
                    className="space-y-2 rounded-2xl border border-slate-700/50 bg-slate-900/70 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          {formatTime(item.timestamp)}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-white">
                          {item.message}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:bg-slate-800"
                        onClick={() => handleCopy(item)}
                      >
                        Copy
                      </button>
                    </div>
                    {item.source && (
                      <p className="text-xs text-slate-400">{item.source}</p>
                    )}
                    {item.stack && (
                      <pre className="whitespace-pre-wrap text-xs text-slate-300">
                        {item.stack}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
