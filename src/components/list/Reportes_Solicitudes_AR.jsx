import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiTrash2, FiEye } from "react-icons/fi";
import { MdWarning, MdAssignmentTurnedIn, MdPendingActions } from "react-icons/md";
import { AiOutlineFileAdd } from "react-icons/ai";
import axios from "axios";
import { AuthContext } from "../../layout/AuthContext";
import { motion } from 'framer-motion';

const ReportesSolicitudesAR = () => {
  const [reportes, setReportes] = useState([]);
  const [solicitudesVerificacion, setSolicitudesVerificacion] = useState([]);
  const [solicitudesRehabilitacion, setSolicitudesRehabilitacion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('reportes');
  const [modalDetalles, setModalDetalles] = useState({ visible: false, item: null, tipo: null });
  const [modalCrearSolicitud, setModalCrearSolicitud] = useState({ visible: false, tipo: null });
  const [descriptionSolicitud, setDescriptionSolicitud] = useState("");
  const { token: contextToken } = useContext(AuthContext);
  const token = contextToken || sessionStorage.getItem("token");

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  // Cargar reportes de publicaciones
  const fetchReportes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/reportes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportes(Array.isArray(res.data) ? res.data : res.data.reportes || []);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar reportes");
    } finally {
      setLoading(false);
    }
  };

  // Cargar solicitudes de verificación
  const fetchSolicitudesVerificacion = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/solicitudes/verificacion`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSolicitudesVerificacion(Array.isArray(res.data) ? res.data : res.data.solicitudes || []);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar solicitudes");
    } finally {
      setLoading(false);
    }
  };

  // Cargar solicitudes de rehabilitación
  const fetchSolicitudesRehabilitacion = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/solicitudes/rehabilitar`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSolicitudesRehabilitacion(Array.isArray(res.data) ? res.data : res.data.solicitudes || []);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar solicitudes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'reportes') fetchReportes();
    else if (tab === 'verificacion') fetchSolicitudesVerificacion();
    else if (tab === 'rehabilitacion') fetchSolicitudesRehabilitacion();
  }, [tab]);

  // Resolver reporte
  const handleResolverReporte = async (reporteId, estado) => {
    try {
      await axios.patch(`${API_BASE}/reportes/${reporteId}/resolver`, 
        { estado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReportes(reportes.filter(r => r._id !== reporteId));
      setModalDetalles({ visible: false, item: null, tipo: null });
      toast.success(`Reporte ${estado}`);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al resolver reporte");
    }
  };

  // Eliminar reporte
  const handleEliminarReporte = async (reporteId) => {
    try {
      await axios.delete(`${API_BASE}/reportes/${reporteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportes(reportes.filter(r => r._id !== reporteId));
      toast.success("Reporte eliminado");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar reporte");
    }
  };

  // Crear solicitud de verificación
  const handleCrearSolicitudVerificacion = async () => {
    if (!descriptionSolicitud.trim()) {
      toast.error("Debes agregar una descripción");
      return;
    }
    try {
      const redId = sessionStorage.getItem("redId") || ""; // Necesita redId
      await axios.post(`${API_BASE}/redes/solicitar-verificacion`,
        { redId, descripcion: descriptionSolicitud },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDescriptionSolicitud("");
      setModalCrearSolicitud({ visible: false, tipo: null });
      fetchSolicitudesVerificacion();
      toast.success("Solicitud de verificación creada");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al crear solicitud");
    }
  };

  // Crear solicitud de rehabilitación
  const handleCrearSolicitudRehabilitacion = async () => {
    if (!descriptionSolicitud.trim()) {
      toast.error("Debes agregar una descripción");
      return;
    }
    try {
      const redId = sessionStorage.getItem("redId") || "";
      await axios.post(`${API_BASE}/solicitudes/rehabilitar`,
        { redId, descripcion: descriptionSolicitud },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDescriptionSolicitud("");
      setModalCrearSolicitud({ visible: false, tipo: null });
      fetchSolicitudesRehabilitacion();
      toast.success("Solicitud de rehabilitación creada");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al crear solicitud");
    }
  };

  // Eliminar solicitud
  const handleEliminarSolicitud = async (solicitudId, tipo) => {
    try {
      const endpoint = tipo === 'verificacion' 
        ? `/solicitudes/verificacion/${solicitudId}`
        : `/solicitudes/rehabilitar/${solicitudId}`;
      
      await axios.delete(`${API_BASE}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (tipo === 'verificacion') {
        setSolicitudesVerificacion(solicitudesVerificacion.filter(s => s._id !== solicitudId));
      } else {
        setSolicitudesRehabilitacion(solicitudesRehabilitacion.filter(s => s._id !== solicitudId));
      }
      toast.success("Solicitud eliminada");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar solicitud");
    }
  };

  const tabs = [
    { key: 'reportes', label: 'Reportes', icon: MdWarning },
    { key: 'verificacion', label: 'Verificación', icon: MdPendingActions },
    { key: 'rehabilitacion', label: 'Rehabilitación', icon: MdPendingActions },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 bg-slate-900 rounded-lg p-6"
    >
      {/* Encabezado */}
      <div>
        <h1 style={{ fontFamily: 'Lora, serif' }} className="text-3xl font-bold text-white mb-2">
          Reportes y Solicitudes
        </h1>
        <p className="text-slate-400">Gestiona reportes de publicaciones y solicitudes</p>
      </div>

      {/* Pestañas */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
        <div className="flex gap-2 flex-wrap">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-lg transition text-sm font-medium ${
                tab === key
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido por pestaña */}
      <div className="space-y-4">
        {tab === 'reportes' && (
          <>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <MdWarning /> Reportes de Publicaciones
            </h2>
            {loading ? (
              <div className="text-slate-400 text-center py-8">Cargando reportes...</div>
            ) : reportes.length === 0 ? (
              <div className="text-slate-400 text-center py-8">No hay reportes pendientes</div>
            ) : (
              <div className="space-y-3">
                {reportes.map((reporte) => (
                  <motion.div
                    key={reporte._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <p className="text-white font-semibold">{reporte.tipo}</p>
                      <p className="text-slate-400 text-sm">{reporte.descripcion}</p>
                      <p className="text-slate-500 text-xs mt-1">Estado: {reporte.estado}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setModalDetalles({ visible: true, item: reporte, tipo: 'reporte' })}
                        className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded transition"
                      >
                        <FiEye size={18} />
                      </button>
                      <button
                        onClick={() => handleEliminarReporte(reporte._id)}
                        className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded transition"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'verificacion' && (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <MdPendingActions /> Solicitudes de Verificación
              </h2>
              <button
                onClick={() => setModalCrearSolicitud({ visible: true, tipo: 'verificacion' })}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition flex items-center gap-2 text-sm"
              >
                <AiOutlineFileAdd size={18} />
                Crear Solicitud
              </button>
            </div>
            {loading ? (
              <div className="text-slate-400 text-center py-8">Cargando solicitudes...</div>
            ) : solicitudesVerificacion.length === 0 ? (
              <div className="text-slate-400 text-center py-8">No hay solicitudes de verificación</div>
            ) : (
              <div className="space-y-3">
                {solicitudesVerificacion.map((solicitud) => (
                  <motion.div
                    key={solicitud._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <p className="text-white font-semibold">Solicitud de Verificación</p>
                      <p className="text-slate-400 text-sm">{solicitud.descripcion}</p>
                      <p className={`text-xs mt-1 font-medium ${
                        solicitud.estado === 'Aprobada' ? 'text-green-400' :
                        solicitud.estado === 'Rechazada' ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        Estado: {solicitud.estado}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setModalDetalles({ visible: true, item: solicitud, tipo: 'verificacion' })}
                        className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded transition"
                      >
                        <FiEye size={18} />
                      </button>
                      <button
                        onClick={() => handleEliminarSolicitud(solicitud._id, 'verificacion')}
                        className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded transition"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'rehabilitacion' && (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <MdAssignmentTurnedIn /> Solicitudes de Rehabilitación
              </h2>
              <button
                onClick={() => setModalCrearSolicitud({ visible: true, tipo: 'rehabilitacion' })}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition flex items-center gap-2 text-sm"
              >
                <AiOutlineFileAdd size={18} />
                Crear Solicitud
              </button>
            </div>
            {loading ? (
              <div className="text-slate-400 text-center py-8">Cargando solicitudes...</div>
            ) : solicitudesRehabilitacion.length === 0 ? (
              <div className="text-slate-400 text-center py-8">No hay solicitudes de rehabilitación</div>
            ) : (
              <div className="space-y-3">
                {solicitudesRehabilitacion.map((solicitud) => (
                  <motion.div
                    key={solicitud._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <p className="text-white font-semibold">Solicitud de Rehabilitación</p>
                      <p className="text-slate-400 text-sm">{solicitud.descripcion}</p>
                      <p className={`text-xs mt-1 font-medium ${
                        solicitud.estado === 'Aprobada' ? 'text-green-400' :
                        solicitud.estado === 'Rechazada' ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        Estado: {solicitud.estado}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setModalDetalles({ visible: true, item: solicitud, tipo: 'rehabilitacion' })}
                        className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded transition"
                      >
                        <FiEye size={18} />
                      </button>
                      <button
                        onClick={() => handleEliminarSolicitud(solicitud._id, 'rehabilitacion')}
                        className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded transition"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Ver Detalles */}
      {modalDetalles.visible && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-md w-full"
          >
            <h2 className="text-xl font-bold text-white mb-4">Detalles</h2>
            <div className="space-y-3 mb-6">
              <div>
                <label className="text-sm font-medium text-slate-400">Tipo</label>
                <p className="text-white">{modalDetalles.item?.tipo || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400">Descripción</label>
                <p className="text-white">{modalDetalles.item?.descripcion || 'Sin descripción'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400">Estado</label>
                <p className={`font-medium ${
                  modalDetalles.item?.estado === 'Aprobada' ? 'text-green-400' :
                  modalDetalles.item?.estado === 'Rechazada' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {modalDetalles.item?.estado || 'Pendiente'}
                </p>
              </div>
            </div>

            {modalDetalles.tipo === 'reporte' && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleResolverReporte(modalDetalles.item._id, 'Resuelta')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
                >
                  Marcar Resuelto
                </button>
                <button
                  onClick={() => handleResolverReporte(modalDetalles.item._id, 'Rechazada')}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
                >
                  Rechazar
                </button>
              </div>
            )}

            <button
              onClick={() => setModalDetalles({ visible: false, item: null, tipo: null })}
              className="w-full mt-4 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition"
            >
              Cerrar
            </button>
          </motion.div>
        </div>
      )}

      {/* Modal Crear Solicitud */}
      {modalCrearSolicitud.visible && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-md w-full"
          >
            <h2 className="text-xl font-bold text-white mb-4">
              {modalCrearSolicitud.tipo === 'verificacion' 
                ? 'Solicitar Verificación de Red'
                : 'Solicitar Rehabilitación de Red'}
            </h2>
            <textarea
              value={descriptionSolicitud}
              onChange={(e) => setDescriptionSolicitud(e.target.value)}
              placeholder="Describe tu solicitud..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition mb-4"
              rows="4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => modalCrearSolicitud.tipo === 'verificacion'
                  ? handleCrearSolicitudVerificacion()
                  : handleCrearSolicitudRehabilitacion()
                }
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:shadow-lg transition"
              >
                Enviar
              </button>
              <button
                onClick={() => {
                  setModalCrearSolicitud({ visible: false, tipo: null });
                  setDescriptionSolicitud("");
                }}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ReportesSolicitudesAR;
