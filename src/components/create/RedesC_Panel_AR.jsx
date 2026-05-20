import { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../../layout/AuthContext";
import { toast } from "react-toastify";
import { motion } from 'framer-motion';

const NAME_MIN = 2;
const NAME_MAX = 60;
const DESC_MIN = 10;
const DESC_MAX = 1000;

const normalizeSpaces = (s = "") => s.replace(/\s+/g, " ").trim();

const validateNombre = (value) => {
  const v = normalizeSpaces(value);
  if (v.length < NAME_MIN) {
    toast.error(`El nombre debe tener al menos ${NAME_MIN} caracteres.`, { autoClose: 3000 });
    return false;
  }
  if (v.length > NAME_MAX) {
    toast.error(`El nombre no puede superar ${NAME_MAX} caracteres.`, { autoClose: 3000 });
    return false;
  }
  return true;
};

const validateDescripcion = (value) => {
  const v = normalizeSpaces(value);
  if (v.length < DESC_MIN) {
    toast.error(`La descripción debe tener al menos ${DESC_MIN} caracteres.`, { autoClose: 3000 });
    return false;
  }
  if (v.length > DESC_MAX) {
    toast.error(`La descripción no puede superar ${DESC_MAX} caracteres.`, { autoClose: 3000 });
    return false;
  }
  return true;
};

const RedesC_Panel_AR = () => {
  const { token } = useContext(AuthContext);
  const [red, setRed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [touched, setTouched] = useState({ nombre: false, descripcion: false });

  useEffect(() => {
    const fetchRed = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/red/admin/informacion`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRed(res.data.red);
        setNombre(res.data.red.nombre || "");
        setDescripcion(res.data.red.descripcion || "");
      } catch (error) {
        console.error("Error al obtener la red:", error);
        toast.error("Error al cargar la información de la red", { autoClose: 3000 });
      } finally {
        setLoading(false);
      }
    };
    fetchRed();
  }, [token]);

  const errors = useMemo(() => {
    const n = normalizeSpaces(nombre);
    const d = normalizeSpaces(descripcion);
    return {
      nombre:
        n.length === 0
          ? "El nombre es obligatorio."
          : n.length < NAME_MIN
          ? `El nombre debe tener al menos ${NAME_MIN} caracteres.`
          : n.length > NAME_MAX
          ? `El nombre no puede superar ${NAME_MAX} caracteres.`
          : "",
      descripcion:
        d.length === 0
          ? "La descripción es obligatoria."
          : d.length < DESC_MIN
          ? `La descripción debe tener al menos ${DESC_MIN} caracteres.`
          : d.length > DESC_MAX
          ? `La descripción no puede superar ${DESC_MAX} caracteres.`
          : "",
    };
  }, [nombre, descripcion]);

  const hasBlockingErrors = !!(errors.nombre || errors.descripcion);

  const handleActualizar = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !descripcion.trim()) {
      toast.warning("Todos los campos son obligatorios", { autoClose: 3000 });
      return;
    }
    if (!validateNombre(nombre) || !validateDescripcion(descripcion)) {
      setTouched({ nombre: true, descripcion: true });
      return;
    }

    try {
      const res = await axios.put(
        "https://backendv2-as6n.onrender.com/api/admin/actualizar/red",
        { nombre: normalizeSpaces(nombre), descripcion: normalizeSpaces(descripcion) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.msg || "Red actualizada correctamente.", { autoClose: 3000 });
      setRed(res.data.red);
      setNombre(res.data.red?.nombre ?? normalizeSpaces(nombre));
      setDescripcion(res.data.red?.descripcion ?? normalizeSpaces(descripcion));
      setTouched({ nombre: false, descripcion: false });
    } catch (error) {
      console.error("Error al actualizar la red:", error);
      toast.error(error.response?.data?.msg || "Error al actualizar la red", { autoClose: 3000 });
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <p className="text-center text-gray-500">Cargando información...</p>;
  }

  if (!red) {
    return <p className="text-center text-gray-500">No se encontró la red</p>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="max-w-3xl mx-auto p-3 md:p-4"
    >
      <h1 className="text-xl md:text-2xl font-bold text-center mb-3 md:mb-4">{red.nombre}</h1>
      <p
        className="text-blue-600 underline cursor-pointer text-center mb-4 md:mb-6 text-sm md:text-base"
        onClick={() => setModalOpen(true)}
      >
        Ver detalles de la red
      </p>

      {/* Modal Detalles */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          ></div>
          <div className="relative bg-white p-4 md:p-6 rounded-lg shadow-lg max-w-md w-full z-10">
            <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Detalles de la Red</h2>
            <p className="text-sm md:text-base mb-2"><strong>ID:</strong> {red._id}</p>
            <p className="text-sm md:text-base mb-2"><strong>Nombre:</strong> {red.nombre}</p>
            <p className="text-sm md:text-base mb-2"><strong>Descripción:</strong> {red.descripcion}</p>
            <p className="text-sm md:text-base mb-2"><strong>Miembros:</strong> {red.miembros?.length ?? red.cantidadMiembros}</p>
            <p className="text-sm md:text-base mb-2"><strong>Creada:</strong> {formatearFecha(red.createdAt)}</p>
            <p className="text-sm md:text-base mb-2"><strong>Actualizada:</strong> {formatearFecha(red.updatedAt)}</p>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="flex items-center justify-center w-auto mt-4 bg-white border border-slate-400 text-gray-700 px-4 py-2 rounded shadow-md 
                        hover:bg-gray-700 hover:scale-102 duration-200 hover:text-white transition-al"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulario de actualización */}
      <form
        onSubmit={handleActualizar}
        className="bg-slate-300 p-6 rounded-lg shadow-lg  space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value.slice(0, NAME_MAX))}
            onBlur={() => {
              setNombre((prev) => normalizeSpaces(prev));
              if (nombre) validateNombre(nombre);
              setTouched((t) => ({ ...t, nombre: true }));
            }}
            maxLength={NAME_MAX}
            className={`w-full border rounded px-3 py-2 ${
              touched.nombre && errors.nombre ? "border-red-500" : "border-gray-800"
            }`}
            placeholder="Nombre de la red"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>Mín. {NAME_MIN} caracteres</span>
            <span>{normalizeSpaces(nombre).length}/{NAME_MAX}</span>
          </div>
          {touched.nombre && errors.nombre && (
            <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value.slice(0, DESC_MAX))}
            onBlur={() => {
              setDescripcion((prev) => normalizeSpaces(prev));
              if (descripcion) validateDescripcion(descripcion);
              setTouched((t) => ({ ...t, descripcion: true }));
            }}
            maxLength={DESC_MAX}
            className={`w-full border rounded px-3 py-2 ${
              touched.descripcion && errors.descripcion ? "border-red-500" : "border-gray-800"
            }`}
            placeholder="Descripción de la red"
            rows="3"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>Mín. {DESC_MIN} caracteres</span>
            <span>{normalizeSpaces(descripcion).length}/{DESC_MAX}</span>
          </div>
          {touched.descripcion && errors.descripcion && (
            <p className="mt-1 text-xs text-red-600">{errors.descripcion}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={hasBlockingErrors}
          className={`flex items-center justify-center w-auto mt-3 md:mt-4 px-3 md:px-4 py-2 rounded shadow-md border transition-all text-sm md:text-base
            ${
              hasBlockingErrors
                ? "bg-gray-200 border-slate-200 text-gray-400 cursor-not-allowed"
                : "bg-white border border-slate-400 text-gray-700 hover:bg-gray-700 hover:scale-102 hover:text-white"
            }`}
        >
          Actualizar
        </button>
      </form>
    </motion.div>
    
  );
};

export default RedesC_Panel_AR;