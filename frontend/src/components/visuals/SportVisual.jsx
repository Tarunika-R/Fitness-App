// Hand-drawn-style flat SVG illustrations used in place of emoji
// throughout the app. Each one is a self-contained icon badge so it can
// drop into a grid, a button, or a card without extra markup.

const ICONS = {
    running: (
        <path d="M32 10a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm14 46-9-4-3-13-8 6 3 15h-7l-4-19 12-10 3-9-11 3-6 8-5-4 7-10 14-4 8 5 9 3v9h-7v-6l-5-2 2 8 12 6 2 21h-6Z" />
    ),
    walking: (
        <path d="M33 9a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-4 8-11 4 2 8 7-3v13l-8 17h7l6-12 5 5-2 13h7l3-17-8-8v-9l7 2 3 8 6-2-4-13-15-6Z" />
    ),
    cycling: (
        <g>
            <circle cx="12" cy="42" r="10" fill="none" strokeWidth="4" stroke="currentColor" />
            <circle cx="52" cy="42" r="10" fill="none" strokeWidth="4" stroke="currentColor" />
            <path d="M12 42 24 18h10l10 24M24 18l-6 12h20l8 12M24 18l6 8" fill="none" strokeWidth="4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="34" cy="12" r="5" />
        </g>
    ),
    gym: (
        <g>
            <rect x="4" y="26" width="8" height="12" rx="2" />
            <rect x="52" y="26" width="8" height="12" rx="2" />
            <rect x="14" y="20" width="6" height="24" rx="2" />
            <rect x="44" y="20" width="6" height="24" rx="2" />
            <rect x="20" y="29" width="24" height="6" rx="2" />
        </g>
    ),
    swimming: (
        <g>
            <path d="M14 20a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm-2 6 14-6 8 6 12-4 4 6-14 6-8-6-12 4-4-6Z" />
            <path d="M4 44c4-3 8-3 12 0s8 3 12 0 8-3 12 0 8 3 12 0" fill="none" strokeWidth="4" stroke="currentColor" strokeLinecap="round" />
            <path d="M4 54c4-3 8-3 12 0s8 3 12 0 8-3 12 0 8 3 12 0" fill="none" strokeWidth="4" stroke="currentColor" strokeLinecap="round" opacity="0.55" />
        </g>
    ),
    daily_steps: (
        <g>
            <path d="M20 6c6 0 8 5 7 10-1 4-5 5-9 4-5-1-7-5-6-9 1-3 4-5 8-5Z" />
            <path d="M44 26c6 0 8 5 7 10-1 4-5 5-9 4-5-1-7-5-6-9 1-3 4-5 8-5Z" />
            <path d="M14 24c6 0 8 5 7 10-1 4-5 5-9 4-5-1-7-5-6-9 1-3 4-5 8-5Z" opacity="0.6" />
            <path d="M38 44c6 0 8 5 7 10-1 4-5 5-9 4-5-1-7-5-6-9 1-3 4-5 8-5Z" opacity="0.6" />
        </g>
    ),
}

const VIEWBOX = {
    running: '0 -2 56 62',
    walking: '0 -2 56 62',
    cycling: '0 0 64 56',
    gym: '0 15 64 30',
    swimming: '0 0 64 60',
    daily_steps: '0 0 56 60',
}

export default function SportVisual({ type, className = 'h-10 w-10' }) {
    const icon = ICONS[type]
    if (!icon) return null
    return (
        <svg
            viewBox={VIEWBOX[type] || '0 0 64 64'}
            className={className}
            fill="currentColor"
            aria-hidden="true"
        >
            {icon}
        </svg>
    )
}
