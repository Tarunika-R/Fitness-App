import { Link } from 'react-router-dom'

// Wraps a sample/preview of a page's real content. The content is shown
// dimmed and blurred (and non-interactive) with a card floating on top
// prompting the visitor to sign in or register to unlock the real thing.
export default function PreviewGate({
    eyebrow = 'PREVIEW MODE',
    title = 'Sign in to unlock this',
    message = 'This is sample data so you can see how it looks. Register or sign in to see your own.',
    children,
}) {
    return (
        <div className="relative">
            <div className="pointer-events-none select-none blur-[3px] opacity-50" aria-hidden="true">
                {children}
            </div>
            <div className="absolute inset-0 flex items-center justify-center px-4 bg-gradient-to-b from-track/10 via-track/60 to-track/90 rounded-2xl">
                <div className="text-center bg-track-surface/95 border border-track-surfaceLight rounded-2xl px-8 py-8 shadow-2xl backdrop-blur max-w-sm w-full animate-scale-in">
                    <p className="text-gold font-semibold text-xs tracking-widest mb-3">{eyebrow}</p>
                    <h3 className="font-display text-2xl font-bold mb-2">{title}</h3>
                    <p className="text-chalk-muted text-sm mb-6 leading-relaxed">{message}</p>
                    <div className="flex flex-col gap-3">
                        <Link
                            to="/register"
                            className="inline-block w-full text-center bg-gold hover:bg-gold-dark text-track font-semibold px-6 py-3 rounded-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                        >
                            Register Free
                        </Link>
                        <Link
                            to="/login"
                            className="inline-block w-full text-center bg-track-surfaceLight hover:bg-track-surfaceLight/70 border border-gold text-gold font-semibold px-6 py-3 rounded-lg transition-all hover:scale-105 active:scale-95"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
