export default function Logo({ className = 'h-9 w-9' }) {
    return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
            <defs>
                <linearGradient id="fq-logo-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0b3a56" />
                    <stop offset="100%" stopColor="#ffbe3d" />
                </linearGradient>
            </defs>
            <path d="M24 2 44 13v18L24 42 4 31V13Z" fill="url(#fq-logo-grad)" />
            <path d="M25 9 13 25h8l-3 14 17-19h-8l4-11Z" fill="#0D0B1E" />
        </svg>
    )
}
