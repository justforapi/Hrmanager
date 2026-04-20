import { cn } from "@/lib/utils";

type ScoreCircleProps = {
  score: number | null;
};

export function ScoreCircle({ score }: ScoreCircleProps) {
  if (score === null) {
    return (
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
        <span className="text-lg font-semibold text-gray-500">N/A</span>
      </div>
    );
  }

  const getScoreColor = () => {
    if (score >= 9) return "text-green-500";
    if (score >= 7) return "text-blue-500";
    if (score >= 5) return "text-amber-500";
    return "text-red-500";
  };

  const circumference = 2 * Math.PI * 45; // 2 * pi * r
  const strokeDashoffset = circumference - (score / 10) * circumference;

  return (
    <div className="relative h-24 w-24">
      <svg className="h-full w-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="stroke-current text-gray-200"
          strokeWidth="10"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
        ></circle>
        {/* Progress circle */}
        <circle
          className={cn("stroke-current", getScoreColor())}
          strokeWidth="10"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
        ></circle>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn("text-2xl font-bold", getScoreColor())}>
          {score}
        </span>
      </div>
    </div>
  );
}