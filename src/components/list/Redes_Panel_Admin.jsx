import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { MdVerifiedUser, MdPendingActions } from "react-icons/md";
import axios from "axios";
import { AuthContext } from "../../layout/AuthContext";
import { motion } from 'framer-motion';

const RedesPanelAdmin = () => {
  const [redes, setRedes] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('redes');
  const [modalVer, setModalVer] = useState({ visible: false, red: null });
  const [modalActualizar, setModalActualizar] = useState({ visible: false, red: null });
  const { token: contextToken } = useContext(AuthContext);
  const token = contextToken || sessionStorage.getItem("token");

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  const fetchRedes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/redes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRedes(res.data);
      toast.success("Redes cargadas");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar");
    } finally {
      setLoading(false);
    }
  };

  const fetchSolicitudes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/redes/solicitudes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSolicitudes(Array.isArray(res.data) ? res.data : res.data.solicitudes || []);
      toast.success("Solicitudes cargadas");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar");
    } finally {
      setLoading(false);
    }
  };

  const fetchSolicitudesRehabilitacion = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/redes/rehabilitar/solicitudes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSolicitudes(Array.isArray(res.data) ? res.data : res.data.solicitudes || []);
      toast.success("Solicitudes de rehabilitación cargadas");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar");
    } finally {
      setLoading(false);
    }
  };

  const handleActualizar = async (id, datos) => {
    try {
      const res = await axios.patch(`${API_BASE}/actualizar-red/${id}`, datos, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRedes(redes.map(r => r._id === id ? res.data : r));
      setModalActualizar({ visible: false, red: null });
      toast.success("Actualizado");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al actualizar");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar red?")) return;
    try {
      await axios.delete(`${API_BASE}/eliminar-red/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRedes(redes.filter(r => r._id !== id));
      toast.success("Eliminada");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar");
    }
  };

  const handleVerificar = async (id, verificada) => {
    try {
      const res = await axios.patch(`${API_BASE}/red/${id}/verificada`, { verificada: !verificada }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRedes(redes.map(r => r._id === id ? { ...r, verificada: !verificada } : r));
      toast.success(verificada ? "Desverificada" : "Verificada");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al verificar");
    }
  };

  const handleResolverSolicitud = async (id, estado) => {
    try {
      await axios.patch(`${API_BASE}/redes/solicitudes/${id}/resolver`, { estado }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSolicitudes(solicitudes.filter(s => s._id !== id));
      toast.success(`Solicitud ${estado}`);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al resolver");
    }
  };

  const handleResolverRehabilitacion = async (id, estado) => {
    try {
      await axios.patch(`${API_BASE}/redes/rehabilitar/solicitudes/${id}/resolver`, { estado }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSolicitudes(solicitudes.filter(s => s._id !== id));
      toast.success(`Solicitud ${estado}`);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al resolver");
    }
  };

  useEffect(() => {
    if (tab === 'redes') fetchRedes();
    else if (tab === 'solicitudes') fetchSolicitudes();
    else if (tab === 'rehabilitacion') fetchSolicitudesRehabilitacion();
  }, [tab]);

  const tabs = [
    { key: 'redes', label: 'Redes', icon: MdVerifiedUser },
    { key: 'solicitudes', label: 'Verificación', icon: MdPendingActions },
    { key: 'rehabilitacion', label: 'Rehabilitación', icon: MdPendingActions },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Encabezado */}
      <div>
        <h1 style={{ fontFamily: 'Lora, serif' }} className="text-3xl font-bold text-white mb-2">
          Redes Comunitarias
        </h1>
        <p className="text-slate-400">Administra redes comunitarias del sistema</p>
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

      {/* Contenido */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-400">Cargando...</p>
        </div>
      ) : (
        <>
          {/* Tab Redes */}
          {tab === 'redes' && (
            <div className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-lg overflow-hidden">
              {redes.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400">No hay redes registradas</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-800/50 border-b border-slate-700">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300">Nombre</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300">Miembros</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300">Estado</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300">Verificada</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-300">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {redes.map((red, idx) => (
                        <motion.tr
                          key={red._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-slate-700 hover:bg-slate-700/20 transition"
                        >
                          <td className="px-4 py-3">
                            <p className="text-white font-medium">{red.nombre}</p>
                          </td>
                          <td className="px-4 py-3 text-slate-400">{red.cantidadMiembros || 0}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              red.deshabilitada 
                                ? 'bg-red-900/30 text-red-300' 
                                : 'bg-green-900/30 text-green-300'
                            }`}>
                              {red.deshabilitada ? 'Deshabilitada' : 'Habilitada'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              red.verificada 
                                ? 'bg-blue-900/30 text-blue-300' 
                                : 'bg-yellow-900/30 text-yellow-300'
                            }`}>
                              {red.verificada ? 'Verificada' : 'Pendiente'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => setModalVer({ visible: true, red })}
                                className="p-2 text-blue-400 hover:bg-blue-900/30 rounded transition"
                                title="Ver"
                              >
                                <FiEye size={18} />
                              </button>
                              <button
                                onClick={() => setModalActualizar({ visible: true, red })}
                                className="p-2 text-yellow-400 hover:bg-yellow-900/30 rounded transition"
                                title="Editar"
                              >
                                <FiEdit size={18} />
                              </button>
                              <button
                                onClick={() => handleVerificar(red._id, red.verificada)}
                                className="p-2 text-purple-400 hover:bg-purple-900/30 rounded transition"
                                title={red.verificada ? "Desverificar" : "Verificar"}
                              >
                                <MdVerifiedUser size={18} />
                              </button>
                              <button
                                onClick={() => handleEliminar(red._id)}
                                className="p-2 text-red-400 hover:bg-red-900/30 rounded transition"
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
            </div>
          )}

          {/* Tab Solicitudes de Verificación */}
          {tab === 'solicitudes' && (
            <div className="space-y-3">
              {solicitudes.length === 0 ? (
                <div className="text-center py-12 bg-slate-800/30 backdrop-blur border border-slate-700 rounded-lg">
                  <p className="text-slate-400">No hay solicitudes pendientes</p>
                </div>
              ) : (
                solicitudes.map((solicitud, idx) => (
                  <motion.div
                    key={solicitud._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-lg p-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="text-white font-semibold">{solicitud.redId?.nombre}</h3>
                        <p className="text-sm text-slate-400 mt-1">{solicitud.descripcion}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleResolverSolicitud(solicitud._id, 'Aprobada')}
                          className="px-4 py-2 bg-green-600/80 hover:bg-green-700 text-white rounded-lg text-sm transition"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleResolverSolicitud(solicitud._id, 'Rechazada')}
                          className="px-4 py-2 bg-red-600/80 hover:bg-red-700 text-white rounded-lg text-sm transition"
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Tab Solicitudes de Rehabilitación */}
          {tab === 'rehabilitacion' && (
            <div className="space-y-3">
              {solicitudes.length === 0 ? (
                <div className="text-center py-12 bg-slate-800/30 backdrop-blur border border-slate-700 rounded-lg">
                  <p className="text-slate-400">No hay solicitudes pendientes</p>
                </div>
              ) : (
                solicitudes.map((solicitud, idx) => (
                  <motion.div
                    key={solicitud._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-lg p-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="text-white font-semibold">{solicitud.redId?.nombre}</h3>
                        <p className="text-sm text-slate-400 mt-1">Razón: {solicitud.razon}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleResolverRehabilitacion(solicitud._id, 'Aprobada')}
                          className="px-4 py-2 bg-green-600/80 hover:bg-green-700 text-white rounded-lg text-sm transition"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleResolverRehabilitacion(solicitud._id, 'Rechazada')}
                          className="px-4 py-2 bg-red-600/80 hover:bg-red-700 text-white rounded-lg text-sm transition"
                        >
                          Rechazar
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

      {/* Modal Ver Red */}
      {modalVer.visible && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-white mb-2">{modalVer.red?.nombre}</h2>
            <p className="text-slate-400 mb-4">{modalVer.red?.descripcion}</p>
            <div>
              <h3 className="font-semibold text-white mb-3">Miembros ({modalVer.red?.miembros?.length || 0})</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {modalVer.red?.miembros?.map(m => (
                  <div key={m._id} className="text-sm text-slate-300 border-l-2 border-blue-500 pl-3">
                    {m.nombre} {m.apellido}
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => setModalVer({ visible: false, red: null })}
              className="w-full mt-4 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition"
            >
              Cerrar
            </button>
          </motion.div>
        </div>
      )}

      {/* Modal Actualizar Red */}
      {modalActualizar.visible && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Actualizar Red</h2>
            <ActualizarRedForm
              red={modalActualizar.red}
              onSubmit={handleActualizar}
              onCancel={() => setModalActualizar({ visible: false, red: null })}
            />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

const ActualizarRedForm = ({ red, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: red?.nombre || '',
    descripcion: red?.descripcion || '',
    deshabilitada: red?.deshabilitada || false
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(red._id, formData); }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Nombre</label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Descripción</label>
        <textarea
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition"
          rows="3"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.deshabilitada}
          onChange={(e) => setFormData({ ...formData, deshabilitada: e.target.checked })}
          className="w-4 h-4 rounded"
        />
        <label className="text-sm text-slate-300">Deshabilitar red</label>
      </div>
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:shadow-lg transition"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-600 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default RedesPanelAdmin;

const RedesPanelAdmin = () => {
  const [redes, setRedes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVer, setModalVer] = useState({ visible: false, red: null });
  const [modalActualizar, setModalActualizar] = useState({ visible: false, red: null });
  const [solicitudes, setSolicitudes] = useState([]);
  const [tab, setTab] = useState('redes'); // 'redes' o 'solicitudes'
  const { token: contextToken } = useContext(AuthContext);
  const token = contextToken || sessionStorage.getItem("token");

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  // Obtener todas las redes (GET /redes)
  const fetchRedes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/redes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRedes(res.data);
      toast.success("Redes cargadas correctamente");
    } catch (error) {
      console.error("Error al cargar redes:", error);
      toast.error(error.response?.data?.msg || "Error al cargar redes");
    } finally {
      setLoading(false);
    }
  };

  // Obtener red por ID (GET /red/:id)
  const fetchRedPorId = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/red/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      console.error("Error al cargar red:", error);
      toast.error("Error al cargar datos de la red");
      return null;
    }
  };

  // Actualizar red (PATCH /actualizar-red/:id)
  const handleActualizar = async (id, datos) => {
    try {
      const res = await axios.patch(`${API_BASE}/actualizar-red/${id}`, datos, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRedes(redes.map(r => r._id === id ? res.data : r));
      setModalActualizar({ visible: false, red: null });
      toast.success("Red actualizada correctamente");
    } catch (error) {
      console.error("Error al actualizar:", error);
      toast.error(error.response?.data?.msg || "Error al actualizar");
    }
  };

  // Eliminar red (DELETE /eliminar-red/:id)
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Está seguro de que desea eliminar esta red?")) return;
    
    try {
      await axios.delete(`${API_BASE}/eliminar-red/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRedes(redes.filter(r => r._id !== id));
      toast.success("Red eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error(error.response?.data?.msg || "Error al eliminar");
    }
  };

  // Marcar red como verificada (PATCH /red/:id/verificada)
  const handleVerificar = async (id, verificada) => {
    try {
      const res = await axios.patch(`${API_BASE}/red/${id}/verificada`, { verificada: !verificada }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRedes(redes.map(r => r._id === id ? { ...r, verificada: !verificada } : r));
      toast.success(verificada ? "Red desverificada correctamente" : "Red verificada correctamente");
    } catch (error) {
      console.error("Error al verificar:", error);
      toast.error(error.response?.data?.msg || "Error al verificar");
    }
  };

  // Obtener solicitudes de verificación (GET /redes/solicitudes)
  const fetchSolicitudes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/redes/solicitudes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSolicitudes(Array.isArray(res.data) ? res.data : res.data.solicitudes || []);
      toast.success("Solicitudes cargadas correctamente");
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
      toast.error(error.response?.data?.msg || "Error al cargar solicitudes");
    } finally {
      setLoading(false);
    }
  };

  // Resolver solicitud de verificación (PATCH /redes/solicitudes/:id/resolver)
  const handleResolverSolicitud = async (id, estado) => {
    try {
      const res = await axios.patch(`${API_BASE}/redes/solicitudes/${id}/resolver`, { estado }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSolicitudes(solicitudes.filter(s => s._id !== id));
      toast.success(`Solicitud ${estado.toLowerCase()}`);
    } catch (error) {
      console.error("Error al resolver solicitud:", error);
      toast.error(error.response?.data?.msg || "Error al resolver solicitud");
    }
  };

  // Obtener solicitudes de rehabilitación (GET /redes/rehabilitar/solicitudes)
  const fetchSolicitudesRehabilitacion = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/redes/rehabilitar/solicitudes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSolicitudes(Array.isArray(res.data) ? res.data : res.data.solicitudes || []);
      toast.success("Solicitudes de rehabilitación cargadas");
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
      toast.error(error.response?.data?.msg || "Error al cargar solicitudes");
    } finally {
      setLoading(false);
    }
  };

  // Resolver solicitud de rehabilitación (PATCH /redes/rehabilitar/solicitudes/:id/resolver)
  const handleResolverRehabilitacion = async (id, estado) => {
    try {
      const res = await axios.patch(`${API_BASE}/redes/rehabilitar/solicitudes/${id}/resolver`, { estado }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSolicitudes(solicitudes.filter(s => s._id !== id));
      toast.success(`Solicitud de rehabilitación ${estado.toLowerCase()}`);
    } catch (error) {
      console.error("Error al resolver:", error);
      toast.error(error.response?.data?.msg || "Error al resolver");
    }
  };

  useEffect(() => {
    if (tab === 'redes') {
      fetchRedes();
    } else if (tab === 'solicitudes') {
      fetchSolicitudes();
    } else if (tab === 'rehabilitacion') {
      fetchSolicitudesRehabilitacion();
    }
  }, [tab]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-white rounded-lg shadow-lg"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <BiNetworkChart size={32} className="text-purple-600" />
        Gestión de Redes Comunitarias
      </h1>

      {/* Pestañas */}
      <div className="mb-6 flex gap-2 border-b">
        <button
          onClick={() => setTab('redes')}
          className={`px-4 py-2 transition ${tab === 'redes' ? 'border-b-2 border-purple-600 text-purple-600 font-bold' : 'text-gray-600'}`}
        >
          <MdGroups className="inline mr-2" /> Redes
        </button>
        <button
          onClick={() => setTab('solicitudes')}
          className={`px-4 py-2 transition ${tab === 'solicitudes' ? 'border-b-2 border-purple-600 text-purple-600 font-bold' : 'text-gray-600'}`}
        >
          <MdPendingActions className="inline mr-2" /> Solicitudes de Verificación
        </button>
        <button
          onClick={() => setTab('rehabilitacion')}
          className={`px-4 py-2 transition ${tab === 'rehabilitacion' ? 'border-b-2 border-purple-600 text-purple-600 font-bold' : 'text-gray-600'}`}
        >
          <MdVerifiedUser className="inline mr-2" /> Solicitudes de Rehabilitación
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      ) : (
        <>
          {/* Tab de Redes */}
          {tab === 'redes' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-200 text-gray-800">
                  <tr>
                    <th className="p-3 border">Nombre</th>
                    <th className="p-3 border">Miembros</th>
                    <th className="p-3 border">Estado</th>
                    <th className="p-3 border">Verificada</th>
                    <th className="p-3 border">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {redes.map(red => (
                    <motion.tr
                      key={red._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-100 transition border-b"
                    >
                      <td className="p-3 border font-semibold">{red.nombre}</td>
                      <td className="p-3 border">{red.cantidadMiembros || 0}</td>
                      <td className="p-3 border">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${red.deshabilitada ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                          {red.deshabilitada ? 'Deshabilitada' : 'Habilitada'}
                        </span>
                      </td>
                      <td className="p-3 border">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${red.verificada ? 'bg-blue-200 text-blue-800' : 'bg-yellow-200 text-yellow-800'}`}>
                          {red.verificada ? 'Verificada' : 'No verificada'}
                        </span>
                      </td>
                      <td className="p-3 border">
                        <div className="flex gap-2">
                          <button
                            onClick={async () => {
                              const redData = await fetchRedPorId(red._id);
                              if (redData) setModalVer({ visible: true, red: redData });
                            }}
                            className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded transition"
                            title="Ver"
                          >
                            <AiOutlineEye size={18} />
                          </button>
                          <button
                            onClick={() => setModalActualizar({ visible: true, red })}
                            className="bg-green-500 hover:bg-green-700 text-white p-2 rounded transition"
                            title="Editar"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleVerificar(red._id, red.verificada)}
                            className={`p-2 rounded transition text-white ${red.verificada ? 'bg-yellow-500 hover:bg-yellow-700' : 'bg-blue-500 hover:bg-blue-700'}`}
                            title={red.verificada ? "Desverificar" : "Verificar"}
                          >
                            <MdVerifiedUser size={18} />
                          </button>
                          <button
                            onClick={() => handleEliminar(red._id)}
                            className="bg-red-500 hover:bg-red-700 text-white p-2 rounded transition"
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

          {/* Tab de Solicitudes de Verificación */}
          {tab === 'solicitudes' && (
            <div className="space-y-4">
              {solicitudes.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No hay solicitudes pendientes</p>
              ) : (
                solicitudes.map(solicitud => (
                  <motion.div
                    key={solicitud._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border border-gray-300 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <h3 className="font-bold text-gray-800">{solicitud.redId?.nombre}</h3>
                        <p className="text-sm text-gray-600">Estado: {solicitud.estado}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{solicitud.descripcion}</p>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleResolverSolicitud(solicitud._id, 'Aprobada')}
                          className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleResolverSolicitud(solicitud._id, 'Rechazada')}
                          className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Tab de Solicitudes de Rehabilitación */}
          {tab === 'rehabilitacion' && (
            <div className="space-y-4">
              {solicitudes.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No hay solicitudes pendientes</p>
              ) : (
                solicitudes.map(solicitud => (
                  <motion.div
                    key={solicitud._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border border-gray-300 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <h3 className="font-bold text-gray-800">{solicitud.redId?.nombre}</h3>
                        <p className="text-sm text-gray-600">Estado: {solicitud.estado}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Razón: {solicitud.razon}</p>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleResolverRehabilitacion(solicitud._id, 'Aprobada')}
                          className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleResolverRehabilitacion(solicitud._id, 'Rechazada')}
                          className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                        >
                          Rechazar
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

      {/* Modal de Ver Red */}
      {modalVer.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white p-6 rounded-lg shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-4">{modalVer.red?.nombre}</h2>
            <p className="text-gray-600 mb-4">{modalVer.red?.descripcion}</p>
            <div className="mb-4">
              <h3 className="font-bold mb-2">Miembros ({modalVer.red?.miembros?.length}):</h3>
              <ul className="space-y-2">
                {modalVer.red?.miembros?.map(miembro => (
                  <li key={miembro._id} className="text-sm text-gray-700 border-l-4 border-purple-600 pl-2">
                    {miembro.nombre} {miembro.apellido} ({miembro.email})
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setModalVer({ visible: false, red: null })}
              className="w-full bg-gray-400 text-white py-2 rounded hover:bg-gray-500 transition"
            >
              Cerrar
            </button>
          </motion.div>
        </div>
      )}

      {/* Modal de Actualizar Red */}
      {modalActualizar.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full"
          >
            <h2 className="text-2xl font-bold mb-4">Actualizar Red</h2>
            <ActualizarRedForm
              red={modalActualizar.red}
              onSubmit={handleActualizar}
              onCancel={() => setModalActualizar({ visible: false, red: null })}
            />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

// Componente de formulario para actualizar red
const ActualizarRedForm = ({ red, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: red?.nombre || '',
    descripcion: red?.descripcion || '',
    deshabilitada: red?.deshabilitada || false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(red._id, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-1">Nombre</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          rows="4"
        />
      </div>
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="deshabilitada"
            checked={formData.deshabilitada}
            onChange={handleChange}
          />
          <span className="text-sm font-semibold">Deshabilitar Red</span>
        </label>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Guardar
        </button>
        <button type="button" onClick={onCancel} className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500 transition">
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default RedesPanelAdmin;
