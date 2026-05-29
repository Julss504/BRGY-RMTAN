import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  // Remove manual Authorization header since we're using cookies with withCredentials: true
  // The token is stored as an httpOnly cookie and sent automatically
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user')
      // Only redirect to login if we're not already on a public auth page
      const currentPath = window.location.pathname
      if (!['/login', '/register', '/forgot-password'].includes(currentPath)) {
        window.location.href = '/login'
      }
    } else if (error.response?.status === 403) {
      // Handle access denied errors
      const message = error.response?.data?.message || 'Access denied. Insufficient permissions.'
      alert(message)
    }
    return Promise.reject(error)
  }
)

export default api