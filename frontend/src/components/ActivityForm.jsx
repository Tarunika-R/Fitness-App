import { useState } from 'react'
import { logActivity, getErrorMessage } from '../api/client.js'

const SPORTS = [
    { value: 'running', label: 'Running', emoji: '🏃', metric: 'distance_km', unit: 'km' },
    { value: 'walking', label: 'Walking', emoji: '🚶', metric: 'distance_km', unit: 'km' },
    { value: 'cycling', label: 'Cycling', emoji: '🚴', metric: 'distance_km', unit: 'km' },
    { value: 'gym', label: 'Gym', emoji: '💪', metric: 'duration_sec', unit: 'time' },
    { value: 'swimming', label: 'Swimming', emoji: '🏊', metric: 'duration_sec', unit: 'time' },
    { value: 'daily_steps', label: 'Daily Steps', emoji: '👟', metric: 'steps', unit: 'steps' },
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
                <label className="block text-sm font-semibold mb-3">Choose a sport</label>
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
                            className={`px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 border-2 transform hover:scale-105 active:scale-95 ${sportValue === s.value
                                    ? 'bg-gold text-track border-gold shadow-lg'
                                    : 'bg-track-surface text-chalk-muted border-track-surfaceLight hover:border-gold hover:text-chalk'
                                }`}
                        >
                            <span className="text-lg block mb-1">{s.emoji}</span>
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {sport.unit === 'km' && (
                <div>
                    <label htmlFor="distance" className="block text-sm font-semibold mb-2">
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
                        className="w-full bg-track-surface border-2 border-track-surfaceLight rounded-lg px-4 py-3 text-chalk placeholder:text-chalk-muted focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none transition-all text-lg"
                    />
                </div>
            )}

            {sport.unit === 'time' && (
                <div>
                    <label className="block text-sm font-semibold mb-2">Duration</label>
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <input
                                type="number"
                                min="0"
                                value={minutes}
                                onChange={(e) => setMinutes(e.target.value)}
                                placeholder="0"
                                className="w-full bg-track-surface border-2 border-track-surfaceLight rounded-lg px-4 py-3 text-chalk placeholder:text-chalk-muted focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none transition-all text-lg"
                            />
                            <span className="text-xs text-chalk-muted mt-1 block text-center">minutes</span>
                        </div>
                        <span className="text-3xl text-chalk-muted pb-4 font-bold">:</span>
                        <div className="flex-1">
                            <input
                                type="number"
                                min="0"
                                max="59"
                                value={seconds}
                                onChange={(e) => setSeconds(e.target.value)}
                                placeholder="00"
                                className="w-full bg-track-surface border-2 border-track-surfaceLight rounded-lg px-4 py-3 text-chalk placeholder:text-chalk-muted focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none transition-all text-lg"
                            />
                            <span className="text-xs text-chalk-muted mt-1 block text-center">seconds</span>
                        </div>
                    </div>
                    <p className="text-xs text-chalk-muted mt-2">
                        ⏱️ Only fully completed minutes earn points — 1:55 counts as 1 minute.
                    </p>
                </div>
            )}

            {sport.unit === 'steps' && (
                <div>
                    <label htmlFor="steps" className="block text-sm font-semibold mb-2">
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
                        className="w-full bg-track-surface border-2 border-track-surfaceLight rounded-lg px-4 py-3 text-chalk placeholder:text-chalk-muted focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none transition-all text-lg"
                    />
                    <p className="text-xs text-chalk-muted mt-2">
                        👟 Only full blocks of 100 steps count — 399 steps earns the same as 300.
                    </p>
                </div>
            )}

            {error && (
                <div className="bg-cinder/15 border-l-4 border-cinder text-cinder rounded-lg px-4 py-3 text-sm animate-slide-in-left">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-gold/20 border-l-4 border-gold rounded-lg px-4 py-3 text-sm animate-slide-in-left">
                    <span className="text-gold font-bold">🎯 +{success.points} points!</span>
                    <span className="text-chalk-muted"> Great job with {sport.label.toLowerCase()}.</span>
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold hover:bg-gold-dark disabled:opacity-60 disabled:cursor-not-allowed text-track font-bold py-4 rounded-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95 text-lg"
            >
                {loading ? '⏳ Logging…' : '✓ Log Activity'}
            </button>
        </form>
    )
}
