import { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from '../layout/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { FiArrowLeft } from 'react-icons/fi'
import authService from '../services/authService'

const LOGIN_ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN_RED: 'admin_red',
}

const Login = () => {
  const navigate = useNavigate()
  const [loginRole, setLoginRole] = useState(LOGIN_ROLES.SUPERADMIN)
  const [showPassword, setShowPassword] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [recoveryLoading, setRecoveryLoading] = useState(false)
  const [recoveryEmailSent, setRecoveryEmailSent] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { login } = useContext(AuthContext)

  const loginUser = async (data) => {
    const email = (data.email || '').trim()
    const password = data.password

    try {
      let response;
      
      if (loginRole === LOGIN_ROLES.SUPERADMIN) {
        response = await authService.loginSuperAdmin({ email, password });
        
        const rol = (response.rol || '').toLowerCase();
        if (rol !== LOGIN_ROLES.SUPERADMIN) {
          toast.error('Este usuario no tiene permisos de SuperAdmin');
          return;
        }

        const user = {
          id: response._id,
          nombre: response.nombre,
          apellido: response.apellido,
          celular: '',
          email: response.email,
          rol: response.rol,
          roles: [LOGIN_ROLES.SUPERADMIN],
          avatar: response.avatar || '',
        }
        
        login(response.token, user);
        toast.success('Bienvenido, Super Administrador');
        navigate('/dashboard');
        
      } else {
        response = await authService.loginAdminRed({ email, password });
        
        const roles = response?.usuario?.roles || [];
        if (!roles.includes(LOGIN_ROLES.ADMIN_RED)) {
          toast.error('Este usuario no tiene permisos de Administrador de Red');
          return;
        }

        const user = {
          id: response?.usuario?._id,
          nombre: response?.usuario?.nombre,
          apellido: response?.usuario?.apellido,
          celular: response?.usuario?.celular || '',
          email: response?.usuario?.email,
          roles,
          avatar: response?.usuario?.fotoPerfil || '',
          redAsignada: response?.usuario?.redAsignada || null
        }

        login(response.token, user);
        toast.success('Bienvenido, Administrador de Red');
        navigate('/dashboardRed/redesAR');
      }

    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Credenciales incorrectas para este rol');
      } else {
        toast.error(err.response?.data?.msg || 'Error al iniciar sesión');
      }
    }
  }

  const closeForgotOverlay = () => {
    setShowForgot(false)
    setForgotEmail('')
    setRecoveryEmailSent(false)
    setRecoveryLoading(false)
  }

  const handleSendRecoveryEmail = async () => {
    const emailTrimmed = forgotEmail.trim()

    if (!emailTrimmed) {
      toast.error('Por favor ingresa tu email')
      return
    }

    setRecoveryLoading(true)
    try {
      if (loginRole === LOGIN_ROLES.SUPERADMIN) {
        await authService.recuperarPasswordSuperAdmin(emailTrimmed);
      } else {
        await authService.recuperarPasswordEstudiante(emailTrimmed);
      }
      
      toast.success('Revisa tu correo. Se ha enviado un enlace de recuperación.')
      setRecoveryEmailSent(true)
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Error al solicitar recuperación')
    } finally {
      setRecoveryLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative min-h-screen flex overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-blue-950"
    >
      {/* Aurora-like gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-800/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-700/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-red-800/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Left Side - Form Section */}
      <div className="
        relative
        z-10
        w-full
        lg:w-1/2
        h-screen
        flex
        items-center
        justify-center
        px-3
        py-3
      ">
        {/* Login Form Container */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="
            w-full
            h-[95vh]
            bg-white/95
            backdrop-blur-md
            rounded-[1rem]
            shadow-2xl
            border
            border-white/20
            flex
            flex-col
            justify-between
            px-10
            sm:px-14
            py-12
            overflow-hidden
          "
        >
          {/* Heading */}
          <div className="text-center space-y-3 mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Login Administrador
            </h1>

            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Si fuiste redirigido desde la app móvil es porque ahora eres administrador de tu red (Admin de Red). Usa este portal web para modificar el perfil de tu comunidad y gestionar funciones no disponibles en la versión móvil. </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(loginUser)}
            className="w-full flex flex-col gap-6"
          >
            {/* Role Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">
                Tipo de acceso
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLoginRole(LOGIN_ROLES.SUPERADMIN)}
                  className={`
                    h-12
                    rounded-xl
                    border
                    font-semibold
                    text-sm
                    transition
                    ${loginRole === LOGIN_ROLES.SUPERADMIN
                      ? 'border-purple-500 bg-purple-50 text-purple-700 ring-2 ring-purple-500'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                    }
                  `}
                >
                  SuperAdmin
                </button>

                <button
                  type="button"
                  onClick={() => setLoginRole(LOGIN_ROLES.ADMIN_RED)}
                  className={`
                    h-12
                    rounded-xl
                    border
                    font-semibold
                    text-sm
                    transition
                    ${loginRole === LOGIN_ROLES.ADMIN_RED
                      ? 'border-purple-500 bg-purple-50 text-purple-700 ring-2 ring-purple-500'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                    }
                  `}
                >
                  Admin de Red
                </button>
              </div>
              <AnimatePresence>
                {loginRole === LOGIN_ROLES.ADMIN_RED && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-purple-700 bg-purple-50 border border-purple-100 p-2 rounded-lg mt-1 font-medium"
                  >
                    💡 Puedes usar las mismas credenciales de tu cuenta de estudiante para iniciar sesión como Admin de Red.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">
                Correo electrónico
              </label>

              <input
                type="email"
                placeholder="Ingrese su correo electrónico"
                className="
                  w-full 
                  h-14
                  px-4 
                  rounded-xl 
                  border 
                  border-slate-300 
                  bg-white 
                  text-slate-900 
                  placeholder-slate-400 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-purple-500 
                  focus:border-transparent 
                  transition
                "
                {...register('email', {
                  required: 'El correo es obligatorio',
                })}
              />

              {errors.email && (
                <p className="text-red-500 text-xs font-semibold">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">
                  Contraseña
                </label>

                <button
                  type="button"
                  onClick={() => loginRole !== LOGIN_ROLES.ADMIN_RED && setShowForgot(true)}
                  disabled={loginRole === LOGIN_ROLES.ADMIN_RED}
                  className={`
                    text-sm font-semibold transition
                    ${loginRole === LOGIN_ROLES.ADMIN_RED 
                      ? 'text-slate-400 cursor-not-allowed opacity-60' 
                      : 'text-blue-600 hover:text-blue-700'}
                  `}
                >
                  ¿Olvidé mi contraseña?
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••"
                  className="
                    w-full 
                    h-14
                    px-4 
                    pr-12
                    rounded-xl 
                    border 
                    border-slate-300 
                    bg-white 
                    text-slate-900 
                    placeholder-slate-400 
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-purple-500 
                    focus:border-transparent 
                    transition
                  "
                  {...register('password', {
                    required: 'La contraseña es obligatoria',
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute 
                    right-4 
                    top-1/2 
                    -translate-y-1/2 
                    text-slate-500 
                    hover:text-slate-700 
                    transition
                  "
                >
                  {showPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-xs font-semibold">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="
                w-full
                h-14
                mt-2
                rounded-xl
                bg-slate-800  
     
                text-white 
                font-semibold 
                text-base
                transition-all 
                duration-300 
                shadow-lg 
                hover:shadow-2xl 
                hover:scale-[1.02]
              "
            >
              INGRESAR
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-slate-200">
            <Link
              to="/"
              className="
                inline-flex 
                items-center 
                gap-2 
                text-blue-600 
                hover:text-blue-700 
                font-semibold 
                transition 
                text-sm
              "
            >
              ← Regresar
            </Link>
          </div>
        </motion.div>

        {/* Forgot Password Overlay */}
        <AnimatePresence>
          {showForgot && (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="
                absolute
                inset-y-3
                inset-x-3
                bg-gradient-to-br
                from-blue-600
                to-purple-600
                backdrop-blur-md
                rounded-[1rem]
                shadow-2xl
                border
                border-white/20
                flex
                flex-col
                justify-between
                px-10
                sm:px-14
                py-12
                overflow-hidden
              "
            >
              {/* Header with Back Button */}


              {/* Heading */}
              <div className="text-center space-y-3 mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  Recuperar Cuenta
                </h1>

                <p className="text-white/90 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                  Ingresa el correo electrónico asociado y se enviara un enlace de recuperación a tu cuenta para recuperar tu contraseña
                </p>
              </div>

              {recoveryEmailSent ? (
                <div className="w-full flex flex-col gap-4 text-center">
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                    Hemos enviado un enlace de recuperación a{' '}
                    <span className="font-semibold text-white">{forgotEmail.trim()}</span>.
                    Revisa tu bandeja de entrada y la carpeta de spam.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendRecoveryEmail()
                  }}
                  className="w-full flex flex-col gap-6"
                >
                  {/* Email Field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-white">
                      Correo electrónico
                    </label>

                    <input
                      type="email"
                      placeholder="ejemplo@correo.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      disabled={recoveryLoading}
                      className="
                        w-full 
                        h-14
                        px-4 
                        rounded-xl 
                        border 
                        border-white/30
                        bg-white/10
                        backdrop-blur-sm
                        text-white 
                        placeholder-white/50
                        focus:outline-none 
                        focus:ring-2 
                        focus:ring-white/50
                        focus:border-transparent 
                        transition
                        disabled:opacity-50
                      "
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={recoveryLoading || !forgotEmail.trim()}
                    className="
                      w-full
                      h-14
                      mt-2
                      rounded-xl
                      bg-white
                      text-purple-600
                      font-semibold 
                      text-base
                      transition-all 
                      duration-300 
                      shadow-lg 
                      hover:shadow-2xl 
                      hover:scale-[1.02]
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                      disabled:hover:scale-100
                    "
                  >
                    {recoveryLoading ? 'Enviando...' : 'Enviar Confirmación'}
                  </button>
                </form>
              )}

              {/* Footer */}
              <div className="mt-10" />
                            <div className="flex items-center justify-between mb-10">
                <button
                  type="button"
                  onClick={closeForgotOverlay}
                  className="
                    flex
                    items-center
                    gap-2
                    text-white
                    hover:opacity-80
                    transition
                    font-semibold
                  "
                >
                  <FiArrowLeft size={20} />
                  Regresar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Side - Branding Section */}
      <div className="hidden lg:flex relative z-10 w-1/2 flex-col justify-center items-center p-12 gap-8">
        {/* Large Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 flex flex-col items-center justify-center"
        >
          <div className="w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
            <img
              src="/images/logo_actual.png"
              alt="PoliRED Logo"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </motion.div>

        {/* Branding Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-10 text-center space-y-6"
        >
          <div className="flex items-center justify-center gap-3">
            <h2 className="text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
              PoliRED
            </h2>
          </div>

          <div className="space-y-4">
            <p className="text-white/95 text-2xl sm:text-3xl font-bold tracking-wide drop-shadow-sm">
              Conecta, comparte y crece
            </p>
            <p className="text-white/80 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
              Plataforma universitaria creada para estudiantes. Brindando una experiencia moderna a la universidad.
            </p>
          </div>
        </motion.div>
      </div>

    </motion.div>
  )
}

export default Login
