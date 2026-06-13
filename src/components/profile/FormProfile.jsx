import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../layout/AuthContext";
import { motion } from 'framer-motion';
import superadminService from "../../services/superadminService";

const FormularioPerfil = () => {
  const { token, user, login } = useContext(AuthContext);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setNombre(user.nombre || "");
      setApellido(user.apellido || "");
    }
  }, [user]);

  // Validar caracteres repetidos consecutivos (3 o más del mismo)
  const tieneCaracteresRepetidos = (texto) => {
    return /(.)\1{2,}/.test(texto);
  };

  // Validar nombre
  const validarNombre = (valor) => {
    if (valor.trim().length < 2) {
      return "El nombre debe tener mínimo 2 caracteres";
    }
    if (valor.trim().length > 35) {
      return "El nombre debe tener máximo 35 caracteres";
    }
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(valor)) {
      return "El nombre solo debe contener letras";
    }
    if (tieneCaracteresRepetidos(valor)) {
      return "El nombre no puede tener caracteres repetidos consecutivos";
    }
    return null;
  };

  // Validar apellido
  const validarApellido = (valor) => {
    if (valor.trim().length < 2) {
      return "El apellido debe tener mínimo 2 caracteres";
    }
    if (valor.trim().length > 35) {
      return "El apellido debe tener máximo 35 caracteres";
    }
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(valor)) {
      return "El apellido solo debe contener letras";
    }
    if (tieneCaracteresRepetidos(valor)) {
      return "El apellido no puede tener caracteres repetidos consecutivos";
    }
    return null;
  };

  const handleActualizar = async () => {
    // Validar nombre
    const errorNombre = validarNombre(nombre);
    if (errorNombre) {
      toast.error(errorNombre);
      return;
    }

    // Validar apellido
    const errorApellido = validarApellido(apellido);
    if (errorApellido) {
      toast.error(errorApellido);
      return;
    }

    const payload = {};
    let cambioDetectado = false;

    // Solo agregar al payload si cambió
    if (nombre !== user?.nombre) {
      payload.nombre = nombre;
      cambioDetectado = true;
    }
    if (apellido !== user?.apellido) {
      payload.apellido = apellido;
      cambioDetectado = true;
    }

    if (!cambioDetectado) {
      toast.error("Debe cambiar al menos un campo para actualizar");
      return;
    }

    setLoading(true);
    try {
      await superadminService.updatePerfil(payload);
      const updatedUser = { ...user, ...payload };
      login(token, updatedUser);
      toast.success("Información actualizada correctamente");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "Error al actualizar los datos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6"
    >
      <h2 className="text-xl font-semibold text-white mb-6">Información Personal</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Nombre</label>
            <input
              type="text"
              placeholder="Nombre"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
              value={nombre}
              onChange={(e) => {
                const valor = e.target.value;
                // Solo permite letras, espacios y acentos, sin caracteres repetidos consecutivos
                if (/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{0,35}$/.test(valor)) {
                  setNombre(valor);
                }
              }}
            />
            <p className="text-xs text-slate-400 mt-1">Máximo 35 caracteres, solo letras</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Apellido</label>
            <input
              type="text"
              placeholder="Apellido"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
              value={apellido}
              onChange={(e) => {
                const valor = e.target.value;
                // Solo permite letras, espacios y acentos, sin caracteres repetidos consecutivos
                if (/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{0,35}$/.test(valor)) {
                  setApellido(valor);
                }
              }}
            />
            <p className="text-xs text-slate-400 mt-1">Máximo 35 caracteres, solo letras</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleActualizar}
          disabled={loading}
          className={`w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:shadow-lg transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Actualizando..." : "Guardar Cambios"}
        </button>
      </div>
    </motion.div>
  );
};

export default FormularioPerfil;
