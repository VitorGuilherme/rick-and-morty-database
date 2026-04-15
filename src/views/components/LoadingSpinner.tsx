/**
 * LoadingSpinner.tsx — View Component
 * Portal animado como loading indicator. Temático e funcional.
 * data-testid="loading-indicator"
 */

interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'lg'
}

export function LoadingSpinner({ message = 'Abrindo portal...', size = 'lg' }: LoadingSpinnerProps) {
  const sz = size === 'lg' ? 64 : 36
  const textSize = size === 'lg' ? 'text-xs' : 'text-[10px]'

  return (
    <div
      className="flex flex-col items-center justify-center gap-5 py-16"
      data-testid="loading-indicator"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {/* Portal SVG animado */}
      <div className="relative" style={{ width: sz, height: sz }}>
        {/* Anel externo girando devagar */}
        <svg
          className="absolute inset-0 animate-[portalSpin_4s_linear_infinite]"
          viewBox="0 0 64 64"
          style={{ width: sz, height: sz }}
        >
          <circle
            cx="32" cy="32" r="28"
            fill="none"
            stroke="rgba(57,255,20,0.15)"
            strokeWidth="1"
            strokeDasharray="8 4"
          />
        </svg>
        {/* Anel médio girando no sentido contrário */}
        <svg
          className="absolute inset-0 animate-[portalSpin_2.5s_linear_infinite_reverse]"
          viewBox="0 0 64 64"
          style={{ width: sz, height: sz }}
        >
          <circle
            cx="32" cy="32" r="20"
            fill="none"
            stroke="rgba(57,255,20,0.3)"
            strokeWidth="1.5"
            strokeDasharray="12 6"
          />
        </svg>
        {/* Núcleo pulsante */}
        <div
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className="rounded-full bg-rm-green animate-glow-pulse"
            style={{ width: sz * 0.3, height: sz * 0.3 }}
          />
        </div>
      </div>

      {message && (
        <p className={`${textSize} font-body text-rm-green tracking-[0.2em] uppercase animate-flicker`}>
          {message}
        </p>
      )}
    </div>
  )
}
