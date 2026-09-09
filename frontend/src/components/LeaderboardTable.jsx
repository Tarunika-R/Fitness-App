function TrendIndicator({ trend, rankChange }) {
    if (trend === 'up') {
        return (
            <span className="inline-flex items-center gap-1 text-emerald-400 text-sm font-medium">
                ▲ {rankChange}
            </span>
        )
    }
    if (trend === 'down') {
        return (
            <span className="inline-flex items-center gap-1 text-cinder text-sm font-medium">
                ▼ {Math.abs(rankChange)}
            </span>
        )
    }
    return <span className="text-chalk-muted text-sm">—</span>
}

export default function LeaderboardTable({ entries, currentUserId }) {
    if (entries.length === 0) {
        return (
            <div className="text-center py-16 text-chalk-muted">
                <p className="font-display text-xl mb-1">No results yet</p>
                <p className="text-sm">Log an activity to be the first on the board.</p>
            </div>
        )
    }

    return (
        <div className="border border-track-surfaceLight rounded-xl overflow-hidden">
            <table className="w-full">
                <thead>
                    <tr className="bg-track-surface text-chalk-muted text-xs uppercase tracking-wide">
                        <th className="text-left px-5 py-3 font-medium w-16">Rank</th>
                        <th className="text-left px-5 py-3 font-medium">Name</th>
                        <th className="text-right px-5 py-3 font-medium">Points</th>
                        <th className="text-right px-5 py-3 font-medium w-24">7-Day</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry) => {
                        const isCurrentUser = entry.userId === currentUserId
                        return (
                            <tr
                                key={entry.userId}
                                className={`border-t border-track-surfaceLight ${isCurrentUser ? 'bg-gold/10' : 'hover:bg-track-surface/60'
                                    } transition-colors`}
                            >
                                <td className="px-5 py-4">
                                    <span
                                        className={`font-display text-xl ${entry.rank <= 3 ? 'text-gold' : 'text-chalk-muted'
                                            }`}
                                    >
                                        {entry.rank}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="font-medium">
                                        {entry.first_name} {entry.last_name}
                                    </span>
                                    {isCurrentUser && (
                                        <span className="ml-2 text-xs text-gold font-semibold">YOU</span>
                                    )}
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <span className="font-display text-xl">
                                        {entry.total_points.toLocaleString()}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-right">
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
