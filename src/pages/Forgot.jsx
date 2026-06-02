import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

export const Forgot = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm({ mode: 'onBlur' });
  const { fetchDataBackend } = useFetch();

  const email = watch('email');

  const sendMail = async (data) => {
    const emailTrimmed = data.email?.trim();

    if (!emailTrimmed) {
      toast.error('Por favor ingresa tu email');
      return;
    }

    setLoading(true);
    try {
      await fetchDataBackend(
        `${import.meta.env.VITE_BACKEND_URL}/recuperar-password`,
        { email: emailTrimmed },
        'POST'
      );
      toast.success('Revisa tu correo. Se ha enviado un enlace de recuperación.');
      setEmailSent(true);
    } catch (error) {
      toast.error(error.message || 'Error al solicitar recuperación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 relative overflow-hidden"
    >
      {/* Decorative blurred circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-lg p-8 shadow-2xl">
          {/* Logo */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <h1 className="text-4xl font-bold text-center mb-2">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                PoliRED
              </span>
            </h1>
            <p className="text-center text-slate-400 text-sm mb-8">SuperAdmin - Recuperar Contraseña</p>
          </motion.div>

          {!emailSent ? (
            <>
              {/* Title */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h2 className="text-2xl font-bold text-white mb-2">Recuperar Acceso</h2>
                <p className="text-slate-400 text-sm mb-6">
                  Ingresa tu correo electrónico y te enviaremos un enlace para reestablecer tu contraseña.
                </p>
              </motion.div>

              {/* Form */}
              <motion.form
                onSubmit={handleSubmit(sendMail)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Correo Electrónico</label>
                  <input
                    type="email"
                    placeholder="tu@correo.epn.edu.ec"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition disabled:opacity-50"
                    {...register('email', {
                      required: 'El correo es obligatorio',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Ingresa un correo válido'
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading || !email}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-600 hover:to-purple-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
                </motion.button>
              </motion.form>

              {/* Back Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center mt-6"
              >
                <Link
                  to="/login"
                  className="text-slate-400 hover:text-white text-sm underline transition"
                >
                  Volver a Iniciar Sesión
                </Link>
              </motion.div>
            </>
          ) : (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/50 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Correo Enviado</h3>
              <p className="text-slate-400 text-sm mb-6">
                Hemos enviado un enlace de recuperación a <span className="text-white font-medium">{email}</span>. 
                El enlace expira en 1 hora.
              </p>
              <p className="text-slate-500 text-xs mb-6">
                Si no recibes el correo, revisa tu carpeta de spam.
              </p>

              <Link
                to="/login"
                className="inline-block w-full bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 rounded-lg transition"
              >
                Volver a Iniciar Sesión
              </Link>
            </motion.div>
          )}

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-slate-500 text-xs mt-8 pt-6 border-t border-slate-700"
          >
            © 2026 PoliRED - Todos los derechos reservados
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};
