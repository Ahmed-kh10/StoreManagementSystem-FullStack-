import { type ReactNode } from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-surface border border-border/20 rounded-sm p-6 flex flex-col gap-4"
      >
        <h2 id="dialog-title" className="font-display text-xl text-accent">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
