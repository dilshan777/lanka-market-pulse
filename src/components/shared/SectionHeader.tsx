interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-6 border-b border-border pb-3">
      <div>
        <h2 className="text-xl font-bold text-lanka-text-primary">{title}</h2>
        {subtitle && <p className="text-sm text-lanka-text-muted mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
