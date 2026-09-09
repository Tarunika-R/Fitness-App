import ActivityForm from '../components/ActivityForm.jsx'
import PreviewGate from '../components/PreviewGate.jsx'

export default function LogActivity({ currentUser }) {
    if (!currentUser) {
        return (
            <div className="animate-slide-up">
                <div className="mb-8">
                    <p className="text-gold font-semibold text-sm tracking-widest mb-2">LOG A WORKOUT</p>
                    <h1 className="font-display text-5xl font-bold">Add an activity</h1>
                    <p className="text-chalk-muted mt-2">
                        Here's what logging a workout looks like. Sign in to actually save one.
                    </p>
                </div>

                <div className="max-w-2xl">
                    <PreviewGate
                        title="Sign in to log activities"
                        message="Register or sign in to start logging workouts and earning points."
                    >
                        <div className="bg-track-surface rounded-2xl p-8 border border-track-surfaceLight shadow-lg">
                            <ActivityForm userId={null} />
                        </div>
                    </PreviewGate>
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
