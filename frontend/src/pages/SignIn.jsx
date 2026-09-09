import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { lookupUser, getErrorMessage } from '../api/client.js'

export default function SignIn({ onSignedIn, currentUser }) {
    const navigate = useNavigate()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            const user = await lookupUser(firstName.trim(), lastName.trim())
            onSignedIn(user)
            navigate('/leaderboard')
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    if (currentUser) {
        return (
            <div className="max-w-md">
                <h1 className="font-display text-3xl mb-2">Already signed in</h1>
                <p className="text-chalk-muted">
                    You're signed in as{' '}
                    <span className="text-chalk font-semibold">
                        {currentUser.first_name} {currentUser.last_name}
                    </span>
                    .
                </p>
            </div>
        )
    }

    return (
        <div className="max-w-md">
            <p className="text-gold font-semibold text-sm tracking-wide mb-2">WELCOME BACK</p>
            <h1 className="font-display text-4xl font-semibold mb-2">Sign in</h1>
            <p className="text-chalk-muted mb-8">
                Enter the name you registered with to pick up right where you left off.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-1.5">
                        First name
                    </label>
                    <input
                        id="firstName"
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-track-surface border border-track-surfaceLight rounded-lg px-4 py-2.5 text-chalk placeholder:text-chalk-muted focus:border-gold outline-none transition-colors"
                        placeholder="Jane"
                    />
                </div>

                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-1.5">
                        Last name
                    </label>
                    <input
                        id="lastName"
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-track-surface border border-track-surfaceLight rounded-lg px-4 py-2.5 text-chalk placeholder:text-chalk-muted focus:border-gold outline-none transition-colors"
                        placeholder="Doe"
                    />
                </div>

                {error && (
                    <div className="bg-cinder/10 border border-cinder/40 text-cinder rounded-lg px-4 py-3 text-sm">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gold hover:bg-gold-dark disabled:opacity-60 text-track font-semibold py-3 rounded-lg transition-colors"
                >
                    {loading ? 'Signing in…' : 'Sign In'}
                </button>
            </form>

            <p className="text-chalk-muted text-sm mt-6">
                New here?{' '}
                <Link to="/register" className="text-gold hover:underline">
                    Register instead
                </Link>
            </p>
        </div>
    )
}
