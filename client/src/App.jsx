import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import { SpaceProvider } from './lib/SpaceContext'
import ProtectedRoute from './components/dashboard/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import DashboardHome from './pages/dashboard/DashboardHome'
import ContactCenterPage from './pages/dashboard/ContactCenterPage'
import CrmPage from './pages/dashboard/CrmPage'
import StoragePage from './pages/dashboard/StoragePage'
import AnalyticsPage from './pages/dashboard/AnalyticsPage'
import TeamPage from './pages/dashboard/TeamPage'
import CannedResponsesPage from './pages/dashboard/CannedResponsesPage'
import SimpleTopbarLayout from './pages/dashboard/SimpleTopbarLayout'
import SpacesPage from './pages/dashboard/SpacesPage'
import SpaceLayout from './pages/dashboard/SpaceLayout'
import SpaceHome from './pages/dashboard/SpaceHome'
import SpaceInboxPage from './pages/dashboard/SpaceInboxPage'
import SpaceAnalyticsPage from './pages/dashboard/SpaceAnalyticsPage'
import SpaceContactsPage from './pages/dashboard/SpaceContactsPage'
import SpaceSettingsPage from './pages/dashboard/SpaceSettingsPage'
import SpaceKnowledgeBasePage from './pages/dashboard/SpaceKnowledgeBasePage'

function App() {
  return (
    <AuthProvider>
      <SpaceProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <SimpleTopbarLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<SpacesPage />} />
            </Route>

            <Route
              path="/dashboard/space/:id"
              element={
                <ProtectedRoute>
                  <SpaceLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<SpaceHome />} />
              <Route path="inbox" element={<SpaceInboxPage />} />
              <Route path="contacts" element={<SpaceContactsPage />} />
              <Route path="analytics" element={<SpaceAnalyticsPage />} />
              <Route path="settings" element={<SpaceSettingsPage />} />
              <Route path="knowledge-base" element={<SpaceKnowledgeBasePage />} />
            </Route>

            <Route
              path="/dashboard/workspace"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="contact-center" element={<ContactCenterPage />} />
              <Route path="crm" element={<CrmPage />} />
              <Route path="storage" element={<StoragePage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="team" element={<TeamPage />} />
              <Route path="canned-responses" element={<CannedResponsesPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SpaceProvider>
    </AuthProvider>
  )
}

export default App
