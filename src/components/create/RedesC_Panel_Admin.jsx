import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../layout/AuthContext.jsx";
import { RiPlayListAddLine } from "react-icons/ri";
import { MdDeleteForever, MdPublishedWithChanges } from "react-icons/md";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

export const RedesC_Panel_Admin = () => {
  const { token } = useContext(AuthContext);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [redes, setRedes] = useState([]);
  const [modal, setModal] = useState({ type: null, visible: false, red: null });

  const NAME_MIN = 2;
  const NAME_MAX = 60; 
  const DESC_MIN = 10;
  const DESC_MAX = 1000;

  const isBlank = (s) => !s || s.trim().length === 0;

  const validateNombre = (value) => {
    const v = (value ?? "").trim();
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
    const v = (value ?? "").trim();
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

  const fetchRedes = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/redes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Error al obtener redes");
      setRedes(data);
    } catch (error) {
      console.error("Error al obtener redes:", error);
      toast.error("Error al cargar redes comunitarias", { autoClose: 3000 });
    }
  };

  useEffect(() => {
    fetchRedes();
  }, []);

  // Crear red comunitaria
  const handleSubmit = async (e) => {
    e.preventDefault();

    //validaciones
    if (isBlank(nombre) || isBlank(descripcion)) {
      toast.error("Completa todos los campos obligatorios", { autoClose: 3000 });
      return;
    }
    if (!validateNombre(nombre)) return;
    if (!validateDescripcion(descripcion)) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/crear-red`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nombre: nombre.trim(), descripcion: descripcion.trim() })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al crear red");

      toast.success("Red creada correctamente", { autoClose: 3000 });
      setNombre("");
      setDescripcion("");
      fetchRedes();
    } catch (error) {
      console.error("Error al crear red:", error);
      toast.error(error.message || "Error al crear red", { autoClose: 3000 });
    }
  };

  // Actualizar red comunitaria
  const handleUpdate = async (e) => {
    e.preventDefault();

    const nombreUpd = modal.red?.nombre ?? "";
    const descUpd = modal.red?.descripcion ?? "";

    //validaciones
    if (isBlank(nombreUpd) || isBlank(descUpd)) {
      toast.error("Completa todos los campos obligatorios", { autoClose: 3000 });
      return;
    }
    if (!validateNombre(nombreUpd)) return;
    if (!validateDescripcion(descUpd)) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/actualizar-red/${modal.red._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: nombreUpd.trim(),
          descripcion: descUpd.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al actualizar red");

      toast.success("Red actualizada correctamente", { autoClose: 3000 });
      setModal({ type: null, visible: false, red: null });
      fetchRedes();
    } catch (error) {
      console.error("Error al actualizar red:", error);
      toast.error(error.message || "Error al actualizar red", { autoClose: 3000 });
    }
  };

  // Eliminar red comunitaria
  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(`https://backendv2-as6n.onrender.com/api/eliminar-red/${modal.red._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al eliminar red");

      toast.success("Red eliminada correctamente", { autoClose: 3000 });
      setModal({ type: null, visible: false, red: null });
      fetchRedes();
    } catch (error) {
      console.error("Error al eliminar red:", error);
      toast.error(error.message || "Error al eliminar red", { autoClose: 3000 });
    }
  };

