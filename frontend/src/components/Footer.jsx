import Logo from './Logo.jsx'

export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="border-t border-track-surfaceLight bg-track-surface/60 backdrop-blur mt-20">
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div>
                    <div className="flex items-center gap-2">
                        <Logo className="h-7 w-7" />
                        <span className="font-display text-xl font-bold tracking-tight">
                            FIT<span className="text-gold">QUEST</span>
                        </span>
                    </div>
                    <p className="text-chalk-muted text-sm mt-3 leading-relaxed">
                        Gamified fitness tracking. Log any workout, earn fair points, and
                        climb the global leaderboard.
                    </p>
                </div>

                <div>
                    <p className="text-chalk font-semibold text-sm mb-3 tracking-wide">ORGANIZATION</p>
                    <p className="text-chalk-muted text-sm leading-relaxed">
                        Fit Quest<br />
                        A gamified fitness challenge platform<br />
                        <a href="mailto:hello@fitquest.app" className="hover:text-gold transition-colors">
                            hello@fitquest.app
                        </a>
                    </p>
                </div>

                <div>
                    <p className="text-chalk font-semibold text-sm mb-3 tracking-wide">DEVELOPER</p>
                    <p className="text-chalk-muted text-sm leading-relaxed">
                        Built and maintained by the Fit Quest development team.<br />
                        Feedback and bug reports are welcome.
                    </p>
                </div>
            </div>

            <div className="border-t border-track-surfaceLight">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-chalk-muted">
                    <p>© {year} Fit Quest. All rights reserved.</p>
                    <p>Made for athletes who like a scoreboard.</p>
                </div>
            </div>
        </footer>
    )
}
