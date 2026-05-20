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

  // Inicializar con lo que venga del contexto
  useEffect(() => {
    if (user) {
      setNombre(user.nombre || "");
      setApellido(user.apellido || "");
      setCelular(user.celular || "");
    }
  }, [user]);

const handleActualizar = async () => {
  // Validaciones antes de construir payload
  if (nombre.trim().length < 2 || nombre.trim().length > 35) {
    toast.error("El nombre debe tener entre 2 y 35 caracteres",{ autoClose: 3000 });
    return;
  }
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre)) {
    toast.error("El nombre solo debe contener letras y espacios",{ autoClose: 3000 });
    return;
  }

  if (apellido.trim().length < 2 || apellido.trim().length > 35) {
    toast.error("El apellido debe tener entre 2 y 35 caracteres",{ autoClose: 3000 });
    return;
  }
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(apellido)) {
    toast.error("El apellido solo debe contener letras y espacios",{ autoClose: 3000 });
    return;
  }

  if (!/^\d{10}$/.test(celular)) {
    toast.error("El celular debe tener exactamente 10 dígitos numéricos",{ autoClose: 3000 });
    return;
  }

  const payload = {};
  if (nombre !== user?.nombre) payload.nombre = nombre;
  if (apellido !== user?.apellido) payload.apellido = apellido;
  if (celular !== user?.celular) payload.celular = celular;

  if (Object.keys(payload).length === 0) {
    toast.error("Debe llenar al menos un campo diferente para actualizar.",{ autoClose: 3000 });
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
    toast.success("Información actualizada correctamente.",{ autoClose: 3000 });

  } catch (error) {
    console.error(error);
    toast.dismiss();
    toast.error(error.message || "Error al actualizar los datos.");
  } finally {
    setLoading(false);
  }
};


return (
  <motion.form
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <div className="flex flex-col md:flex-row md:gap-4 mb-4 md:mb-5 mt-6 md:mt-8">
      <div className="md:w-1/2 mb-4 md:mb-0">
        <label className="mb-2 block text-xs md:text-sm font-semibold">Nombre</label>
        <input
          type="text"
          placeholder="Ingresa tu nombre"
          className="shadow-md block w-full rounded-md border border-gray-300 py-1 px-2 text-sm md:text-base text-gray-500"
          value={nombre}
          onChange={(e) => {
            const valor = e.target.value;
            if (/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{0,35}$/.test(valor)) {
              setNombre(valor);
            }
          }}
        />
      </div>

      <div className="md:w-1/2">
        <label className="mb-2 block text-sm font-semibold">Apellido</label>
        <input
          type="text"
          placeholder="Ingresa tu apellido"
          className="shadow-md block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500"
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

    <div className="mb-5">
      <label className="mb-2 block text-sm font-semibold">Celular</label>
      <input
        type="text"
        placeholder="Ingresa su celular"
        className="shadow-md block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500"
        value={celular}
        onChange={(e) => {
          const valor = e.target.value;
          if (/^\d{0,10}$/.test(valor)) {
            setCelular(valor);
          }
        }}
      />
    </div>

    <div className="text-center">
      <button
        type="button"
        onClick={handleActualizar}
        disabled={loading}
        className={`bg-white border border-gray-400 text-gray-700 px-4 py-2 rounded shadow-md 
          hover:bg-gray-700 hover:scale-105 duration-200 hover:text-white transition-all ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
      >
        {loading ? "Actualizando..." : "Actualizar Información"}
      </button>
    </div>
  </motion.form>
);


};

export default FormularioPerfil;
