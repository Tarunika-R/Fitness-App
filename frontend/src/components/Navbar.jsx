import { NavLink } from 'react-router-dom'

const navLinkClass = ({ isActive }) =>
    `px-4 py-2 text-sm font-medium tracking-wide transition-colors rounded-md ${isActive
        ? 'bg-gold text-track'
        : 'text-chalk-muted hover:text-chalk hover:bg-track-surfaceLight'
    }`

export default function Navbar({ currentUser, onSignOut }) {
    return (
        <header className="border-b border-track-surfaceLight bg-track/95 backdrop-blur sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <NavLink to="/" className="flex items-center gap-2">
                    <span className="font-display text-2xl font-semibold text-chalk">
                        FIT<span className="text-gold">QUEST</span>
                    </span>
                </NavLink>

                <nav className="flex items-center gap-1">
                    <NavLink to="/leaderboard" className={navLinkClass}>
                        Leaderboard
                    </NavLink>
                    <NavLink to="/log" className={navLinkClass}>
                        Log Activity
                    </NavLink>
                    <NavLink to="/dashboard" className={navLinkClass}>
                        My Dashboard
                    </NavLink>
                    {!currentUser && (
                        <NavLink to="/register" className={navLinkClass}>
                            Register
                        </NavLink>
                    )}
                </nav>

                {currentUser && (
                    <div className="hidden sm:flex items-center gap-3 text-sm text-chalk-muted">
                        <span>
                            Signed in as{' '}
                            <span className="text-chalk font-semibold">
                                {currentUser.first_name} {currentUser.last_name}
                            </span>
                        </span>
                        <button
                            onClick={onSignOut}
                            className="text-chalk-muted hover:text-cinder transition-colors underline underline-offset-2"
                        >
                            Sign out
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}
