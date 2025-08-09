import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from 'antd'
import { useAuthStore } from './stores/authStore'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ReceitasPage from './pages/ReceitasPage'
import DespesasPage from './pages/DespesasPage'
import ImportarFaturaPage from './pages/ImportarFaturaPage'
import PerfilPage from './pages/PerfilPage'
import CompartilharPage from './pages/CompartilharPage'
import AppLayout from './components/Layout/AppLayout'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Routes>
      {/* Rota pública para compartilhamento */}
      <Route path="/compartilhar/:sharingCode" element={<CompartilharPage />} />
      
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <Route path="/*" element={
          <AppLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/receitas" element={<ReceitasPage />} />
              <Route path="/despesas" element={<DespesasPage />} />
              <Route path="/importar-fatura" element={<ImportarFaturaPage />} />
              <Route path="/perfil" element={<PerfilPage />} />
              <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AppLayout>
        } />
      )}
    </Routes>
  )
}

export default App
