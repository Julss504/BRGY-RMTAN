import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Layout from './components/Layout.jsx'

// Auth pages
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard.jsx'
import ResidentManagement from './pages/admin/ResidentManagement.jsx'
import Announcements from './pages/admin/Announcements.jsx'
import WasteManagement from './pages/admin/WasteManagement.jsx'
import DisasterManagement from './pages/admin/DisasterManagement.jsx'
import DocumentRequests from './pages/admin/DocumentRequests.jsx'
import SendNotifications from './pages/admin/SendNotifications.jsx'

// Resident pages
import ResidentHome from './pages/resident/Home.jsx'
import AnnouncementsBoard from './pages/resident/AnnouncementsBoard.jsx'
import WasteSchedule from './pages/resident/WasteSchedule.jsx'
import DisasterAwareness from './pages/resident/DisasterAwareness.jsx'
import DocumentRequest from './pages/resident/DocumentRequest.jsx'
import Notifications from './pages/resident/Notifications.jsx'
import MyProfile from './pages/resident/MyProfile.jsx'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/" />} />

      {/* Admin routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="admin">
            <Layout>
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="residents" element={<ResidentManagement />} />
                <Route path="announcements" element={<Announcements />} />
                <Route path="waste-management" element={<WasteManagement />} />
                <Route path="disaster-management" element={<DisasterManagement />} />
                <Route path="document-requests" element={<DocumentRequests />} />
                <Route path="send-notifications" element={<SendNotifications />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Resident routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute role="resident">
            <Layout>
              <Routes>
                <Route index element={<ResidentHome />} />
                <Route path="home" element={<ResidentHome />} />
                <Route path="announcements" element={<AnnouncementsBoard />} />
                <Route path="waste-schedule" element={<WasteSchedule />} />
                <Route path="disaster-awareness" element={<DisasterAwareness />} />
                <Route path="document-request" element={<DocumentRequest />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="profile" element={<MyProfile />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App