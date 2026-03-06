interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'var(--brand-yellow)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
      aria-hidden
    >
      <svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Ceiling plate */}
        <path d="M4 6h16M6 6v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6" />
        {/* Stem */}
        <path d="M12 8v8M12 8l-2 2M12 8l2 2" />
        <line x1="12" y1="16" x2="12" y2="18" />
        {/* Lamp shade (dome) */}
        <path d="M8 18c0-2.2 1.8-4 4-4s4 1.8 4 4" />
      </svg>
    </div>
  );
}
