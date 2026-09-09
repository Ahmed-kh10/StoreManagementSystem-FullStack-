import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...rest }, ref) => {
    const inputId = id ?? rest.name;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="font-body text-sm text-text/80">
          {label}
        </label>

        <input
          id={inputId}
          ref={ref}
          className={`
            bg-surface border rounded-sm px-4 py-2.5
            text-text placeholder:text-text/40
            focus:outline-none focus:ring-1 transition-colors
            ${error ? 'border-danger focus:ring-danger' : 'border-border/20 focus:ring-accent'}
            ${className}
          `.trim()}
          {...rest}
        />

        {error && <span className="text-sm text-danger">{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
