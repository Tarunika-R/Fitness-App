import { useState, useEffect } from 'react'
import LeaderboardTable from '../components/LeaderboardTable.jsx'
import { getLeaderboard, getErrorMessage } from '../api/client.js'

export default function Leaderboard({ currentUser }) {
    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        getLeaderboard()
            .then(setEntries)
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="animate-slide-up">
            <div className="mb-10 animate-slide-up">
                <p className="text-gold font-semibold text-sm tracking-widest mb-3">GLOBAL RANKINGS</p>
                <h1 className="font-display text-5xl font-bold">Leaderboard</h1>
                <p className="text-chalk-muted mt-2">
                    Ranked by total points earned. Trend shows your rank change over the past 7 days.
                </p>
            </div>

            {loading && (
                <div className="text-center py-16 animate-pulse">
                    <div className="inline-block">
                        <div className="text-chalk-muted text-lg">Loading rankings…</div>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-cinder/15 border-l-4 border-cinder text-cinder rounded-lg px-6 py-4 max-w-md animate-slide-in-left">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div className="animate-scale-in">
                    <LeaderboardTable entries={entries} currentUserId={currentUser?.userId} />
                </div>
            )}
        </div>
    )
}
