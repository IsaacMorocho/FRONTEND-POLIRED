import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext)

  if (isAuthenticated) {
    switch (user?.rol?.toLowerCase()) {
      case 'superadmin':
        return <Navigate to="/dashboard" replace />
      case 'admin_red':
        return <Navigate to="/dashboardRed" replace />
      case 'estudiante':
        return <Navigate to="/dashboard-estudiante" replace />
      default:
        return <Navigate to="/no-autorizado" replace />
    }
  }

  return children
}

export default PublicRoute
