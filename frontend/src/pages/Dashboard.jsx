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
      <div className="max-w-md">
        <h1 className="font-display text-3xl mb-3">Register first</h1>
        <p className="text-chalk-muted mb-6">
          Your personal dashboard appears once you're registered and have logged
          at least one activity.
        </p>
        <Link
          to="/register"
          className="inline-block bg-gold hover:bg-gold-dark text-track font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Register now
        </Link>
      </div>
    )
  }

  if (loading) return <p className="text-chalk-muted">Loading your dashboard…</p>

  if (error) {
    return (
      <div className="bg-cinder/10 border border-cinder/40 text-cinder rounded-lg px-4 py-3 text-sm max-w-md">
        {error}
      </div>
    )
  }

  return (
    <div>
      <p className="text-gold font-semibold text-sm tracking-wide mb-2">MY DASHBOARD</p>
      <h1 className="font-display text-4xl font-semibold mb-8">
        {data.first_name} {data.last_name}
      </h1>

      {/* Scoreboard readout */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-track-surface border border-track-surfaceLight rounded-xl px-6 py-5">
          <p className="text-chalk-muted text-sm mb-1">Total Points</p>
          <p className="font-display text-5xl text-gold">{data.total_points.toLocaleString()}</p>
        </div>
        <div className="bg-track-surface border border-track-surfaceLight rounded-xl px-6 py-5">
          <p className="text-chalk-muted text-sm mb-1">Current Rank</p>
          <p className="font-display text-5xl">#{data.current_rank}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-track-surface border border-track-surfaceLight rounded-xl px-6 py-5">
          <h2 className="font-display text-lg mb-4">Points Over Time</h2>
          <TrendChart data={data.points_over_time} />
        </div>
        <div className="bg-track-surface border border-track-surfaceLight rounded-xl px-6 py-5">
          <h2 className="font-display text-lg mb-4">Sport Breakdown</h2>
          <SportBreakdownChart data={data.sport_breakdown} />
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg mb-4">Activity History</h2>
        {data.activity_history.length === 0 ? (
          <p className="text-chalk-muted text-sm">No activity logged yet.</p>
        ) : (
          <div className="border border-track-surfaceLight rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-track-surface text-chalk-muted text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-medium">Sport</th>
                  <th className="text-left px-5 py-3 font-medium">Value</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-right px-5 py-3 font-medium">Points</th>
                </tr>
              </thead>
              <tbody>
                {data.activity_history.map((activity) => (
                  <tr key={activity.id} className="border-t border-track-surfaceLight">
                    <td className="px-5 py-3.5">{SPORT_LABELS[activity.sport] || activity.sport}</td>
                    <td className="px-5 py-3.5 text-chalk-muted">{formatValue(activity)}</td>
                    <td className="px-5 py-3.5 text-chalk-muted">
                      {new Date(activity.activity_date).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-gold">
                      +{activity.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
