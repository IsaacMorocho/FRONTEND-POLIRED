import { useState, useEffect } from "react";
import { toast }  from "react-toastify";
import { FaTrashAlt } from "react-icons/fa";
import { motion } from 'framer-motion';
import adminRedService from "../../services/adminRedService";

const EstudiantesAR= () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Obtener lista de estudiantes
  const fetchEstudiantes = async () => {
    setLoading(true);
    try {
      const data = await adminRedService.getEstudiantes();
      setEstudiantes(data.estudiantes || []);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar estudiante
  const eliminarEstudiante = async () => {
    if (!selectedId) return;

    try {
      const data = await adminRedService.eliminarEstudiante(selectedId);
      toast.success(data.msg || "Estudiante eliminado");
      setEstudiantes((prev) =>
        prev.filter((est) => est._id !== selectedId)
      );
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error de conexión con el servidor");
    } finally {
      setModalOpen(false);
      setSelectedId(null);
    }
  };

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-lg mt-6"
    >
      <h2 className="text-xl font-bold text-white mb-4">Lista de Usuarios</h2>

      {loading ? (
        <p className="text-slate-400">Cargando Usuarios...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800 text-slate-300 border-b border-slate-700">
                <th className="p-3 font-medium">Nombre</th>
                <th className="p-3 font-medium">Apellido</th>
                <th className="p-3 font-medium hidden sm:table-cell">Correo Electrónico</th>
                <th className="p-3 font-medium text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
            {estudiantes.map((est) => (
              <tr key={est._id} className="border-b border-slate-700 hover:bg-slate-800/50 transition">
                <td className="p-3 text-slate-300">{est.nombre}</td>
                <td className="p-3 text-slate-300">{est.apellido}</td>  
                <td className="p-3 text-slate-300 hidden sm:table-cell">{est.email}</td>  
                            
                <td className="p-3 text-center">
                  <button
                    onClick={() => {
                      setSelectedId(est._id);
                      setModalOpen(true);
                    }}
                    className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded transition"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
            {estudiantes.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-slate-500">
                  No hay estudiantes registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          ></div>

          {/* Contenido del modal */}
          <div className="relative bg-slate-800 border border-slate-700 p-6 rounded-lg shadow-lg z-10 max-w-sm w-full">
            <h3 className="text-lg font-bold text-white mb-2">Confirmar eliminación</h3>
            <p className="text-slate-300 mb-6">
              ¿Estás seguro de que deseas eliminar este estudiante?
            </p>
            <div className="flex gap-2">
              <button
                onClick={eliminarEstudiante}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
              >
                Eliminar
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EstudiantesAR;
