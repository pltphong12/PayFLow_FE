import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './features/auth/LoginPage'
import RegisterPage from './features/auth/RegisterPage'
import WalletDashboardPage from './features/customer/wallet/WalletDashboardPage'

function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Default → login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Customer */}
      <Route path="/wallet" element={<WalletDashboardPage />} />

      {/* Placeholder routes — sẽ triển khai sau */}
      <Route path="/portal/dashboard" element={<PlaceholderPage title="Portal Dashboard" />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontSize: 24,
        fontWeight: 700,
        color: '#0f172a',
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
    >
      {title} — Coming soon
    </div>
  )
}

export default App
