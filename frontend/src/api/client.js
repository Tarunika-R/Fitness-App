import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const client = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
})

export const registerUser = (payload) =>
    client.post('/users', payload).then((res) => res.data)

export const logActivity = (payload) =>
    client.post('/activities', payload).then((res) => res.data)

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
