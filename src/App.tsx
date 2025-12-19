import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import { storage } from './utils/storage'
import Login from './pages/Login'
import TaskList from './pages/TaskList'
import Island from './pages/Island'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = storage.getToken()
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

function App() {
  const initAuth = useAuthStore((state) => state.initAuth)

  useEffect(() => {
    initAuth()
  }, [initAuth])

  return (
    <BrowserRouter basename="/ear-task">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TaskList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/island"
          element={
            <ProtectedRoute>
              <Island />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/tasks" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
