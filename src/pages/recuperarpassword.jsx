import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const PASS_MIN = 8;
const PASS_MAX = 72; // recomendado por bcrypt
const PASS_COMPLEXITY = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

// Lista corta de contraseñas muy comunes (evitar)
const COMMON_PASSWORDS = new Set([
  '123456', 'password', '123456789', 'qwerty', '12345678',
  '111111', '123123', 'abc123', 'password1', '1234567'
]);

const Reset = () => {
  const { fetchDataBackend } = useFetch();
  const { token } = useParams();
  const navigate = useNavigate();

  const [tokenback, setTokenBack] = useState(false);
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

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

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
      const url = `${import.meta.env.VITE_BACKEND_URL}/nuevo-password/${token}`;
      await fetchDataBackend(url, { password }, 'POST');
      toast.success('Contraseña actualizada correctamente. Redirigiendo...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      toast.error('Hubo un problema al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      const url = `${import.meta.env.VITE_BACKEND_URL}/recuperar-password/${token}`;
      try {
        await fetchDataBackend(url, null, 'GET');
        setTokenBack(true);
      } catch {
        toast.error('Token inválido o expirado');
        setTokenBack(false);
      }
    };
    verifyToken();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative flex items-center justify-center min-h-screen overflow-hidden px-4 py-8">
      <img
        src="/images/cec.jpg"
        alt="Fondo desenfocado"
        className="absolute inset-0 w-full h-full object-cover blur-sm"
      />
      {/* Contenido por encima del fondo */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md px-6 py-10 bg-white bg-opacity-60 rounded-lg shadow-md">
        <h1 className="font-bold text-4xl text-blue-700">
          Poli<span className="text-red-700">RED</span>
        </h1>
        <h2 className="font-lato text-2xl font-semibold mb-1 mt-7 text-center text-gray-700">
          Cambiar Contraseña
        </h2>
        <small className="text-gray-500 block my-4 text-sm text-center">
          Por favor, ingrese los siguientes datos
        </small>

        {tokenback && (
          <form className="w-full" onSubmit={handleSubmit(changePassword)} noValidate>
            {/* Nueva contraseña */}
            <div className="mb-4 relative">
              <label className="mb-2 block text-sm font-semibold">
                Nueva contraseña
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingresa tu nueva contraseña"
                autoComplete="new-password"
                className={`block w-full rounded-md border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-700`}
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
                      'Esta contraseña es demasiado común, intenta otra'
                  }
                })}
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute top-9 right-3 cursor-pointer text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              {errors.password && (
                <p className="text-red-800 text-sm mt-1">{errors.password.message}</p>
              )}
              <p className="text-xs text-gray-600 mt-1">
                Al menos 8 caracteres. Incluye mayúscula, minúscula, número y símbolo.
              </p>
            </div>

            {/* Confirmar contraseña */}
            <div className="mb-4 relative">
              <label className="mb-2 block text-sm font-semibold">
                Confirmar contraseña
              </label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
                className={`block w-full rounded-md border ${
                  errors.confirmpassword ? 'border-red-500' : 'border-gray-300'
                } focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-700`}
                {...register('confirmpassword', {
                  required: 'La confirmación es obligatoria',
                  validate: (value) =>
                    value?.trim() === watch('password')?.trim() || 'Las contraseñas no coinciden',
                })}
              />
              <span
                onClick={toggleConfirmPasswordVisibility}
                className="absolute top-9 right-3 cursor-pointer text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              {errors.confirmpassword && (
                <p className="text-red-800 text-sm mt-1">{errors.confirmpassword.message}</p>
              )}
            </div>

            <div className="mb-3">
              <button
                type="submit"
                disabled={loading || !tokenback}
                className={`bg-gray-700 text-white border py-2 w-full rounded-xl mt-5
                  hover:scale-105 duration-200 hover:bg-white transition-all${
                    loading || !tokenback
                      ? ' opacity-50 cursor-not-allowed'
                      : ' hover:text-gray-700'
                  }`}
              >
                {loading ? 'Enviando...' : 'Cambiar contraseña'}
              </button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default Reset;