export function HeroGraphic() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="w-full h-full"
      role="img"
      aria-label="زخرفة تصميم"
    >
      <circle
        cx="200"
        cy="200"
        r="170"
        fill="none"
        stroke="var(--color-accent)"
        strokeOpacity="0.15"
      />
      <circle
        cx="200"
        cy="200"
        r="130"
        fill="none"
        stroke="var(--color-accent)"
        strokeOpacity="0.25"
      />
      <circle
        cx="200"
        cy="200"
        r="90"
        fill="none"
        stroke="var(--color-accent)"
        strokeOpacity="0.4"
        strokeDasharray="4 6"
      />

      <g className="origin-center animate-[spin_60s_linear_infinite]">
        <circle
          cx="200"
          cy="200"
          r="150"
          fill="none"
          stroke="var(--color-accent)"
          strokeOpacity="0.3"
          strokeDasharray="2 10"
        />
      </g>

      {/* شكل الماسة في النص */}
      <path
        d="M200 150 L230 200 L200 250 L170 200 Z"
        fill="none"
        stroke="var(--color-champagne)"
        strokeWidth="1.5"
      />
      <path
        d="M200 170 L216 200 L200 230 L184 200 Z"
        fill="var(--color-accent)"
        fillOpacity="0.15"
      />

      {/* خطوط زخرفية في الأطراف */}
      <line
        x1="200"
        y1="30"
        x2="200"
        y2="60"
        stroke="var(--color-accent)"
        strokeOpacity="0.4"
      />
      <line
        x1="200"
        y1="340"
        x2="200"
        y2="370"
        stroke="var(--color-accent)"
        strokeOpacity="0.4"
      />
      <line
        x1="30"
        y1="200"
        x2="60"
        y2="200"
        stroke="var(--color-accent)"
        strokeOpacity="0.4"
      />
      <line
        x1="340"
        y1="200"
        x2="370"
        y2="200"
        stroke="var(--color-accent)"
        strokeOpacity="0.4"
      />
    </svg>
  );
}
