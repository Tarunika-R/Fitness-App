import { Link } from 'react-router-dom'

export default function Home({ currentUser }) {
    const features = [
        {
            icon: '🏃',
            title: 'Track Any Sport',
            desc: 'Log running, walking, cycling, gym, swimming, or daily steps.',
        },
        {
            icon: '⭐',
            title: 'Earn Points',
            desc: 'Every activity is converted to points using a fair, transparent system.',
        },
        {
            icon: '🏆',
            title: 'Compete',
            desc: 'Compare yourself against others on a real-time global leaderboard.',
        },
        {
            icon: '📊',
            title: 'Visualize',
            desc: 'See your progress with activity trends and sport breakdowns.',
        },
    ]

    const sports = [
        { name: 'Running', emoji: '🏃', color: 'text-gold' },
        { name: 'Walking', emoji: '🚶', color: 'text-chalk-muted' },
        { name: 'Cycling', emoji: '🚴', color: 'text-blue-400' },
        { name: 'Gym', emoji: '💪', color: 'text-cinder' },
        { name: 'Swimming', emoji: '🏊', color: 'text-emerald-400' },
        { name: 'Steps', emoji: '👟', color: 'text-purple-400' },
    ]

    if (currentUser) {
        return (
            <div className="text-center py-16">
                <p className="text-gold font-semibold text-sm tracking-wide mb-4">WELCOME BACK</p>
                <h1 className="font-display text-5xl font-bold mb-4 animate-slide-up">
                    Ready to compete, {currentUser.first_name}?
                </h1>
                <p className="text-chalk-muted text-lg mb-8 animate-slide-up animate-delay-100">
                    Jump into the leaderboard or log a new activity.
                </p>
                <div className="flex gap-4 justify-center animate-slide-up animate-delay-200">
                    <Link
                        to="/leaderboard"
                        className="bg-gold hover:bg-gold-dark text-track font-semibold px-8 py-3 rounded-lg transition-all hover:scale-105 hover:shadow-lg"
                    >
                        View Leaderboard
                    </Link>
                    <Link
                        to="/log"
                        className="bg-track-surface hover:bg-track-surfaceLight border border-gold text-gold font-semibold px-8 py-3 rounded-lg transition-all hover:scale-105 hover:shadow-lg"
                    >
                        Log Activity
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div>
            {/* Hero Section */}
            <section className="py-20 text-center animate-fade-in">
                <p className="text-gold font-semibold text-sm tracking-widest mb-4 animate-slide-up">
                    GAMIFIED FITNESS TRACKING
                </p>
                <h1 className="font-display text-6xl sm:text-7xl font-bold mb-6 animate-slide-up animate-delay-100 leading-tight">
                    Compete.<br />Achieve.<br />Dominate.
                </h1>
                <p className="text-chalk-muted text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-slide-up animate-delay-200 leading-relaxed">
                    Turn your fitness routine into a competition. Log any activity, watch your
                    points climb, and race for the top of the global leaderboard.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animate-delay-300">
                    <Link
                        to="/register"
                        className="bg-gold hover:bg-gold-dark text-track font-bold py-4 px-10 rounded-lg text-lg transition-all hover:scale-105 hover:shadow-2xl inline-block"
                    >
                        Get Started Free
                    </Link>
                    <Link
                        to="/login"
                        className="bg-track-surface hover:bg-track-surfaceLight border-2 border-gold text-gold font-bold py-4 px-10 rounded-lg text-lg transition-all hover:scale-105 hover:shadow-lg inline-block"
                    >
                        Sign In
                    </Link>
                </div>
            </section>

            {/* Sports Showcase */}
            <section className="py-16 mt-12">
                <h2 className="font-display text-4xl font-bold text-center mb-12 animate-slide-up">
                    Track 6 Different Sports
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {sports.map((sport, i) => (
                        <div
                            key={sport.name}
                            className="bg-track-surface hover:bg-track-surfaceLight border border-track-surfaceLight rounded-xl p-6 text-center card-hover animate-scale-in"
                            style={{ animationDelay: `${i * 50}ms` }}
                        >
                            <div className={`text-5xl mb-3 ${sport.color}`}>{sport.emoji}</div>
                            <p className="font-medium">{sport.name}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 mt-12">
                <h2 className="font-display text-4xl font-bold text-center mb-12 animate-slide-up">
                    Why Compete?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <div
                            key={feature.title}
                            className="bg-gradient-to-br from-track-surface to-track rounded-xl p-6 border border-track-surfaceLight card-hover animate-slide-up"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="font-display text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-chalk-muted text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 mt-12">
                <h2 className="font-display text-4xl font-bold text-center mb-12 animate-slide-up">
                    How It Works
                </h2>
                <div className="max-w-3xl mx-auto">
                    {[
                        { step: 1, title: 'Register', desc: 'Sign up with your first and last name.' },
                        { step: 2, title: 'Log Activities', desc: 'Record workouts across any of 6 sports.' },
                        { step: 3, title: 'Earn Points', desc: 'Each activity is converted to points fairly.' },
                        { step: 4, title: 'Compete', desc: 'Climb the global leaderboard and dominate.' },
                    ].map((item, i) => (
                        <div
                            key={item.step}
                            className="mb-8 flex gap-6 animate-slide-in-left"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gold text-track font-display text-xl font-bold">
                                    {item.step}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-display text-xl font-bold mb-1">{item.title}</h3>
                                <p className="text-chalk-muted">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Scoring System Explainer */}
            <section className="py-20 mt-12 bg-track-surface/50 rounded-2xl p-8 animate-scale-in">
                <h2 className="font-display text-4xl font-bold text-center mb-8">
                    Fair Points System
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { sport: '🏃 Running', rate: '1 km = 100 pts' },
                        { sport: '🚶 Walking', rate: '1 km = 50 pts' },
                        { sport: '🚴 Cycling', rate: '1 km = 25 pts' },
                        { sport: '💪 Gym', rate: '1 min = 5 pts' },
                        { sport: '🏊 Swimming', rate: '1 min = 15 pts' },
                        { sport: '👟 Steps', rate: '100 steps = 1 pt' },
                    ].map((item, i) => (
                        <div
                            key={item.sport}
                            className="bg-track rounded-xl p-4 border border-track-surfaceLight text-center hover:border-gold transition-colors animate-fade-in"
                            style={{ animationDelay: `${i * 50}ms` }}
                        >
                            <p className="text-2xl mb-2">{item.sport}</p>
                            <p className="text-gold font-semibold">{item.rate}</p>
                        </div>
                    ))}
                </div>
                <p className="text-center text-chalk-muted mt-6 text-sm">
                    All calculations are floored fairly — you only get points for fully completed
                    metrics.
                </p>
            </section>

            {/* Final CTA */}
            <section className="py-16 text-center mt-12 animate-slide-up">
                <h2 className="font-display text-4xl font-bold mb-6">Ready to Join?</h2>
                <p className="text-chalk-muted text-lg mb-8 max-w-xl mx-auto">
                    Start competing today. It takes less than a minute to register and log your
                    first activity.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/register"
                        className="bg-gold hover:bg-gold-dark text-track font-bold py-4 px-12 rounded-lg text-lg transition-all hover:scale-105 hover:shadow-2xl inline-block"
                    >
                        Register Now
                    </Link>
                    <Link
                        to="/login"
                        className="bg-track-surface hover:bg-track-surfaceLight border-2 border-gold text-gold font-bold py-4 px-12 rounded-lg text-lg transition-all hover:scale-105 hover:shadow-lg inline-block"
                    >
                        Sign In
                    </Link>
                </div>
            </section>
        </div>
    )
}
