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
import Redes from './pages/Redes'
import RedesAR from './pages/RedesAR'
import Reportes from './pages/Reportes'
import RedGlobal from './pages/RedGlobal'
import Solicitudes from './pages/Solicitudes'
import SolicitudesRedes from './pages/SolicitudesRedes'
import ReportesSolicitudesAR from './pages/ReportesSolicitudesAR'
import EstudiantesAR from './pages/EstudiantesAR'
import RevocarRolAR from './pages/RevocarRolAR'
import Estudiantes from './pages/Estudiantes'
import Reset from './pages/recuperarpassword'
import ResetSP from './pages/recuperarpasswordSP'
import ProtectedRoute from './layout/ProtectedRoute'
import PublicRoute from './layout/PublicRoute'
import ApelarPage from './pages/ApelarPage'
import Apelaciones from './pages/Apelaciones'
import { ConfirmarCuenta } from './pages/ConfirmarCuenta'

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
        <Route path="recuperarpassword-e/:token" element={<Reset />} />
        <Route path="recuperarpassword/:token" element={<ResetSP />} />
        <Route path="confirmar-cuenta/:token" element={<ConfirmarCuenta />} />
        <Route path="crearApelacion" element={<ApelarPage />} />

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
          <Route path="perfilAR" element={<ProfileAR />} />
          <Route path="redesAR" element={<RedesAR />} />
          <Route path="reportes" element={<ReportesSolicitudesAR />} />
          <Route path="estudiantes" element={<EstudiantesAR />} />
          <Route path="revocar-rol" element={<RevocarRolAR />} />
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
          <Route path="redes" element={<Redes />} />
          <Route path="red-global" element={<RedGlobal />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="solicitudes" element={<Solicitudes />} />
          <Route path="solicitudes-redes" element={<SolicitudesRedes />} />
          <Route path="estudiantes" element={<Estudiantes />} />
          <Route path="apelaciones" element={<Apelaciones />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
