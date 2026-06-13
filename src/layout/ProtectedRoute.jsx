import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useContext(AuthContext)

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (requiredRole) {
    const hasRole = user?.roles?.includes(requiredRole.toLowerCase()) || 
                    user?.rol?.toLowerCase() === requiredRole.toLowerCase()
    
    if (!hasRole) {
      // Si el usuario tiene un rol diferente, lo redirigimos según su rol
      if (user?.roles?.includes('admin_red')) {
        return <Navigate to="/dashboardRed/redesAR" replace />
      } else if (user?.roles?.includes('superadmin') || user?.rol?.toLowerCase() === 'superadmin') {
        return <Navigate to="/dashboard" replace />
      } else {
        return <Navigate to="/" replace />
      }
    }
  }

  return children
}

export default ProtectedRoute
