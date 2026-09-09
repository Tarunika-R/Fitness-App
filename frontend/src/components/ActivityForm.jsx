import { useState } from 'react'
import { logActivity, getErrorMessage } from '../api/client.js'

const SPORTS = [
    { value: 'running', label: 'Running', metric: 'distance_km', unit: 'km' },
    { value: 'walking', label: 'Walking', metric: 'distance_km', unit: 'km' },
    { value: 'cycling', label: 'Cycling', metric: 'distance_km', unit: 'km' },
    { value: 'gym', label: 'Gym', metric: 'duration_sec', unit: 'time' },
    { value: 'swimming', label: 'Swimming', metric: 'duration_sec', unit: 'time' },
    { value: 'daily_steps', label: 'Daily Steps', metric: 'steps', unit: 'steps' },
]

export default function ActivityForm({ userId, onLogged }) {
    const [sportValue, setSportValue] = useState('running')
    const [distanceKm, setDistanceKm] = useState('')
    const [minutes, setMinutes] = useState('')
    const [seconds, setSeconds] = useState('')
    const [steps, setSteps] = useState('')
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [loading, setLoading] = useState(false)

    const sport = SPORTS.find((s) => s.value === sportValue)

    const resetInputs = () => {
        setDistanceKm('')
        setMinutes('')
        setSeconds('')
        setSteps('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        let value
        if (sport.unit === 'km') {
            value = parseFloat(distanceKm)
        } else if (sport.unit === 'time') {
            const mins = parseInt(minutes || '0', 10)
            const secs = parseInt(seconds || '0', 10)
            value = mins * 60 + secs
        } else {
            value = parseInt(steps, 10)
        }

        if (!value || value <= 0) {
            setError('Please enter a value greater than zero.')
            return
        }

        setLoading(true)
        try {
            const result = await logActivity({
                userId,
                sport: sport.value,
                metric_type: sport.metric,
                value,
            })
            setSuccess(result)
            resetInputs()
            onLogged?.(result)
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium mb-2">Sport</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SPORTS.map((s) => (
                        <button
                            key={s.value}
                            type="button"
                            onClick={() => {
                                setSportValue(s.value)
                                setError(null)
                                setSuccess(null)
                            }}
                            className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border ${sportValue === s.value
                                    ? 'bg-gold text-track border-gold'
                                    : 'bg-track-surface text-chalk-muted border-track-surfaceLight hover:text-chalk'
                                }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {sport.unit === 'km' && (
                <div>
                    <label htmlFor="distance" className="block text-sm font-medium mb-1.5">
                        Distance (km)
                    </label>
                    <input
                        id="distance"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={distanceKm}
                        onChange={(e) => setDistanceKm(e.target.value)}
                        placeholder="e.g. 5.2"
                        className="w-full bg-track-surface border border-track-surfaceLight rounded-lg px-4 py-2.5 text-chalk placeholder:text-chalk-muted focus:border-gold outline-none transition-colors"
                    />
                </div>
            )}

            {sport.unit === 'time' && (
                <div>
                    <label className="block text-sm font-medium mb-1.5">Duration</label>
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <input
                                type="number"
                                min="0"
                                value={minutes}
                                onChange={(e) => setMinutes(e.target.value)}
                                placeholder="0"
                                className="w-full bg-track-surface border border-track-surfaceLight rounded-lg px-4 py-2.5 text-chalk placeholder:text-chalk-muted focus:border-gold outline-none transition-colors"
                            />
                            <span className="text-xs text-chalk-muted mt-1 block">minutes</span>
                        </div>
                        <span className="text-2xl text-chalk-muted pb-4">:</span>
                        <div className="flex-1">
                            <input
                                type="number"
                                min="0"
                                max="59"
                                value={seconds}
                                onChange={(e) => setSeconds(e.target.value)}
                                placeholder="00"
                                className="w-full bg-track-surface border border-track-surfaceLight rounded-lg px-4 py-2.5 text-chalk placeholder:text-chalk-muted focus:border-gold outline-none transition-colors"
                            />
                            <span className="text-xs text-chalk-muted mt-1 block">seconds</span>
                        </div>
                    </div>
                    <p className="text-xs text-chalk-muted mt-2">
                        Only fully completed minutes earn points — 1:55 counts as 1 minute.
                    </p>
                </div>
            )}

            {sport.unit === 'steps' && (
                <div>
                    <label htmlFor="steps" className="block text-sm font-medium mb-1.5">
                        Steps
                    </label>
                    <input
                        id="steps"
                        type="number"
                        min="0"
                        required
                        value={steps}
                        onChange={(e) => setSteps(e.target.value)}
                        placeholder="e.g. 8342"
                        className="w-full bg-track-surface border border-track-surfaceLight rounded-lg px-4 py-2.5 text-chalk placeholder:text-chalk-muted focus:border-gold outline-none transition-colors"
                    />
                    <p className="text-xs text-chalk-muted mt-2">
                        Only full blocks of 100 steps count — 399 steps earns the same as 300.
                    </p>
                </div>
            )}

            {error && (
                <div className="bg-cinder/10 border border-cinder/40 text-cinder rounded-lg px-4 py-3 text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-gold/10 border border-gold/40 rounded-lg px-4 py-3 text-sm">
                    <span className="text-gold font-semibold">+{success.points} points</span>
                    <span className="text-chalk-muted"> logged for {sport.label.toLowerCase()}.</span>
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold hover:bg-gold-dark disabled:opacity-60 text-track font-semibold py-3 rounded-lg transition-colors"
            >
                {loading ? 'Logging…' : 'Log Activity'}
            </button>
        </form>
    )
}
