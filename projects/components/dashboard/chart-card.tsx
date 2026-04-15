import { ReactNode } from 'react';

type ChartCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}
