const ICONS = {
    track: (
        <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
            <circle cx="32" cy="32" r="22" />
            <circle cx="32" cy="32" r="12" />
            <circle cx="32" cy="32" r="2.5" fill="currentColor" stroke="none" />
            <path d="M32 4v8M32 52v8M4 32h8M52 32h8" />
        </g>
    ),
    points: (
        <path d="M32 4 40 22l20 3-15 14 4 20-17-10-17 10 4-20L4 25l20-3Z" />
    ),
    compete: (
        <g>
            <path d="M16 8h32v14c0 10-7 18-16 18S16 32 16 22V8Z" />
            <path d="M16 12H6v4c0 6 4 10 10 10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <path d="M48 12h10v4c0 6-4 10-10 10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <rect x="27" y="40" width="10" height="10" />
            <rect x="18" y="50" width="28" height="8" rx="2" />
        </g>
    ),
    visualize: (
        <g>
            <rect x="6" y="34" width="10" height="24" rx="2" />
            <rect x="27" y="18" width="10" height="40" rx="2" />
            <rect x="48" y="26" width="10" height="32" rx="2" />
            <path d="M6 16 22 6l12 8 20-12" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
        </g>
    ),
}

export default function FeatureVisual({ type, className = 'h-9 w-9' }) {
    const icon = ICONS[type]
    if (!icon) return null
    return (
        <svg viewBox="0 0 64 64" className={className} fill="currentColor" aria-hidden="true">
            {icon}
        </svg>
    )
}