return (
  <motion.div 
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
    className="max-w-5xl mx-auto p-3 md:p-4"
  >

    {/* Formulario Crear Red */}
    <form onSubmit={handleSubmit}>
      <fieldset className="bg-slate-300 p-4 md:p-6 rounded-lg shadow-lg mb-4 md:mb-6">
        <legend className="text-lg md:text-xl font-bold text-gray-300 bg-gray-700 px-3 md:px-4 py-1 rounded-md">
          Crear nueva red comunitaria
        </legend>

        <div className="space-y-3 md:space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onBlur={() => validateNombre(nombre)}
              maxLength={NAME_MAX}
              className={`w-full p-2 rounded-md border
                ${
                  nombre.trim().length > 0 &&
                  (nombre.trim().length < NAME_MIN || nombre.trim().length > NAME_MAX)
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-700"
                }`}
              required
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Mín. {NAME_MIN} caracteres</span>
              <span>{nombre.trim().length}/{NAME_MAX}</span>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              onBlur={() => validateDescripcion(descripcion)}
              maxLength={DESC_MAX}
              className={`w-full p-2 rounded-md border
                ${
                  descripcion.trim().length > 0 &&
                  (descripcion.trim().length < DESC_MIN || descripcion.trim().length > DESC_MAX)
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-700"
                }`}
              required
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Mín. {DESC_MIN} caracteres</span>
              <span>{descripcion.trim().length}/{DESC_MAX}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={
            nombre.trim().length < NAME_MIN ||
            nombre.trim().length > NAME_MAX ||
            descripcion.trim().length < DESC_MIN ||
            descripcion.trim().length > DESC_MAX
          }
          className={`flex items-center justify-center w-auto mt-4 px-4 py-2 rounded shadow-md border
            ${
              nombre.trim().length < NAME_MIN ||
              nombre.trim().length > NAME_MAX ||
              descripcion.trim().length < DESC_MIN ||
              descripcion.trim().length > DESC_MAX
                ? "bg-gray-200 border-slate-200 text-gray-400 cursor-not-allowed"
                : "bg-white border-slate-300 text-gray-700 hover:bg-gray-700 hover:scale-102 hover:text-white transition-all duration-200"
            }`}
        >
          <RiPlayListAddLine className="mr-2" />
          Crear Red Comunitaria
        </button>
      </fieldset>
    </form>

    {/* Lista de Redes Comunitarias */}
    <div className="bg-slate-300 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Redes Comunitarias</h2>

      {redes.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-700">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="py-2 px-4 border border-gray-600 text-center">Nombre</th>
                <th className="py-2 px-4 border border-gray-600 text-center">Descripcion</th>
                <th className="py-2 px-4 border border-gray-600 text-center">Fecha de creacion</th>
                <th className="py-2 px-4 border border-gray-600 text-center">Cantidad de miembros</th>
                <th className="py-2 px-4 border border-gray-600 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {redes.map((red) => (
                <tr key={red._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border border-gray-600 text-center">{red.nombre}</td>
                  <td className="py-2 px-4 border border-gray-600 text-center">{red.descripcion}</td>
                  <td className="py-2 px-4 border border-gray-600 text-center">
                    {new Date(red.createdAt).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </td>
                  <td className="py-2 px-4 border border-gray-600 text-center">{red.cantidadMiembros}</td>
                  <td className="py-2 px-4 border border-gray-600">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => setModal({ type: "update", visible: true, red })}
                        title="Actualizar"
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <MdPublishedWithChanges className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setModal({ type: "delete", visible: true, red })}
                        title="Eliminar"
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <MdDeleteForever className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center py-4">No hay redes comunitarias registradas</p>
      )}
    </div>

    {/* Modal Actualizar Red */}
    {modal.visible && modal.type === "update" && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 relative">
          <button
            onClick={() => setModal({ type: null, visible: false, red: null })}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold"
          >
            &times;
          </button>

          <h3 className="text-lg font-bold mb-4 text-center">Actualizar Red Comunitaria</h3>
          <form onSubmit={handleUpdate} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                value={modal.red?.nombre || ""}
                onChange={(e) =>
                  setModal((prev) => ({
                    ...prev,
                    red: { ...prev.red, nombre: e.target.value },
                  }))
                }
                onBlur={() => validateNombre(modal.red?.nombre || "")}
                maxLength={NAME_MAX}
                className={`w-full p-2 rounded-md border
                  ${
                    ((modal.red?.nombre || "").trim().length > 0 &&
                      (((modal.red?.nombre || "").trim().length < NAME_MIN) ||
                        ((modal.red?.nombre || "").trim().length > NAME_MAX))) ||
                    false
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-700"
                  }`}
                required
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Mín. {NAME_MIN} caracteres</span>
                <span>{(modal.red?.nombre || "").trim().length}/{NAME_MAX}</span>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <input
                type="text"
                value={modal.red?.descripcion || ""}
                onChange={(e) =>
                  setModal((prev) => ({
                    ...prev,
                    red: { ...prev.red, descripcion: e.target.value },
                  }))
                }
                onBlur={() => validateDescripcion(modal.red?.descripcion || "")}
                maxLength={DESC_MAX}
                className={`w-full p-2 rounded-md border
                  ${
                    ((modal.red?.descripcion || "").trim().length > 0 &&
                      (((modal.red?.descripcion || "").trim().length < DESC_MIN) ||
                        ((modal.red?.descripcion || "").trim().length > DESC_MAX))) ||
                    false
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-700"
                  }`}
                required
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Mín. {DESC_MIN} caracteres</span>
                <span>{(modal.red?.descripcion || "").trim().length}/{DESC_MAX}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                (modal.red?.nombre || "").trim().length < NAME_MIN ||
                (modal.red?.nombre || "").trim().length > NAME_MAX ||
                (modal.red?.descripcion || "").trim().length < DESC_MIN ||
                (modal.red?.descripcion || "").trim().length > DESC_MAX
              }
              className={`w-full px-4 py-2 rounded border transition-colors
                ${
                  (modal.red?.nombre || "").trim().length < NAME_MIN ||
                  (modal.red?.nombre || "").trim().length > NAME_MAX ||
                  (modal.red?.descripcion || "").trim().length < DESC_MIN ||
                  (modal.red?.descripcion || "").trim().length > DESC_MAX
                    ? "bg-gray-200 border-slate-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-700 text-white hover:bg-slate-300 hover:text-gray-700"
                }`}
            >
              Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    )}

    {/* Modal Eliminar Red */}
    {modal.visible && modal.type === "delete" && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-80 relative">
          <button
            onClick={() => setModal({ type: null, visible: false, red: null })}
            className="text-xl font-bold absolute top-2 right-4"
          >
            ×
          </button>
          <p className="mb-4">
            ¿Eliminar la red <strong>"{modal.red?.nombre}"</strong>?
            <br />
            Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setModal({ type: null, visible: false, red: null })}
              className="px-3 md:px-4 py-2 border border-gray-700 rounded hover:bg-gray-100 text-sm md:text-base"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-3 md:px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm md:text-base"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    )}
  </motion.div>
);
};
export default RedesC_Panel_Admin;