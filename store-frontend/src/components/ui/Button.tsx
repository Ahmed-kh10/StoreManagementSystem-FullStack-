import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-bg hover:bg-accent',
  secondary: 'bg-surface text-text border border-border/30 hover:border-border',
  ghost: 'bg-transparent text-accent hover:bg-accent/10',
  danger: 'bg-danger text-text hover:opacity-90',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-6 py-2.5 text-base',
  lg: 'px-8 py-3 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        font-body font-semibold rounded-sm transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `.trim()}
      {...rest}
    >
      {isLoading ? 'جارٍ التحميل...' : children}
    </button>
  );
}
