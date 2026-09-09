function TrendIndicator({ trend, rankChange }) {
    if (trend === 'up') {
        return (
            <span className="inline-flex items-center gap-1 text-emerald-400 text-sm font-bold animate-bounce-soft">
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
                    <path d="M10 3 18 14H2z" />
                </svg>
                +{rankChange}
            </span>
        )
    }
    if (trend === 'down') {
        return (
            <span className="inline-flex items-center gap-1 text-cinder text-sm font-bold">
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
                    <path d="M10 17 2 6h16z" />
                </svg>
                -{Math.abs(rankChange)}
            </span>
        )
    }
    return <span className="text-chalk-muted text-sm">— steady</span>
}

const MEDAL_STYLES = {
    1: 'bg-gradient-to-br from-gold to-gold-dark text-track',
    2: 'bg-gradient-to-br from-chalk to-chalk-muted text-track',
    3: 'bg-gradient-to-br from-[#CD7F32] to-[#8C5522] text-track',
}

function RankBadge({ rank }) {
    if (rank <= 3) {
        return (
            <span
                className={`inline-flex items-center justify-center h-9 w-9 rounded-full font-display text-base font-bold shadow-md ${MEDAL_STYLES[rank]}`}
            >
                {rank}
            </span>
        )
    }
    return <span className="font-display text-2xl font-bold text-chalk-muted">#{rank}</span>
}

export default function LeaderboardTable({ entries, currentUserId }) {
    if (entries.length === 0) {
        return (
            <div className="text-center py-20 bg-track-surface rounded-xl border border-track-surfaceLight">
                <p className="font-display text-2xl mb-2">Ready to start?</p>
                <p className="text-chalk-muted">Log an activity to be the first on the board.</p>
            </div>
        )
    }

    return (
        <div className="border border-track-surfaceLight rounded-2xl overflow-hidden bg-track-surface shadow-lg">
            <table className="w-full">
                <thead>
                    <tr className="bg-gradient-to-r from-track-surface to-track text-chalk-muted text-xs uppercase tracking-widest border-b border-track-surfaceLight">
                        <th className="text-left px-6 py-4 font-bold">Rank</th>
                        <th className="text-left px-6 py-4 font-bold">Name</th>
                        <th className="text-right px-6 py-4 font-bold">Points</th>
                        <th className="text-right px-6 py-4 font-bold">7-Day Trend</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry, idx) => {
                        const isCurrentUser = entry.userId === currentUserId

                        return (
                            <tr
                                key={entry.userId}
                                className={`border-t border-track-surfaceLight transition-all duration-200 hover:bg-track-surfaceLight/80 ${isCurrentUser ? 'bg-gold/10 font-semibold' : idx % 2 === 0 ? 'bg-track/30' : ''
                                    }`}
                            >
                                <td className="px-6 py-4">
                                    <RankBadge rank={entry.rank} />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <p className="font-semibold text-chalk">
                                                {entry.first_name} {entry.last_name}
                                            </p>
                                            {isCurrentUser && (
                                                <p className="text-xs text-gold font-bold">You</p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`font-display text-2xl font-bold ${isCurrentUser ? 'text-gold' : 'text-chalk'
                                        }`}>
                                        {entry.total_points.toLocaleString()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <TrendIndicator trend={entry.trend} rankChange={entry.rank_change} />
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
