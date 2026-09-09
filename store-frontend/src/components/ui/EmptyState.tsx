import { type ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
      <h3 className="font-display text-xl text-text">{title}</h3>
      {description && (
        <p className="font-body text-text/60 text-sm max-w-xs">{description}</p>
      )}
      {action}
    </div>
  );
}
