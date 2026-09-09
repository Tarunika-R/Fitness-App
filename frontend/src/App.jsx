import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import SignIn from './pages/SignIn.jsx'
import LogActivity from './pages/LogActivity.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import Dashboard from './pages/Dashboard.jsx'

const STORAGE_KEY = 'fitnessChallenge.currentUser'

function AnimatedRoutes({ currentUser, onSetCurrentUser }) {
    const location = useLocation()

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
            >
                <Routes location={location}>
                    <Route path="/" element={<Home currentUser={currentUser} />} />
                    <Route
                        path="/register"
                        element={<Register onRegistered={onSetCurrentUser} currentUser={currentUser} />}
                    />
                    <Route
                        path="/login"
                        element={<SignIn onSignedIn={onSetCurrentUser} currentUser={currentUser} />}
                    />
                    <Route path="/log" element={<LogActivity currentUser={currentUser} />} />
                    <Route path="/leaderboard" element={<Leaderboard currentUser={currentUser} />} />
                    <Route path="/dashboard" element={<Dashboard currentUser={currentUser} />} />
                </Routes>
            </motion.div>
        </AnimatePresence>
    )
}

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
                    <AnimatedRoutes currentUser={currentUser} onSetCurrentUser={handleSetCurrentUser} />
                </main>
            </div>
        </BrowserRouter>
    )
}
