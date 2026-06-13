import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import superadminService from '../../services/superadminService';

const CardPassword = () => {

  const [showActual, setShowActual] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNuevo, setPasswordNuevo] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleActualizarPassword = async () => {
    if (!passwordActual.trim() || !passwordNuevo.trim()) {
      toast.error("Por favor, completa ambos campos");
      return;
    }

    if (/\s/.test(passwordActual) || /\s/.test(passwordNuevo)) {
      toast.error("La contraseña no debe contener espacios");
      return;
    }

    if (passwordNuevo.length < 8) {
      toast.error("La contraseña debe tener mínimo 8 caracteres");
      return;
    }

    if (passwordActual === passwordNuevo) {
      toast.error("La nueva contraseña debe ser diferente");
      return;
    }

    try {
      setCargando(true);
      await superadminService.updatePassword({
        passwordactual: passwordActual,
        passwordnuevo: passwordNuevo,
      });

      toast.success("Contraseña actualizada");
      setPasswordActual("");
      setPasswordNuevo("");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.msg || "Error al actualizar");
    } finally {
      setCargando(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6"
    >
      <h2 className="text-xl font-semibold text-white mb-6">Seguridad</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Contraseña Actual</label>
          <div className="relative">
            <input
              type={showActual ? "text" : "password"}
              placeholder="Ingresa tu contraseña actual"
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition pr-10"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowActual(!showActual)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-300"
            >
              {showActual ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Nueva Contraseña</label>
          <div className="relative">
            <input
              type={showNueva ? "text" : "password"}
              placeholder="Ingresa la nueva contraseña (mín. 8 caracteres)"
              value={passwordNuevo}
              onChange={(e) => setPasswordNuevo(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition pr-10"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowNueva(!showNueva)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-300"
            >
              {showNueva ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleActualizarPassword}
          disabled={cargando}
          className={`w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:shadow-lg transition ${
            cargando ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {cargando ? "Actualizando..." : "Actualizar Contraseña"}
        </button>
      </div>
    </motion.div>
  );
};

export default CardPassword;
