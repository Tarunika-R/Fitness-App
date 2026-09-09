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
    <div>
      <p className="text-gold font-semibold text-sm tracking-wide mb-2">GLOBAL RANKINGS</p>
      <h1 className="font-display text-4xl font-semibold mb-8">Leaderboard</h1>

      {loading && <p className="text-chalk-muted">Loading rankings…</p>}

      {error && (
        <div className="bg-cinder/10 border border-cinder/40 text-cinder rounded-lg px-4 py-3 text-sm max-w-md">
          {error}
        </div>
      )}

      {!loading && !error && (
        <LeaderboardTable entries={entries} currentUserId={currentUser?.userId} />
      )}
    </div>
  )
}
