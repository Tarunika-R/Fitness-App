import { Link } from 'react-router-dom'
import ActivityForm from '../components/ActivityForm.jsx'

export default function LogActivity({ currentUser }) {
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

    return (
        <div className="animate-slide-up">
            <div className="mb-8 animate-slide-up">
                <p className="text-gold font-semibold text-sm tracking-widest mb-2">LOG A WORKOUT</p>
                <h1 className="font-display text-5xl font-bold">Add an activity</h1>
                <p className="text-chalk-muted mt-2">
                    Track your progress. Every activity counts toward your score and rank.
                </p>
            </div>

            <div className="max-w-2xl">
                <div className="bg-track-surface rounded-2xl p-8 border border-track-surfaceLight shadow-lg animate-scale-in">
                    <ActivityForm userId={currentUser.userId} />
                </div>
            </div>
        </div>
    )
}
