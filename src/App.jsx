import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home'
import Login from './pages/Login'
import { Register } from './pages/Register'
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
import Reset from './pages/recuperarpassword'
import ProtectedRoute from './layout/ProtectedRoute'
import PublicRoute from './layout/PublicRoute'
import LoginEstudiante from './pages/Login_Estudiante'
import RegisterEstudiante from './pages/Register_estudiante'
import ConfirmEstudiante from './pages/ConfirmEstudiante'
import DashboardEstudiante from './layout/DashboardEstudiante'
import { ForgotE } from './pages/ForgotE'
import RecuperarPasswordE from './pages/RecuperarPasswordE'
import Compras from "./pages/Compras";
import ChatPrivadoWrapper from "./layout/ChatPrivadoWrapper";
import RedesDisponibles from "./pages/Estudiante/Redes/RedesDisponibles";
import MisRedes from "./pages/Estudiante/Redes/MisRedes";
import HomeEstudiante from "./pages/Estudiante/HomeEstudiante";
import RedDetalle from "./pages/Estudiante/Redes/RedDetalle";
import EditarPublicacion from "./pages/Estudiante/Publicaciones/EditarPublicacion";
import Perfil from "./pages/Estudiante/Perfil/perfil";

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
        <Route path="confirmar-cuenta/:token" element={<ConfirmEstudiante />} />
        <Route
          path="login-estudiante"
          element={
            <PublicRoute>
              <LoginEstudiante />
            </PublicRoute>
          }
        />
        <Route
          path="register-estudiante"
          element={
            <PublicRoute>
              <RegisterEstudiante />
            </PublicRoute>
          }
        />
        <Route
          path="register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route path="forgot/:id" element={<Forgot />} />
        <Route path="estudiante/recuperar/:id" element={<ForgotE />} />
        <Route path="recuperarpassword-e/:token" element={<RecuperarPasswordE />} />
        <Route path="recuperarpassword/:token" element={<Reset />} />

        {/* Protegidas por rol */}
        {/* ESTUDIANTE */}
        <Route
          path="/dashboard-estudiante"
          element={
            <ProtectedRoute requiredRole="Estudiante">
              <DashboardEstudiante />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomeEstudiante />} />
          <Route path="compras" element={<Compras />} />
          <Route path="redes" element={<RedesDisponibles />} />
          <Route path="redes/mis-redes" element={<MisRedes />} />
          <Route path="redes/:id" element={<RedDetalle />} />
                    <Route 
            path="redes/:id/editar-publicacion/:publicacionId" 
            element={<EditarPublicacion />} 
          />
          <Route path="perfil" element={<Perfil />} />

        </Route>
        <Route path="/mensajes" element={<ChatPrivadoWrapper />} />

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
          <Route path="redesAR" element={<RedesAR />} />
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
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
