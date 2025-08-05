import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { FinancialProvider } from "./contexts/FinancialContext"
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import ProtectedRoute from "./components/ProtectedRoute"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <FinancialProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </FinancialProvider>
    </AuthProvider>
  )
}

export default App
