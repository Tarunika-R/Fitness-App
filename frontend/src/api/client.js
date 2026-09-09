import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const client = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
})

// Ensures a promise takes at least `ms` to resolve/reject, so quick local
// responses still show their button's loading/buffering state briefly
// instead of flashing instantly.
const MIN_ACTION_DELAY_MS = 500
const withMinDelay = (promise, ms = MIN_ACTION_DELAY_MS) => {
    const wait = new Promise((resolve) => setTimeout(resolve, ms))
    return Promise.all([promise, wait]).then(([result]) => result)
}

export const registerUser = (payload) =>
    withMinDelay(client.post('/users', payload).then((res) => res.data))

export const lookupUser = (firstName, lastName) =>
    withMinDelay(
        client
            .get('/users/lookup', { params: { first_name: firstName, last_name: lastName } })
            .then((res) => res.data)
    )

export const logActivity = (payload) =>
    withMinDelay(client.post('/activities', payload).then((res) => res.data))

export const getLeaderboard = () =>
    client.get('/leaderboard').then((res) => res.data)

export const getDashboard = (userId) =>
    client.get(`/dashboard/${userId}`).then((res) => res.data)

// Helper to extract a readable error message from a failed API call,
// since FastAPI returns errors as { detail: "..." }.
export const getErrorMessage = (error) => {
    if (error.response?.data?.detail) return error.response.data.detail
    if (error.message === 'Network Error') {
        return 'Cannot reach the server. Is the backend running on port 8000?'
    }
    return 'Something went wrong. Please try again.'
}

export default client
