import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatCard({
  title,
  value,
  subtext,
}: {
  title: string;
  value: string | number;
  subtext?: string;
}) {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-[0.2em] text-slate-500">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold text-slate-900">{value}</div>
        {subtext && <p className="mt-2 text-sm text-slate-500">{subtext}</p>}
      </CardContent>
    </Card>
  );
}
