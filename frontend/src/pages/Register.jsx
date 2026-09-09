import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
            <div className="max-w-md">
                <h1 className="font-display text-3xl mb-2">Already registered</h1>
                <p className="text-chalk-muted">
                    You're signed in as{' '}
                    <span className="text-chalk font-semibold">
                        {currentUser.first_name} {currentUser.last_name}
                    </span>
                    . Head to the leaderboard to see where you stand.
                </p>
            </div>
        )
    }

    return (
        <div className="max-w-md">
            <p className="text-gold font-semibold text-sm tracking-wide mb-2">GET ON THE BOARD</p>
            <h1 className="font-display text-4xl font-semibold mb-2">Join the challenge</h1>
            <p className="text-chalk-muted mb-8">
                Register once, then log any workout — running, walking, cycling, gym,
                swimming, or steps — and watch your points climb.
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

                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                        Email <span className="text-chalk-muted font-normal">(optional)</span>
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-track-surface border border-track-surfaceLight rounded-lg px-4 py-2.5 text-chalk placeholder:text-chalk-muted focus:border-gold outline-none transition-colors"
                        placeholder="jane@example.com"
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
                    {loading ? 'Registering…' : 'Register'}
                </button>
            </form>
        </div>
    )
}
