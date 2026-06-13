import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext)

  if (isAuthenticated) {
    if (user?.rol?.toLowerCase() === 'superadmin') {
      return <Navigate to="/dashboard" replace />
    } else if (user?.roles?.includes('admin_red')) {
      return <Navigate to="/dashboardRed/redesAR" replace />
    } else {
      return <Navigate to="/" replace />
    }
  }

  return children
}

export default PublicRoute
