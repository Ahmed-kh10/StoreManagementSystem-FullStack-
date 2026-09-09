interface StatusBadgeProps {
  status: string;
}

// ملحوظة: القيم دي تخمين منطقي لحد ما نتأكد من enum الحقيقي في الباك إند
const statusColorMap: Record<string, string> = {
  pending: 'bg-accent/20 text-accent border-border/40',
  processing: 'bg-accent/20 text-accent border-border/40',
  paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  shipped: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-danger/10 text-danger border-danger/30',
  failed: 'bg-danger/10 text-danger border-danger/30',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const colorClass =
    statusColorMap[status.toLowerCase()] ??
    'bg-bg/10 text-text border-ivory/20';

  return (
    <span
      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${colorClass}`}
    >
      {status}
    </span>
  );
}
