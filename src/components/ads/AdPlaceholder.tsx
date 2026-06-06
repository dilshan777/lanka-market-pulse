interface AdPlaceholderProps {
  label?: string;
  className?: string;
}

export function AdPlaceholder({ label = "Advertisement", className = "" }: AdPlaceholderProps) {
  return (
    <div className={`ad-placeholder rounded-lg ${className}`}>
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}
