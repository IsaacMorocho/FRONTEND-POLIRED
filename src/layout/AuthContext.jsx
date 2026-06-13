import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  // Inicializar desde sessionStorage
  const [token, setToken] = useState(() => sessionStorage.getItem('token') || '')
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [role, setRole] = useState(() => sessionStorage.getItem('role') || null)
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!sessionStorage.getItem('token'))

  const login = (newToken, userObj) => {
    let currentRole = null;
    
    // Detectar el rol basado en la estructura que devuelve el backend
    if (userObj.rol === 'SuperAdmin') {
      currentRole = 'superadmin';
    } else if (Array.isArray(userObj.roles) && userObj.roles.includes('admin_red')) {
      currentRole = 'admin_red';
    }

    sessionStorage.setItem('token', newToken);
    sessionStorage.setItem('user', JSON.stringify(userObj));
    if (currentRole) {
      sessionStorage.setItem('role', currentRole);
    }
    
    setToken(newToken);
    setUser(userObj);
    setRole(currentRole);
    setIsAuthenticated(true);
  }
  
  const updateUser = (updatedFields) => {
    const updatedUser = { ...user, ...updatedFields }
    sessionStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }
  
  const logout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('role')
    setToken('')
    setUser(null)
    setRole(null)
    setIsAuthenticated(false)
  }

  // Mantener consistencia si token cambia a vacío
  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false)
      setUser(null)
      setRole(null)
    }
  }, [token])

  return (
    <AuthContext.Provider value={{ token, user, role, isAuthenticated, login, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
