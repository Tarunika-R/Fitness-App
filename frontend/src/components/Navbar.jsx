import { NavLink, useLocation } from 'react-router-dom'

const navLinkClass = ({ isActive }) =>
    `px-4 py-2 text-sm font-medium tracking-wide transition-all duration-200 rounded-md ${isActive
        ? 'bg-gold text-track font-semibold'
        : 'text-chalk-muted hover:text-chalk hover:bg-track-surfaceLight active:scale-95'
    }`

export default function Navbar({ currentUser, onSignOut }) {
    const location = useLocation()

    return (
        <header className="border-b border-track-surfaceLight bg-gradient-to-r from-track to-track/95 backdrop-blur sticky top-0 z-10 shadow-lg transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <NavLink to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <span className="font-display text-2xl font-bold text-chalk tracking-tight">
                        FITNESS<span className="text-gold">CHALLENGE</span>
                    </span>
                </NavLink>

                <nav className="hidden md:flex items-center gap-1">
                    <NavLink to="/" className={navLinkClass}>
                        Home
                    </NavLink>
                    <NavLink to="/leaderboard" className={navLinkClass}>
                        Leaderboard
                    </NavLink>
                    <NavLink to="/log" className={navLinkClass}>
                        Log Activity
                    </NavLink>
                    <NavLink to="/dashboard" className={navLinkClass}>
                        Dashboard
                    </NavLink>
                    {!currentUser && (
                        <>
                            <NavLink to="/login" className={navLinkClass}>
                                Sign In
                            </NavLink>
                            <NavLink to="/register" className={navLinkClass}>
                                Register
                            </NavLink>
                        </>
                    )}
                </nav>

                {currentUser && (
                    <div className="hidden sm:flex items-center gap-4">
                        <div className="text-sm">
                            <p className="text-chalk-muted">Logged in as</p>
                            <p className="text-chalk font-semibold">
                                {currentUser.first_name} {currentUser.last_name}
                            </p>
                        </div>
                        <button
                            onClick={onSignOut}
                            className="px-4 py-2 bg-cinder/20 hover:bg-cinder/40 text-cinder font-medium rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                            Sign Out
                        </button>
                    </div>
                )}

                {!currentUser && (
                    <div className="md:hidden flex gap-2">
                        <NavLink to="/login" className="text-gold font-semibold hover:text-gold-light transition-colors">
                            Sign In
                        </NavLink>
                        <span className="text-chalk-muted">/</span>
                        <NavLink to="/register" className="text-gold font-semibold hover:text-gold-light transition-colors">
                            Register
                        </NavLink>
                    </div>
                )}
            </div>
        </header>
    )
}
