import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";
import { MdWarning, MdAssignmentTurnedIn } from "react-icons/md";
import axios from "axios";
import { AuthContext } from "../../layout/AuthContext";
import { motion } from 'framer-motion';

const ReportesPanelAdmin = () => {
  const [reportesUsuarios, setReportesUsuarios] = useState([]);
  const [reportesRedes, setReportesRedes] = useState([]);
  const [reportesApp, setReportesApp] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('usuarios');
  const [modalDetalles, setModalDetalles] = useState({ visible: false, reporte: null, tipo: null });
  const { token: contextToken } = useContext(AuthContext);
  const token = contextToken || sessionStorage.getItem("token");

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  const fetchReportesUsuarios = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/reportes/usuarios`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportesUsuarios(res.data.reportes || []);
      toast.success("Reportes cargados");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar");
    } finally {
      setLoading(false);
    }
  };

  const fetchReportesRedes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/reportes/redes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportesRedes(res.data.reportes || []);
      toast.success("Reportes cargados");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar");
    } finally {
      setLoading(false);
    }
  };

  const fetchReportesApp = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/reportes/app`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportesApp(res.data.reportes || []);
      toast.success("Reportes cargados");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar");
    } finally {
      setLoading(false);
    }
  };

  const handleResolverUsuario = async (id, estado) => {
    try {
      await axios.patch(`${API_BASE}/reportes/usuarios/${id}/resolver`, { estado }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportesUsuarios(reportesUsuarios.filter(r => r._id !== id));
      toast.success(`Reporte ${estado}`);
      setModalDetalles({ visible: false, reporte: null, tipo: null });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al resolver");
    }
  };

  const handleResolverRed = async (id, estado) => {
    try {
      await axios.patch(`${API_BASE}/reportes/redes/${id}/resolver`, { estado }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportesRedes(reportesRedes.filter(r => r._id !== id));
      toast.success(`Reporte ${estado}`);
      setModalDetalles({ visible: false, reporte: null, tipo: null });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al resolver");
    }
  };

  const handleResolverApp = async (id, estado) => {
    try {
      await axios.patch(`${API_BASE}/reportes/app/${id}/resolver`, { estado }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportesApp(reportesApp.filter(r => r._id !== id));
      toast.success(`Reporte ${estado}`);
      setModalDetalles({ visible: false, reporte: null, tipo: null });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al resolver");
    }
  };

  const handleEliminarUsuario = async (id) => {
    if (!window.confirm("¿Eliminar reporte?")) return;
    try {
      await axios.delete(`${API_BASE}/reportes/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportesUsuarios(reportesUsuarios.filter(r => r._id !== id));
      toast.success("Eliminado");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar");
    }
  };

  const handleEliminarRed = async (id) => {
    if (!window.confirm("¿Eliminar reporte?")) return;
    try {
      await axios.delete(`${API_BASE}/reportes/redes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportesRedes(reportesRedes.filter(r => r._id !== id));
      toast.success("Eliminado");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar");
    }
  };

  const handleEliminarApp = async (id) => {
    if (!window.confirm("¿Eliminar reporte?")) return;
    try {
      await axios.delete(`${API_BASE}/reportes/app/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportesApp(reportesApp.filter(r => r._id !== id));
      toast.success("Eliminado");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar");
    }
  };

  useEffect(() => {
    if (tab === 'usuarios') fetchReportesUsuarios();
    else if (tab === 'redes') fetchReportesRedes();
    else if (tab === 'app') fetchReportesApp();
  }, [tab]);

  const tabs = [
    { key: 'usuarios', label: 'Usuarios', count: reportesUsuarios.length },
    { key: 'redes', label: 'Redes', count: reportesRedes.length },
    { key: 'app', label: 'App', count: reportesApp.length },
  ];

  const renderReporteCard = (reporte, tipo, onDelete, onView) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-lg p-4"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <MdWarning className="text-yellow-400" />
            <span className="text-sm font-medium text-slate-300">{reporte.tipo}</span>
            <span className="text-xs text-slate-500">
              {new Date(reporte.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-white mb-1 font-medium">
            {tipo === 'usuario' && `Usuario: ${reporte.reportadoUsuarioId?.nombre}`}
            {tipo === 'red' && `Red: ${reporte.redId?.nombre}`}
            {tipo === 'app' && 'Problema en la app'}
          </p>
          <p className="text-slate-400 text-sm">{reporte.descripcion}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onView()}
            className="px-3 py-2 bg-blue-600/80 hover:bg-blue-700 text-white rounded-lg text-sm transition"
          >
            Resolver
          </button>
          <button
            onClick={() => onDelete()}
            className="p-2 text-red-400 hover:bg-red-900/30 rounded transition"
            title="Eliminar"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Encabezado */}
      <div>
        <h1 style={{ fontFamily: 'Lora, serif' }} className="text-3xl font-bold text-white mb-2">
          Sistema de Reportes
        </h1>
        <p className="text-slate-400">Gestiona reportes del sistema PoliRED</p>
      </div>

      {/* Pestañas */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
        <div className="flex gap-2 flex-wrap">
          {tabs.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-lg transition text-sm font-medium ${
                tab === key
                  ? 'bg-gradient-to-r from-red-600 to-yellow-600 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:text-white'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-400">Cargando...</p>
        </div>
      ) : (
        <>
          {tab === 'usuarios' && (
            <div className="space-y-3">
              {reportesUsuarios.length === 0 ? (
                <div className="text-center py-12 bg-slate-800/30 backdrop-blur border border-slate-700 rounded-lg">
                  <p className="text-slate-400">No hay reportes</p>
                </div>
              ) : (
                reportesUsuarios.map(reporte => (
                  renderReporteCard(
                    reporte,
                    'usuario',
                    () => handleEliminarUsuario(reporte._id),
                    () => setModalDetalles({ visible: true, reporte, tipo: 'usuario' })
                  )
                ))
              )}
            </div>
          )}

          {tab === 'redes' && (
            <div className="space-y-3">
              {reportesRedes.length === 0 ? (
                <div className="text-center py-12 bg-slate-800/30 backdrop-blur border border-slate-700 rounded-lg">
                  <p className="text-slate-400">No hay reportes</p>
                </div>
              ) : (
                reportesRedes.map(reporte => (
                  renderReporteCard(
                    reporte,
                    'red',
                    () => handleEliminarRed(reporte._id),
                    () => setModalDetalles({ visible: true, reporte, tipo: 'red' })
                  )
                ))
              )}
            </div>
          )}

          {tab === 'app' && (
            <div className="space-y-3">
              {reportesApp.length === 0 ? (
                <div className="text-center py-12 bg-slate-800/30 backdrop-blur border border-slate-700 rounded-lg">
                  <p className="text-slate-400">No hay reportes</p>
                </div>
              ) : (
                reportesApp.map(reporte => (
                  renderReporteCard(
                    reporte,
                    'app',
                    () => handleEliminarApp(reporte._id),
                    () => setModalDetalles({ visible: true, reporte, tipo: 'app' })
                  )
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* Modal */}
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

const ModalResolverReporte = ({ reporte, tipo, onResolverUsuario, onResolverRed, onResolverApp, onClose }) => {
  const [estado, setEstado] = useState('');

  const handleResolve = () => {
    if (!estado) {
      alert("Selecciona una acción");
      return;
    }
    if (tipo === 'usuario') onResolverUsuario(reporte._id, estado);
    else if (tipo === 'red') onResolverRed(reporte._id, estado);
    else if (tipo === 'app') onResolverApp(reporte._id, estado);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-md w-full"
      >
        <div className="flex items-center gap-2 mb-4">
          <MdAssignmentTurnedIn className="text-blue-400" size={28} />
          <h2 className="text-2xl font-bold text-white">Resolver Reporte</h2>
        </div>
        
        <div className="mb-6 p-4 bg-slate-900 rounded-lg">
          <p className="text-sm text-slate-300 mb-2"><strong>Tipo:</strong> {reporte.tipo}</p>
          <p className="text-sm text-slate-300"><strong>Descripción:</strong> {reporte.descripcion}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">Acción:</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition"
          >
            <option value="">Selecciona una opción</option>
            <option value="Resuelta">Marcar como Resuelta</option>
            <option value="Rechazada">Rechazar</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleResolve}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 rounded-lg hover:shadow-lg transition"
          >
            Resolver
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition"
          >
            Cancelar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportesPanelAdmin;
