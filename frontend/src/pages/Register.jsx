import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser, getErrorMessage } from '../api/client.js'

export default function Register({ onRegistered, currentUser }) {
    const navigate = useNavigate()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            const user = await registerUser({
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                email: email.trim() || undefined,
            })
            onRegistered(user)
            navigate('/leaderboard')
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    if (currentUser) {
        return (
            <div className="max-w-md mx-auto animate-slide-up">
                <div className="bg-track-surface rounded-xl p-8 border border-track-surfaceLight">
                    <h1 className="font-display text-3xl mb-3">Already registered</h1>
                    <p className="text-chalk-muted mb-6">
                        You're signed in as{' '}
                        <span className="text-chalk font-semibold">
                            {currentUser.first_name} {currentUser.last_name}
                        </span>
                        .
                    </p>
                    <Link
                        to="/leaderboard"
                        className="inline-block w-full text-center bg-gold hover:bg-gold-dark text-track font-semibold py-3 rounded-lg transition-all hover:scale-105"
                    >
                        Go to Leaderboard
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-md mx-auto animate-slide-up">
            <div className="bg-gradient-to-br from-track-surface to-track rounded-2xl p-8 border border-track-surfaceLight shadow-lg">
                <p className="text-gold font-semibold text-sm tracking-wider mb-3">GET ON THE BOARD</p>
                <h1 className="font-display text-4xl font-bold mb-2">Join the challenge</h1>
                <p className="text-chalk-muted mb-8 leading-relaxed">
                    Register once, then log any workout — and watch your points climb the
                    global leaderboard.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-semibold mb-2">
                            First name
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full bg-track-surface border-2 border-track-surfaceLight rounded-lg px-4 py-3 text-chalk placeholder:text-chalk-muted focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none transition-all"
                            placeholder="Jane"
                        />
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block text-sm font-semibold mb-2">
                            Last name
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full bg-track-surface border-2 border-track-surfaceLight rounded-lg px-4 py-3 text-chalk placeholder:text-chalk-muted focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none transition-all"
                            placeholder="Doe"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold mb-2">
                            Email <span className="text-chalk-muted font-normal text-xs">(optional)</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-track-surface border-2 border-track-surfaceLight rounded-lg px-4 py-3 text-chalk placeholder:text-chalk-muted focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none transition-all"
                            placeholder="jane@example.com"
                        />
                    </div>

                    {error && (
                        <div className="bg-cinder/15 border-l-4 border-cinder text-cinder rounded-lg px-4 py-3 text-sm animate-slide-in-left">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gold hover:bg-gold-dark disabled:opacity-60 disabled:cursor-not-allowed text-track font-bold py-3 rounded-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                    >
                        {loading ? 'Creating account…' : 'Register'}
                    </button>
                </form>

                <p className="text-chalk-muted text-sm mt-6 text-center">
                    Already registered?{' '}
                    <Link to="/login" className="text-gold hover:text-gold-light font-semibold transition-colors">
                        Sign in instead
                    </Link>
                </p>
            </div>
        </div>
    )
}
