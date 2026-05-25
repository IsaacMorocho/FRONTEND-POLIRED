import { Link } from 'react-router'
import useFetch from '../hooks/useFetch'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import 'react-toastify/dist/ReactToastify.css'

export const Forgot = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { fetchDataBackend } = useFetch()

  const sendMail = async (data) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/recuperar-password`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(result.msg || 'Correo enviado exitosamente')
      } else {
        toast.error(result.msg || 'Hubo un error al enviar el correo')
      }
    } catch (error) {
      toast.error('Error de conexión con el servidor')
    }
  }

  return (
  <motion.div
    initial={{ opacity: 0, x: -25 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 100 }}
    transition={{ duration: 0.5 }}
    className="relative flex items-center justify-center h-screen bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('/images/forgot_1.jpg')" }}
  >
    <div className="bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-md mx-4 text-gray-800 font-sans">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-900 tracking-wide">
        Recuperar Cuenta
      </h1>

      <form onSubmit={handleSubmit(sendMail)}>
        <div className="mb-4">
          <label className="block text-m font-semibold mb-2 text-gray-900">
            Ingrese el correo electrónico asociado a su cuenta:
          </label>
          <input
            type="email"
            placeholder="ejemplo@correo.com"
            className="block w-full rounded-md border border-gray-400 bg-white/70 
                        focus:border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-200 
                        py-2 px-3 text-gray-800 placeholder-gray-500"
            {...register("email", { required: "El correo electrónico es obligatorio" })}
          />
          {errors.email && <p className="text-red-800 mt-1">{errors.email.message}</p>}
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="my-5 bg-gray-800 text-white px-5 py-2 rounded-md shadow-lg 
                       hover:bg-white hover:text-gray-900 hover:scale-105 duration-300 transition-all"
          >
            Enviar Confirmación
          </button>
        </div>
      </form>

      <div className="border-b border-gray-300 my-4" />
      <div className="flex justify-between items-center text-sm text-gray-900">
        <Link
          to="/login"
          className="underline hover:text-black transition-colors tracking-wide"
        >
           Regresar
        </Link>
      </div>
    </div>
  </motion.div>
  )
}
