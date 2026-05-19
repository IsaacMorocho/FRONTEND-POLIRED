import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()
export const AuthProvider = ({ children }) => {
  // Inicializar desde sessionStorage
  const [token, setToken] = useState(() => sessionStorage.getItem('token') || '')
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!sessionStorage.getItem('token'))

  const login = (newToken, userObj) => {
    sessionStorage.setItem('token', newToken)
    sessionStorage.setItem('user', JSON.stringify(userObj))
    setToken(newToken)
    setUser(userObj)
    setIsAuthenticated(true)
  }
  const logout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    setToken('')
    setUser(null)
    setIsAuthenticated(false)
  }

  // Mantener consistencia si token cambia a vacío
  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false)
      setUser(null)
    }
  }, [token])

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
