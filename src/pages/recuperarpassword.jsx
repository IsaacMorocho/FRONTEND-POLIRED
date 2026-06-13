import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import authService from '../services/authService';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { MdCheckCircle, MdError } from 'react-icons/md';

const PASS_MIN = 8;
const PASS_MAX = 72;
const PASS_COMPLEXITY = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

const COMMON_PASSWORDS = new Set([
  '123456', 'password', '123456789', 'qwerty', '12345678',
  '111111', '123123', 'abc123', 'password1', '1234567'
]);

const RecuperarPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const isDev = searchParams.get('dev') === 'true';

  const [step, setStep] = useState('initial');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm({ mode: 'onBlur' });

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await authService.verifyResetToken(token);
        setStep('reset');
      } catch {
        toast.error('Token inválido o expirado');
        setStep('invalid');
      }
    };

    if (!token) {
      setStep('invalid');
      toast.error('Token no proporcionado');
      return;
    }

    if (isDev) {
      setStep('reset');
      return;
    }

    verifyToken();
  }, [token, isDev]);

  const changePassword = async (data) => {
    const password = data.password?.trim();
    const conf = data.confirmpassword?.trim();

    if (password !== conf) {
      toast.error('Las contraseñas no coinciden');
      setError('confirmpassword', { type: 'validate', message: 'Las contraseñas no coinciden' });
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, { password, confirmpassword: conf });
      toast.success('Contraseña actualizada correctamente');
      setStep('success');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      toast.error(error.message || 'Error al actualizar contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-8 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Poli<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">RED</span>
          </h1>
          <p className="text-slate-400">SuperAdmin - Recuperar Contraseña</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-lg p-8 shadow-2xl">
          
          {step === 'reset' && (
            <motion.div
              key="reset"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-2xl font-bold text-white mb-2">Nueva Contraseña</h2>
              <p className="text-slate-400 text-sm mb-6">
                Crea una nueva contraseña segura para tu cuenta.
              </p>

              <form onSubmit={handleSubmit(changePassword)} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Ingresa tu nueva contraseña"
                      autoComplete="new-password"
                      disabled={loading}
                      className={`w-full bg-slate-700/50 border rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none transition disabled:opacity-50 ${
                        errors.password ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      }`}
                      {...register('password', {
                        required: 'La contraseña es obligatoria',
                        minLength: { value: PASS_MIN, message: `Mínimo ${PASS_MIN} caracteres` },
                        maxLength: { value: PASS_MAX, message: `Máximo ${PASS_MAX} caracteres` },
                        validate: {
                          noEdgeSpaces: (v) =>
                            v === v?.trim() || 'Sin espacios al inicio o final',
                          complexity: (v) =>
                            PASS_COMPLEXITY.test(v || '') ||
                            'Incluye mayúscula, minúscula, número y símbolo',
                          notCommon: (v) =>
                            !COMMON_PASSWORDS.has((v || '').toLowerCase()) ||
                            'Esta contraseña es demasiado común'
                        }
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition disabled:opacity-50"
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    Mín. 8 caracteres: mayúscula, minúscula, número y símbolo
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Repite tu contraseña"
                      autoComplete="new-password"
                      disabled={loading}
                      className={`w-full bg-slate-700/50 border rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none transition disabled:opacity-50 ${
                        errors.confirmpassword ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      }`}
                      {...register('confirmpassword', {
                        required: 'Confirma tu contraseña',
                        validate: (value) =>
                          value?.trim() === watch('password')?.trim() || 'Las contraseñas no coinciden',
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition disabled:opacity-50"
                    >
                      {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                  {errors.confirmpassword && (
                    <p className="text-red-400 text-sm mt-1">{errors.confirmpassword.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Actualizando...' : 'Cambiar contraseña'}
                </button>

                <Link
                  to="/login"
                  className="block text-center text-slate-400 hover:text-blue-400 text-sm transition"
                >
                  ← Volver al login
                </Link>
              </form>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.3 }}
                  className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center"
                >
                  <MdCheckCircle className="w-8 h-8 text-green-400" />
                </motion.div>
              </div>
              <h3 className="text-xl font-bold text-white">¡Contraseña actualizada!</h3>
              <p className="text-slate-400 text-sm">
                Tu contraseña ha sido cambiada correctamente. Redirigiendo al login...
              </p>
            </motion.div>
          )}

          {step === 'invalid' && (
            <motion.div
              key="invalid"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center"
                >
                  <MdError className="w-8 h-8 text-red-400" />
                </motion.div>
              </div>
              <h3 className="text-xl font-bold text-white">Enlace inválido o expirado</h3>
              <p className="text-slate-400 text-sm mb-6">
                El enlace de recuperación no es válido o ha expirado. Por favor solicita uno nuevo.
              </p>
              <Link
                to="/forgot"
                className="inline-block mt-4 bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                Solicitar nuevo enlace
              </Link>
              <br />
              <Link
                to="/login"
                className="block text-slate-400 hover:text-blue-400 text-sm transition mt-4"
              >
                ← Volver al login
              </Link>
            </motion.div>
          )}

          {step === 'initial' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-4 py-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-slate-600 border-t-blue-500 rounded-full mx-auto"
              />
              <p className="text-slate-400">Verificando enlace...</p>
            </motion.div>
          )}
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          © 2026 PoliRED - Todos los derechos reservados
        </p>
      </motion.div>
    </motion.div>
  );
};

export default RecuperarPassword;
