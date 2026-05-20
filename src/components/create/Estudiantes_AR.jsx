import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../layout/AuthContext";
import { toast }  from "react-toastify";
import { FaTrashAlt } from "react-icons/fa";
import { motion } from 'framer-motion';

const EstudiantesAR= () => {
  const { token } = useContext(AuthContext);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Obtener lista de estudiantes
  const fetchEstudiantes = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://backendv2-as6n.onrender.com/api/admin/estudiantes/listar",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setEstudiantes(data.estudiantes || []);
      } else {
        toast.error(data.msg || "Error al obtener estudiantes");
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar estudiante
  const eliminarEstudiante = async () => {
    if (!selectedId) return;

    try {
      const res = await fetch(
        `https://backendv2-as6n.onrender.com/api/admin/estudiantes/eliminar/${selectedId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(data.msg);
        setEstudiantes((prev) =>
          prev.filter((est) => est._id !== selectedId)
        );
      } else {
        toast.error(data.msg || "Error al eliminar estudiante");
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor");
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
      className="p-4 md:p-6 bg-slate-300"
    >
      <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Lista de Estudiantes</h2>

      {loading ? (
        <p className="text-sm md:text-base">Cargando...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg overflow-hidden text-sm md:text-base">
            <thead className="bg-gray-400">
              <tr>
                <th className="p-2 md:p-3 border">Nombre</th>
                <th className="p-2 md:p-3 border">Apellido</th>
                <th className="p-2 md:p-3 border hidden sm:table-cell">Correo Electronico</th>
                
                <th className="p-2 md:p-3 border text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
            {estudiantes.map((est) => (
              <tr key={est._id} className="hover:bg-gray-50">
                <td className="p-3 border">{est.nombre}</td>
                <td className="p-3 border">{est.apellido}</td>  
                <td className="p-3 border">{est.email}</td>  
                            
                <td className="p-3 border text-center">
                  <button
                    onClick={() => {
                      setSelectedId(est._id);
                      setModalOpen(true);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
            {estudiantes.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  No hay estudiantes registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          ></div>

          {/* Contenido del modal */}
          <div className="relative bg-white p-6 rounded-lg shadow-lg z-10 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirmar eliminación</h3>
            <p className="mb-4">
              ¿Estás seguro de que deseas eliminar este estudiante?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-3 md:px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm md:text-base"
              >
                Cancelar
              </button>
              <button
                onClick={eliminarEstudiante}
                className="px-3 md:px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm md:text-base"
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

export default EstudiantesAR;
