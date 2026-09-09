import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDashboard, getErrorMessage } from '../api/client.js'
import TrendChart from '../components/TrendChart.jsx'
import SportBreakdownChart from '../components/SportBreakdownChart.jsx'

const SPORT_LABELS = {
    running: 'Running',
    walking: 'Walking',
    cycling: 'Cycling',
    gym: 'Gym',
    swimming: 'Swimming',
    daily_steps: 'Daily Steps',
}

function formatValue(activity) {
    if (activity.metric_type === 'distance_km') return `${activity.raw_value} km`
    if (activity.metric_type === 'duration_sec') {
        const mins = Math.floor(activity.raw_value / 60)
        const secs = Math.round(activity.raw_value % 60)
        return `${mins}:${String(secs).padStart(2, '0')}`
    }
    return `${activity.raw_value.toLocaleString()} steps`
}

export default function Dashboard({ currentUser }) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!currentUser) return
        getDashboard(currentUser.userId)
            .then(setData)
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setLoading(false))
    }, [currentUser])

    if (!currentUser) {
        return (
            <div className="max-w-md mx-auto animate-slide-up">
                <div className="bg-gradient-to-br from-track-surface to-track rounded-2xl p-8 border border-track-surfaceLight">
                    <h1 className="font-display text-3xl font-bold mb-3">Sign in required</h1>
                    <p className="text-chalk-muted mb-8">
                        Sign in if you're already registered, or register if this is your first time.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Link
                            to="/login"
                            className="inline-block w-full text-center bg-gold hover:bg-gold-dark text-track font-semibold px-6 py-3 rounded-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="inline-block w-full text-center bg-track-surface hover:bg-track-surfaceLight border-2 border-gold text-gold font-semibold px-6 py-3 rounded-lg transition-all hover:scale-105 hover:shadow-lg active:scale-95"
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    if (loading)
        return (
            <div className="text-center py-16 animate-pulse">
                <p className="text-chalk-muted text-lg">Loading your dashboard…</p>
            </div>
        )

    if (error) {
        return (
            <div className="bg-cinder/15 border-l-4 border-cinder text-cinder rounded-lg px-6 py-4 max-w-md animate-slide-in-left">
                {error}
            </div>
        )
    }

    return (
        <div className="animate-slide-up">
            <div className="mb-10 animate-slide-up">
                <p className="text-gold font-semibold text-sm tracking-widest mb-3">MY DASHBOARD</p>
                <h1 className="font-display text-5xl font-bold">
                    {data.first_name}
                </h1>
                <p className="text-chalk-muted mt-1 text-lg">{data.last_name}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 animate-scale-in">
                <div className="bg-gradient-to-br from-gold to-gold-dark rounded-xl px-6 py-8 border border-gold text-track shadow-lg hover:shadow-xl transition-shadow hover:-translate-y-1">
                    <p className="text-sm font-semibold opacity-90 mb-2">Total Points</p>
                    <p className="font-display text-5xl font-bold">{data.total_points.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-track-surface to-track-surfaceLight rounded-xl px-6 py-8 border border-track-surfaceLight shadow-lg hover:shadow-xl transition-shadow hover:-translate-y-1">
                    <p className="text-chalk-muted text-sm font-semibold mb-2">Current Rank</p>
                    <p className="font-display text-5xl font-bold text-gold">#{data.current_rank}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                <div className="bg-track-surface rounded-xl p-6 border border-track-surfaceLight shadow-lg animate-slide-in-left">
                    <h2 className="font-display text-xl font-bold mb-4">Points Over Time</h2>
                    <TrendChart data={data.points_over_time} />
                </div>
                <div className="bg-track-surface rounded-xl p-6 border border-track-surfaceLight shadow-lg animate-slide-in-right">
                    <h2 className="font-display text-xl font-bold mb-4">Sport Breakdown</h2>
                    <SportBreakdownChart data={data.sport_breakdown} />
                </div>
            </div>

            {/* Activity History */}
            <div className="animate-slide-up">
                <h2 className="font-display text-2xl font-bold mb-4">Recent Activity</h2>
                {data.activity_history.length === 0 ? (
                    <div className="bg-track-surface rounded-xl p-8 border border-track-surfaceLight text-center">
                        <p className="text-chalk-muted">No activities logged yet. Start with something!</p>
                        <Link
                            to="/log"
                            className="inline-block mt-4 bg-gold hover:bg-gold-dark text-track font-semibold px-6 py-2 rounded-lg transition-all hover:scale-105"
                        >
                            Log First Activity
                        </Link>
                    </div>
                ) : (
                    <div className="bg-track-surface rounded-xl overflow-hidden border border-track-surfaceLight shadow-lg">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-track text-chalk-muted text-xs uppercase tracking-wide border-b border-track-surfaceLight">
                                        <th className="text-left px-5 py-3 font-semibold">Sport</th>
                                        <th className="text-left px-5 py-3 font-semibold">Value</th>
                                        <th className="text-left px-5 py-3 font-semibold">Date</th>
                                        <th className="text-right px-5 py-3 font-semibold">Points</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.activity_history.map((activity) => (
                                        <tr
                                            key={activity.id}
                                            className="border-t border-track-surfaceLight hover:bg-track-surfaceLight/50 transition-colors"
                                        >
                                            <td className="px-5 py-3.5 font-medium">{SPORT_LABELS[activity.sport]}</td>
                                            <td className="px-5 py-3.5 text-chalk-muted">{formatValue(activity)}</td>
                                            <td className="px-5 py-3.5 text-chalk-muted">
                                                {new Date(activity.activity_date).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                            <td className="px-5 py-3.5 text-right font-bold text-gold">
                                                +{activity.points}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
