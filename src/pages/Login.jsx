import { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import useFetch from '../hooks/useFetch'
import { AuthContext } from '../layout/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { FiArrowLeft } from 'react-icons/fi'

const Login = () => {
  // ⚠️ CREDENCIALES DE DESARROLLO - REMOVER CUANDO SE INTEGRE BACKEND
  const DEV_ADMIN_RED = {
    email: 'AR-juangarcia@epn.edu.ec',
    password: 'AdminRed2025!'
  }
  // ⚠️ FIN CREDENCIALES DE DESARROLLO

  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const { register, handleSubmit, formState: { errors }, setValue } = useForm()
  const { fetchDataBackend } = useFetch()
  const { login } = useContext(AuthContext)

  // Cargar credenciales de desarrollo
  const loadDevCredentials = () => {
    setValue('email', DEV_ADMIN_RED.email)
    setValue('password', DEV_ADMIN_RED.password)
    toast.info('Credenciales de Admin Red cargadas (MODO DESARROLLO)')
  }

  const loginUser = async (data) => {
    const email = (data.email || '').trim()
    const password = (data.password || '').trim()
    const isAdminRedEmail = email.toUpperCase().startsWith('AR')
    
    // ⚠️ MODO DESARROLLO - Validar credenciales hardcodeadas
    if (isAdminRedEmail && email === DEV_ADMIN_RED.email && password === DEV_ADMIN_RED.password) {
      const devUser = {
        id: '507f1f77bcf86cd799439011',
        nombre: 'Juan Carlos',
        apellido: 'García López',
        email: 'AR-juangarcia@epn.edu.ec',
        rol: 'Admin_Red',
        avatar: 'https://cdn-icons-png.flaticon.com/512/4715/4715329.png',
        celular: '0987654321'
      }
      const devToken = 'dev-token-admin-red-' + Date.now()
      login(devToken, devUser)
      sessionStorage.setItem('token', devToken)
      sessionStorage.setItem('user', JSON.stringify(devUser))
      toast.success('Sesión iniciada en modo desarrollo (Admin Red)')
      navigate('/dashboardRed/perfilAR')
      return
    }
    // ⚠️ FIN MODO DESARROLLO

    let url = ''

    if (isAdminRedEmail) {
      url = `${import.meta.env.VITE_BACKEND_URL}/login/admin-red`
    } else {
      url = `${import.meta.env.VITE_BACKEND_URL}/login`
    }

    try {
      const response = await fetchDataBackend(url, data, 'POST')

      if (response?.token) {
        const user = {
          id: response._id,
          nombre: response.nombre,
          apellido: response.apellido,
          celular: response.celular,
          email: response.email,
          rol: response.rol,
          avatar: response.avatar,
        }
        login(response.token, user)
        sessionStorage.setItem('token', response.token)
        sessionStorage.setItem('user', JSON.stringify(user))

        if (isAdminRedEmail) {
          navigate('/dashboardRed/perfilAR')
        } else {
          navigate('/dashboard')
        }
      }
    } catch (err) {
      toast.error('Credenciales inválidas o error al iniciar sesión')
    }
  }

  const handleSendRecoveryEmail = () => {
    if (!forgotEmail.trim()) {
      toast.error('Por favor ingresa un correo electrónico')
      return
    }
    // Aquí iría el consumo del endpoint
    // Por ahora solo mostramos un toast
    toast.info('Funcionalidad de recuperación en desarrollo...')
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

            <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Ingresa con tu correo y contraseña para acceder al panel de administración
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(loginUser)}
            className="w-full flex flex-col gap-6"
          >
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
                  onClick={() => setShowForgot(true)}
                  className="
                    text-sm 
                    text-blue-600 
                    hover:text-blue-700 
                    font-semibold 
                    transition
                  "
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

            {/* Development Mode - Load Admin Red Credentials */}
            <button
              type="button"
              onClick={loadDevCredentials}
              className="
                w-full
                h-12
                mt-3
                rounded-xl
                bg-orange-500
                hover:bg-orange-600
                text-white 
                font-semibold 
                text-sm
                transition-all 
                duration-300 
                shadow-lg 
              "
            >
              ⚙️ Cargar Credenciales Admin Red (Desarrollo)
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
                  Ingresa el correo electrónico asociado a tu cuenta para recuperar tu contraseña
                </p>
              </div>

              {/* Recovery Form */}
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
                    "
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
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
                  "
                >
                  Enviar Confirmación
                </button>
              </form>

              {/* Footer */}
              <div className="mt-10" />
                            <div className="flex items-center justify-between mb-10">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(false)
                    setForgotEmail('')
                  }}
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
      <div className="hidden lg:flex relative z-10 w-1/2 flex-col justify-between items-center p-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 text-center space-y-6"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
  
            <h2 className="text-2xl font-bold text-white">PoliRED</h2>
          </div>

          <div className="space-y-3">
            <p className="text-white/90 text-lg font-semibold">Conecta, comparte y crece</p>
            <p className="text-white/70 text-sm max-w-xs mx-auto leading-relaxed">
                Plataforma universitearia creada para estudiantes. Brindando una experiencia moderna a la universidad.
            </p>
          </div>
        </motion.div>

        {/* Bottom Info - Large Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-10 w-full flex flex-col items-center justify-center overflow-hidden"
        >
          <div className="w-90 h-85 overflow-hidden flex items-end justify-center mb-[-75px]">
            <img
              src="/images/logo_actual.png"
              alt="PoliRED"
              className="w-full h-full object-contain"
            />
          </div>


        </motion.div>
      </div>

    </motion.div>
  )
}

export default Login
