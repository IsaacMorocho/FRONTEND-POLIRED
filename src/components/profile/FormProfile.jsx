import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../layout/AuthContext";
import { motion } from 'framer-motion';

const FormularioPerfil = () => {
  const { token, user, login } = useContext(AuthContext);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [celular, setCelular] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setNombre(user.nombre || "");
      setApellido(user.apellido || "");
      setCelular(user.celular || "");
    }
  }, [user]);

  const handleActualizar = async () => {
    if (nombre.trim().length < 2 || nombre.trim().length > 35) {
      toast.error("El nombre debe tener entre 2 y 35 caracteres");
      return;
    }
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre)) {
      toast.error("El nombre solo debe contener letras");
      return;
    }

    if (apellido.trim().length < 2 || apellido.trim().length > 35) {
      toast.error("El apellido debe tener entre 2 y 35 caracteres");
      return;
    }
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(apellido)) {
      toast.error("El apellido solo debe contener letras");
      return;
    }

    if (!/^\d{10}$/.test(celular)) {
      toast.error("El celular debe tener 10 dígitos numéricos");
      return;
    }

    const payload = {};
    if (nombre !== user?.nombre) payload.nombre = nombre;
    if (apellido !== user?.apellido) payload.apellido = apellido;
    if (celular !== user?.celular) payload.celular = celular;

    if (Object.keys(payload).length === 0) {
      toast.error("Debe cambiar al menos un campo para actualizar");
      return;
    }

    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/actualizar-superadmin`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Error al actualizar");
      }

      const updatedUser = { ...user, ...payload };
      login(token, updatedUser);
      toast.success("Información actualizada");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error al actualizar los datos");
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
                if (/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{0,35}$/.test(valor)) {
                  setNombre(valor);
                }
              }}
            />
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
                if (/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{0,35}$/.test(valor)) {
                  setApellido(valor);
                }
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Teléfono</label>
          <input
            type="text"
            placeholder="10 dígitos"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            value={celular}
            onChange={(e) => {
              const valor = e.target.value;
              if (/^\d{0,10}$/.test(valor)) {
                setCelular(valor);
              }
            }}
          />
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
