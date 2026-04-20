import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex h-80 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/60 text-center">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6">
          <PlusCircle className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
