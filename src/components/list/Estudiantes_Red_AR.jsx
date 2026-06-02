import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiTrash2, FiEye } from "react-icons/fi";
import { MdPeople } from "react-icons/md";
import axios from "axios";
import { AuthContext } from "../../layout/AuthContext";
import { motion } from 'framer-motion';

const EstudiantesRedAR = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState('todos');
  const [modalDetalles, setModalDetalles] = useState({ visible: false, estudiante: null });
  const { token: contextToken } = useContext(AuthContext);
  const token = contextToken || sessionStorage.getItem("token");

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  // Cargar estudiantes de la red
  const fetchEstudiantes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/admin/estudiantes/listar`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEstudiantes(Array.isArray(res.data) ? res.data : res.data.estudiantes || []);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar estudiantes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchEstudiantes();
  }, [token]);

  // Filtrar estudiantes
  const estudiantesFiltrados = estudiantes.filter(est => {
    if (filtro === 'todos') return true;
    if (filtro === 'activos') return !est.suspendido;
    if (filtro === 'suspendidos') return est.suspendido;
    return true;
  });

  // Eliminar estudiante
  const handleEliminar = async (estudianteId) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este estudiante?")) return;
    try {
      await axios.delete(`${API_BASE}/admin/estudiantes/eliminar/${estudianteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEstudiantes(estudiantes.filter(e => e._id !== estudianteId));
      toast.success("Estudiante eliminado");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar estudiante");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 bg-slate-900 rounded-lg p-6"
    >
      {/* Encabezado */}
      <div>
        <h1 style={{ fontFamily: 'Lora, serif' }} className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <MdPeople size={32} /> Estudiantes de mi Red
        </h1>
        <p className="text-slate-400">Gestiona los estudiantes pertenecientes a tu red comunitaria</p>
      </div>

      {/* Filtros */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
        <div className="flex gap-2 flex-wrap">
          {['todos', 'activos', 'suspendidos'].map((opcion) => (
            <button
              key={opcion}
              onClick={() => setFiltro(opcion)}
              className={`px-4 py-2 rounded-lg transition text-sm font-medium capitalize ${
                filtro === opcion
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:text-white'
              }`}
            >
              {opcion === 'todos' ? 'Todos' : opcion === 'activos' ? 'Activos' : 'Suspendidos'}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de estudiantes */}
      {loading ? (
        <div className="text-slate-400 text-center py-12">Cargando estudiantes...</div>
      ) : estudiantesFiltrados.length === 0 ? (
        <div className="text-slate-400 text-center py-12">No hay estudiantes en tu red</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-300">Nombre</th>
                <th className="px-4 py-3 font-semibold text-slate-300">Email</th>
                <th className="px-4 py-3 font-semibold text-slate-300">Celular</th>
                <th className="px-4 py-3 font-semibold text-slate-300">Estado</th>
                <th className="px-4 py-3 font-semibold text-slate-300">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {estudiantesFiltrados.map((estudiante) => (
                <motion.tr
                  key={estudiante._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-slate-800/30 hover:bg-slate-800/50 transition"
                >
                  <td className="px-4 py-3 text-white font-medium">
                    {estudiante.nombre} {estudiante.apellido}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{estudiante.email}</td>
                  <td className="px-4 py-3 text-slate-400">{estudiante.celular || 'N/A'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      estudiante.suspendido 
                        ? 'bg-red-900/30 text-red-300' 
                        : 'bg-green-900/30 text-green-300'
                    }`}>
                      {estudiante.suspendido ? 'Suspendido' : 'Activo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setModalDetalles({ visible: true, estudiante })}
                        className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded transition"
                        title="Ver detalles"
                      >
                        <FiEye size={18} />
                      </button>
                      <button
                        onClick={() => handleEliminar(estudiante._id)}
                        className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded transition"
                        title="Eliminar"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Detalles */}
      {modalDetalles.visible && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-md w-full"
          >
            <h2 className="text-xl font-bold text-white mb-4">Detalles del Estudiante</h2>
            <div className="space-y-3 mb-6">
              <div>
                <label className="text-sm font-medium text-slate-400">Nombre Completo</label>
                <p className="text-white">{modalDetalles.estudiante?.nombre} {modalDetalles.estudiante?.apellido}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400">Email</label>
                <p className="text-white break-all">{modalDetalles.estudiante?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400">Celular</label>
                <p className="text-white">{modalDetalles.estudiante?.celular || 'No registrado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400">Estado</label>
                <p className={`font-medium ${
                  modalDetalles.estudiante?.suspendido ? 'text-red-400' : 'text-green-400'
                }`}>
                  {modalDetalles.estudiante?.suspendido ? 'Suspendido' : 'Activo'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400">Roles</label>
                <div className="flex gap-2 flex-wrap mt-1">
                  {modalDetalles.estudiante?.roles?.map((rol) => (
                    <span key={rol} className="bg-purple-600/30 text-purple-300 text-xs px-2 py-1 rounded">
                      {rol}
                    </span>
                  )) || <p className="text-slate-400">Sin roles</p>}
                </div>
              </div>
            </div>
            <button
              onClick={() => setModalDetalles({ visible: false, estudiante: null })}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition"
            >
              Cerrar
            </button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default EstudiantesRedAR;
