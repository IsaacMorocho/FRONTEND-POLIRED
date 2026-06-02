import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home'
import Login from './pages/Login'
import { Forgot } from './pages/Forgot'
import { NotFound } from './pages/NotFound'
import Dashboard from './layout/Dashboard'
import DashboardRed from './layout/DashboardRed'
import Profile from './pages/Profile'
import ProfileAR from './pages/ProfileAR'
import Usuarios from './pages/Usuarios'
import Publicaciones from './pages/Publicaciones'
import Redes from './pages/Redes'
import RedesAR from './pages/RedesAR'
import Reportes from './pages/Reportes'
import ArticulosAR from './pages/ArticulosAR'
import ReportesSolicitudesAR from './pages/ReportesSolicitudesAR'
import EstudiantesAR from './pages/EstudiantesAR'
import Reset from './pages/recuperarpassword'
import ProtectedRoute from './layout/ProtectedRoute'
import PublicRoute from './layout/PublicRoute'

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        autoClose={3000}
        position="top-right"
        theme="colored" 
        hideProgressBar
        pauseOnFocusLoss={false} 
        closeOnClick
      />
      <Routes>
        {/* Públicas */}
        <Route index element={<Home />} />
        <Route
          path="login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />


        <Route path="forgot" element={<Forgot />} />
        <Route path="recuperarpassword" element={<Reset />} />

        {/* Protegidas por rol */}
        {/* ADMINISTRADOR DE RED */}

        <Route
          path="/dashboardRed"
          element={
            <ProtectedRoute requiredRole="Admin_Red">
              <DashboardRed />
            </ProtectedRoute>
          }
        >
          <Route path="perfilAR" element={<ProfileAR/>}/>
          <Route path="publicaciones" element={<Publicaciones />} />
          <Route path="articulos" element={<ArticulosAR />} />
          <Route path="redesAR" element={<RedesAR />} />
          <Route path="reportes" element={<ReportesSolicitudesAR />} />
          <Route path="estudiantes" element={<EstudiantesAR />} />
        </Route>
      
        {/* SUPER ADMINISTRADOR */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute requiredRole="SuperAdmin">
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Profile />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="redes" element={<Redes />} />
          <Route path="reportes" element={<Reportes />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
