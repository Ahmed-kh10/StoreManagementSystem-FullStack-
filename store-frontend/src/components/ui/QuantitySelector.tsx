interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center border border-border/20 rounded-sm w-fit">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="px-3 py-2 text-text hover:bg-surface disabled:opacity-30 transition-colors"
      >
        −
      </button>
      <span className="px-4 text-text font-body min-w-[2.5rem] text-center">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="px-3 py-2 text-text hover:bg-surface disabled:opacity-30 transition-colors"
      >
        +
      </button>
    </div>
  );
}
