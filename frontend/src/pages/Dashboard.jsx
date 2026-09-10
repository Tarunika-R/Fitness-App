import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDashboard, getErrorMessage } from '../api/client.js'
import TrendChart from '../components/TrendChart.jsx'
import SportBreakdownChart from '../components/SportBreakdownChart.jsx'
import PreviewGate from '../components/PreviewGate.jsx'
import { SPORT_LABELS } from '../theme.js'

function formatValue(activity) {
    if (activity.metric_type === 'distance_km') return `${activity.raw_value} km`
    if (activity.metric_type === 'duration_sec') {
        const mins = Math.floor(activity.raw_value / 60)
        const secs = Math.round(activity.raw_value % 60)
        return `${mins}:${String(secs).padStart(2, '0')}`
    }
    return `${activity.raw_value.toLocaleString()} steps`
}

// Groups a flat, mixed-day activity list into per-date sections so the
// history reads as "here's what happened each day" instead of repeating
// the same date down every row of a long, undifferentiated table.
function groupActivitiesByDate(activities) {
    const buckets = new Map()
    for (const activity of activities) {
        const dateKey = new Date(activity.activity_date).toISOString().slice(0, 10)
        if (!buckets.has(dateKey)) buckets.set(dateKey, [])
        buckets.get(dateKey).push(activity)
    }

    const today = new Date().toISOString().slice(0, 10)
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

    return [...buckets.entries()]
        .sort(([a], [b]) => (a < b ? 1 : -1)) // most recent date first
        .map(([dateKey, dayActivities]) => {
            let label
            if (dateKey === today) label = 'Today'
            else if (dateKey === yesterday) label = 'Yesterday'
            else {
                label = new Date(dateKey).toLocaleDateString(undefined, {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                })
            }
            const totalPoints = dayActivities.reduce((sum, a) => sum + a.points, 0)
            return { dateKey, label, totalPoints, activities: dayActivities }
        })
}

// Sample data shown (blurred, non-interactive) to visitors who haven't
// signed in yet, so they can see the shape of the dashboard before
// committing to register.
const SAMPLE_DATA = {
    first_name: 'Sample',
    last_name: 'Athlete',
    total_points: 8420,
    current_rank: 4,
    points_over_time: [
        { date: 'Mon', points: 120 },
        { date: 'Tue', points: 340 },
        { date: 'Wed', points: 300 },
        { date: 'Thu', points: 560 },
        { date: 'Fri', points: 480 },
        { date: 'Sat', points: 720 },
        { date: 'Sun', points: 900 },
    ],
    sport_breakdown: [
        { sport: 'running', total_points: 3200 },
        { sport: 'gym', total_points: 2100 },
        { sport: 'cycling', total_points: 1600 },
        { sport: 'swimming', total_points: 900 },
        { sport: 'daily_steps', total_points: 620 },
    ],
    activity_history: [
        { id: 1, sport: 'running', metric_type: 'distance_km', raw_value: 6.2, activity_date: '2026-09-05', points: 620 },
        { id: 2, sport: 'gym', metric_type: 'duration_sec', raw_value: 2400, activity_date: '2026-09-04', points: 200 },
        { id: 3, sport: 'cycling', metric_type: 'distance_km', raw_value: 14.5, activity_date: '2026-09-03', points: 362 },
        { id: 4, sport: 'daily_steps', metric_type: 'steps', raw_value: 9800, activity_date: '2026-09-02', points: 98 },
    ],
}

function DashboardContent({ data }) {
    return (
        <div>
            <div className="mb-10">
                <p className="text-gold font-semibold text-sm tracking-widest mb-3">MY DASHBOARD</p>
                <h1 className="font-display text-5xl font-bold">
                    {data.first_name}
                </h1>
                <p className="text-chalk-muted mt-1 text-lg">{data.last_name}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
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
                <div className="bg-track-surface rounded-xl p-6 border border-track-surfaceLight shadow-lg">
                    <h2 className="font-display text-xl font-bold mb-4">Points Over Time</h2>
                    <TrendChart data={data.points_over_time} />
                </div>
                <div className="bg-track-surface rounded-xl p-6 border border-track-surfaceLight shadow-lg">
                    <h2 className="font-display text-xl font-bold mb-4">Sport Breakdown</h2>
                    <SportBreakdownChart data={data.sport_breakdown} />
                </div>
            </div>

            {/* Activity History */}
            <div>
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
                    <div className="space-y-5">
                        {groupActivitiesByDate(data.activity_history).map((group) => (
                            <div
                                key={group.dateKey}
                                className="bg-track-surface rounded-xl overflow-hidden border border-track-surfaceLight shadow-lg"
                            >
                                <div className="flex items-center justify-between px-5 py-3 bg-track border-b border-track-surfaceLight">
                                    <h3 className="font-semibold text-chalk">{group.label}</h3>
                                    <span className="text-gold font-bold text-sm">
                                        +{group.totalPoints} pts
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-chalk-muted text-xs uppercase tracking-wide">
                                                <th className="text-left px-5 py-2 font-semibold">Sport</th>
                                                <th className="text-left px-5 py-2 font-semibold">Value</th>
                                                <th className="text-right px-5 py-2 font-semibold">Points</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {group.activities.map((activity) => (
                                                <tr
                                                    key={activity.id}
                                                    className="border-t border-track-surfaceLight hover:bg-track-surfaceLight/50 transition-colors"
                                                >
                                                    <td className="px-5 py-3 font-medium">{SPORT_LABELS[activity.sport]}</td>
                                                    <td className="px-5 py-3 text-chalk-muted">{formatValue(activity)}</td>
                                                    <td className="px-5 py-3 text-right font-bold text-gold">
                                                        +{activity.points}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
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
            <div className="animate-slide-up">
                <PreviewGate
                    title="This is your personal dashboard"
                    message="Sample stats shown below. Register or sign in to see your real points, rank, and activity history."
                >
                    <DashboardContent data={SAMPLE_DATA} />
                </PreviewGate>
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
            <DashboardContent data={data} />
        </div>
    )
}
