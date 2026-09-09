import { Link } from 'react-router-dom'
import ActivityForm from '../components/ActivityForm.jsx'

export default function LogActivity({ currentUser }) {
    if (!currentUser) {
        return (
            <div className="max-w-md">
                <h1 className="font-display text-3xl mb-3">Sign in required</h1>
                <p className="text-chalk-muted mb-6">
                    Sign in if you're already registered, or register if this is your first time.
                </p>
                <div className="flex gap-3">
                    <Link
                        to="/login"
                        className="inline-block bg-gold hover:bg-gold-dark text-track font-semibold px-6 py-3 rounded-lg transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/register"
                        className="inline-block bg-track-surface hover:bg-track-surfaceLight border border-track-surfaceLight text-chalk font-semibold px-6 py-3 rounded-lg transition-colors"
                    >
                        Register
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-md">
            <p className="text-gold font-semibold text-sm tracking-wide mb-2">LOG A WORKOUT</p>
            <h1 className="font-display text-4xl font-semibold mb-8">Add an activity</h1>
            <ActivityForm userId={currentUser.userId} />
        </div>
    )
}
