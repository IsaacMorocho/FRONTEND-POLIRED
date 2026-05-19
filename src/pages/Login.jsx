import { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import useFetch from '../hooks/useFetch'
import { AuthContext } from '../layout/AuthContext'
import Chatbot from './Chatbot'
import { motion } from 'framer-motion'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { fetchDataBackend } = useFetch()
  const { login } = useContext(AuthContext)

  const loginUser = async (data) => {
    const email = (data.email || '').trim()
    const isAdminRedEmail = email.toUpperCase().startsWith('AR')
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
      if (isAdminRedEmail) {
        toast.error('Credenciales inválidas o error al iniciar sesión')
      }
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

          <Link
            to="/forgot/:id"
            className="
              text-sm 
              text-blue-600 
              hover:text-blue-700 
              font-semibold 
              transition
            "
          >
            ¿Olvidé mi contraseña?
          </Link>
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

      <Chatbot />
    </motion.div>
  )
}

export default Login
