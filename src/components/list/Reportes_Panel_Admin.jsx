import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";
import { MdWarning, MdAssignmentTurnedIn } from "react-icons/md";
import { BiErrorCircle } from "react-icons/bi";
import axios from "axios";
import { AuthContext } from "../../layout/AuthContext";
import { motion } from 'framer-motion';

const ReportesPanelAdmin = () => {
  const [reportesUsuarios, setReportesUsuarios] = useState([]);
  const [reportesRedes, setReportesRedes] = useState([]);
  const [reportesApp, setReportesApp] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('usuarios'); // 'usuarios', 'redes', 'app'
  const [modalDetalles, setModalDetalles] = useState({ visible: false, reporte: null, tipo: null });
  const { token: contextToken } = useContext(AuthContext);
  const token = contextToken || sessionStorage.getItem("token");

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  // Obtener reportes de usuarios (GET /reportes/usuarios)
  const fetchReportesUsuarios = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/reportes/usuarios`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportesUsuarios(res.data.reportes || []);
      toast.success("Reportes de usuarios cargados");
    } catch (error) {
      console.error("Error al cargar reportes:", error);
      toast.error(error.response?.data?.msg || "Error al cargar reportes");
    } finally {
      setLoading(false);
    }
  };

  // Obtener reportes de redes (GET /reportes/redes)
  const fetchReportesRedes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/reportes/redes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportesRedes(res.data.reportes || []);
      toast.success("Reportes de redes cargados");
    } catch (error) {
      console.error("Error al cargar reportes:", error);
      toast.error(error.response?.data?.msg || "Error al cargar reportes");
    } finally {
      setLoading(false);
    }
  };

  // Obtener reportes de app (GET /reportes/app)
  const fetchReportesApp = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/reportes/app`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportesApp(res.data.reportes || []);
      toast.success("Reportes de app cargados");
    } catch (error) {
      console.error("Error al cargar reportes:", error);
      toast.error(error.response?.data?.msg || "Error al cargar reportes");
    } finally {
      setLoading(false);
    }
  };

  // Resolver reporte de usuario (PATCH /reportes/usuarios/:id/resolver)
  const handleResolverUsuario = async (id, estado) => {
    try {
      await axios.patch(`${API_BASE}/reportes/usuarios/${id}/resolver`, { estado }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportesUsuarios(reportesUsuarios.filter(r => r._id !== id));
      toast.success(`Reporte ${estado.toLowerCase()}`);
      setModalDetalles({ visible: false, reporte: null, tipo: null });
    } catch (error) {
      console.error("Error al resolver:", error);
      toast.error(error.response?.data?.msg || "Error al resolver reporte");
    }
  };

  // Resolver reporte de red (PATCH /reportes/redes/:id/resolver)
  const handleResolverRed = async (id, estado) => {
    try {
      await axios.patch(`${API_BASE}/reportes/redes/${id}/resolver`, { estado }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportesRedes(reportesRedes.filter(r => r._id !== id));
      toast.success(`Reporte ${estado.toLowerCase()}`);
      setModalDetalles({ visible: false, reporte: null, tipo: null });
    } catch (error) {
      console.error("Error al resolver:", error);
      toast.error(error.response?.data?.msg || "Error al resolver reporte");
    }
  };

  // Resolver reporte de app (PATCH /reportes/app/:id/resolver)
  const handleResolverApp = async (id, estado) => {
    try {
      await axios.patch(`${API_BASE}/reportes/app/${id}/resolver`, { estado }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportesApp(reportesApp.filter(r => r._id !== id));
      toast.success(`Reporte ${estado.toLowerCase()}`);
      setModalDetalles({ visible: false, reporte: null, tipo: null });
    } catch (error) {
      console.error("Error al resolver:", error);
      toast.error(error.response?.data?.msg || "Error al resolver reporte");
    }
  };

  // Eliminar reporte de usuario (DELETE /reportes/usuarios/:id)
  const handleEliminarUsuario = async (id) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este reporte?")) return;
    
    try {
      await axios.delete(`${API_BASE}/reportes/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportesUsuarios(reportesUsuarios.filter(r => r._id !== id));
      toast.success("Reporte eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error(error.response?.data?.msg || "Error al eliminar reporte");
    }
  };

  // Eliminar reporte de red (DELETE /reportes/redes/:id)
  const handleEliminarRed = async (id) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este reporte?")) return;
    
    try {
      await axios.delete(`${API_BASE}/reportes/redes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportesRedes(reportesRedes.filter(r => r._id !== id));
      toast.success("Reporte eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error(error.response?.data?.msg || "Error al eliminar reporte");
    }
  };

  // Eliminar reporte de app (DELETE /reportes/app/:id)
  const handleEliminarApp = async (id) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este reporte?")) return;
    
    try {
      await axios.delete(`${API_BASE}/reportes/app/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportesApp(reportesApp.filter(r => r._id !== id));
      toast.success("Reporte eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error(error.response?.data?.msg || "Error al eliminar reporte");
    }
  };

  useEffect(() => {
    if (tab === 'usuarios') {
      fetchReportesUsuarios();
    } else if (tab === 'redes') {
      fetchReportesRedes();
    } else if (tab === 'app') {
      fetchReportesApp();
    }
  }, [tab]);

  const getTipoIcon = (tipo) => {
    const iconProps = { size: 20 };
    switch (tipo?.toLowerCase()) {
      case 'spam':
        return <BiErrorCircle {...iconProps} className="text-yellow-600" />;
      case 'insultos':
        return <MdWarning {...iconProps} className="text-red-600" />;
      case 'contenido_ofensivo':
        return <MdWarning {...iconProps} className="text-red-600" />;
      default:
        return <BiErrorCircle {...iconProps} className="text-gray-600" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-white rounded-lg shadow-lg"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <MdWarning size={32} className="text-red-600" />
        Gestión de Reportes
      </h1>

      {/* Pestañas */}
      <div className="mb-6 flex gap-2 border-b flex-wrap">
        <button
          onClick={() => setTab('usuarios')}
          className={`px-4 py-2 transition ${tab === 'usuarios' ? 'border-b-2 border-red-600 text-red-600 font-bold' : 'text-gray-600'}`}
        >
          <BiErrorCircle className="inline mr-2" /> Reportes de Usuarios ({reportesUsuarios.length})
        </button>
        <button
          onClick={() => setTab('redes')}
          className={`px-4 py-2 transition ${tab === 'redes' ? 'border-b-2 border-red-600 text-red-600 font-bold' : 'text-gray-600'}`}
        >
          <MdWarning className="inline mr-2" /> Reportes de Redes ({reportesRedes.length})
        </button>
        <button
          onClick={() => setTab('app')}
          className={`px-4 py-2 transition ${tab === 'app' ? 'border-b-2 border-red-600 text-red-600 font-bold' : 'text-gray-600'}`}
        >
          <BiErrorCircle className="inline mr-2" /> Reportes de App ({reportesApp.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Cargando reportes...</p>
        </div>
      ) : (
        <>
          {/* Tab de Reportes de Usuarios */}
          {tab === 'usuarios' && (
            <div className="space-y-4">
              {reportesUsuarios.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No hay reportes de usuarios</p>
              ) : (
                reportesUsuarios.map(reporte => (
                  <motion.div
                    key={reporte._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border border-gray-300 rounded-lg p-4 bg-gray-50 hover:shadow-lg transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTipoIcon(reporte.tipo)}
                          <h3 className="font-bold text-gray-800">{reporte.tipo}</h3>
                          <span className="text-xs text-gray-500">
                            {new Date(reporte.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Usuario reportado:</strong> {reporte.reportadoUsuarioId?.nombre} {reporte.reportadoUsuarioId?.apellido}
                        </p>
                        <p className="text-sm text-gray-700">
                          {reporte.descripcion}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => setModalDetalles({ visible: true, reporte, tipo: 'usuario' })}
                          className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 rounded transition text-sm"
                        >
                          Ver Detalles
                        </button>
                        <button
                          onClick={() => handleEliminarUsuario(reporte._id)}
                          className="bg-red-500 hover:bg-red-700 text-white p-2 rounded transition"
                          title="Eliminar"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Tab de Reportes de Redes */}
          {tab === 'redes' && (
            <div className="space-y-4">
              {reportesRedes.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No hay reportes de redes</p>
              ) : (
                reportesRedes.map(reporte => (
                  <motion.div
                    key={reporte._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border border-gray-300 rounded-lg p-4 bg-gray-50 hover:shadow-lg transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTipoIcon(reporte.tipo)}
                          <h3 className="font-bold text-gray-800">{reporte.tipo}</h3>
                          <span className="text-xs text-gray-500">
                            {new Date(reporte.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Red reportada:</strong> {reporte.redId?.nombre}
                        </p>
                        <p className="text-sm text-gray-700">
                          {reporte.descripcion}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => setModalDetalles({ visible: true, reporte, tipo: 'red' })}
                          className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 rounded transition text-sm"
                        >
                          Ver Detalles
                        </button>
                        <button
                          onClick={() => handleEliminarRed(reporte._id)}
                          className="bg-red-500 hover:bg-red-700 text-white p-2 rounded transition"
                          title="Eliminar"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Tab de Reportes de App */}
          {tab === 'app' && (
            <div className="space-y-4">
              {reportesApp.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No hay reportes de la app</p>
              ) : (
                reportesApp.map(reporte => (
                  <motion.div
                    key={reporte._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border border-gray-300 rounded-lg p-4 bg-gray-50 hover:shadow-lg transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTipoIcon(reporte.tipo)}
                          <h3 className="font-bold text-gray-800">{reporte.tipo}</h3>
                          <span className="text-xs text-gray-500">
                            {new Date(reporte.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {reporte.descripcion}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => setModalDetalles({ visible: true, reporte, tipo: 'app' })}
                          className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 rounded transition text-sm"
                        >
                          Ver Detalles
                        </button>
                        <button
                          onClick={() => handleEliminarApp(reporte._id)}
                          className="bg-red-500 hover:bg-red-700 text-white p-2 rounded transition"
                          title="Eliminar"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* Modal de Detalles y Resolución */}
      {modalDetalles.visible && (
        <ModalResolverReporte
          reporte={modalDetalles.reporte}
          tipo={modalDetalles.tipo}
          onResolverUsuario={handleResolverUsuario}
          onResolverRed={handleResolverRed}
          onResolverApp={handleResolverApp}
          onClose={() => setModalDetalles({ visible: false, reporte: null, tipo: null })}
        />
      )}
    </motion.div>
  );
};

// Modal para resolver reportes
const ModalResolverReporte = ({ reporte, tipo, onResolverUsuario, onResolverRed, onResolverApp, onClose }) => {
  const [estado, setEstado] = useState('');

  const handleResolve = () => {
    if (!estado) {
      alert("Selecciona un estado");
      return;
    }
    
    if (tipo === 'usuario') onResolverUsuario(reporte._id, estado);
    else if (tipo === 'red') onResolverRed(reporte._id, estado);
    else if (tipo === 'app') onResolverApp(reporte._id, estado);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <MdAssignmentTurnedIn size={28} className="text-blue-600" />
          Resolver Reporte
        </h2>
        
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <p className="text-sm text-gray-700 mb-2"><strong>Tipo:</strong> {reporte.tipo}</p>
          <p className="text-sm text-gray-700"><strong>Descripción:</strong> {reporte.descripcion}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Acción:</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Selecciona una opción</option>
            <option value="Resuelta">Resuelta</option>
            <option value="Rechazada">Rechazada</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleResolve}
            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Resolver
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500 transition"
          >
            Cancelar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportesPanelAdmin;
