/**
 * Simple geometric three-point star glyph used as a placeholder brand mark.
 * Intentionally schematic — not a reproduction of any trademarked asset.
 */
export function BrandStar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="Brand logo placeholder"
      fill="none"
    >
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="5" />
      <g stroke="currentColor" strokeWidth="5" strokeLinejoin="round">
        <path d="M50 50 L50 8" />
        <path d="M50 50 L86 71" />
        <path d="M50 50 L14 71" />
      </g>
    </svg>
  )
}
