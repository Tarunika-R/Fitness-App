import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Register from './pages/Register.jsx'
import SignIn from './pages/SignIn.jsx'
import LogActivity from './pages/LogActivity.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import Dashboard from './pages/Dashboard.jsx'

const STORAGE_KEY = 'fitnessChallenge.currentUser'

export default function App() {
    const [currentUser, setCurrentUser] = useState(null)

    // Restore the signed-in user across page refreshes.
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) setCurrentUser(JSON.parse(saved))
    }, [])

    const handleSetCurrentUser = (user) => {
        setCurrentUser(user)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    }

    const handleSignOut = () => {
        setCurrentUser(null)
        localStorage.removeItem(STORAGE_KEY)
    }

    return (
        <BrowserRouter>
            <div className="min-h-screen flex flex-col">
                <Navbar currentUser={currentUser} onSignOut={handleSignOut} />
                <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
                    <Routes>
                        <Route
                            path="/"
                            element={<Navigate to={currentUser ? '/leaderboard' : '/register'} replace />}
                        />
                        <Route
                            path="/register"
                            element={<Register onRegistered={handleSetCurrentUser} currentUser={currentUser} />}
                        />
                        <Route
                            path="/login"
                            element={<SignIn onSignedIn={handleSetCurrentUser} currentUser={currentUser} />}
                        />
                        <Route
                            path="/log"
                            element={<LogActivity currentUser={currentUser} />}
                        />
                        <Route path="/leaderboard" element={<Leaderboard currentUser={currentUser} />} />
                        <Route
                            path="/dashboard"
                            element={<Dashboard currentUser={currentUser} />}
                        />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    )
}
