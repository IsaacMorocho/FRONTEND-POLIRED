  import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useContext(AuthContext)

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (requiredRole && user?.rol?.toLowerCase() !== requiredRole.toLowerCase()) {
    // Si el usuario tiene un rol diferente, lo redirigimos según su rol
    switch (user?.rol?.toLowerCase()) {
      case 'superadmin':
        return <Navigate to="/dashboard" replace />
      case 'admin_red':
        return <Navigate to="/dashboardRed" replace />
      default:
        return <Navigate to="*" replace />
    }
  }

  return children
}

export default ProtectedRoute
