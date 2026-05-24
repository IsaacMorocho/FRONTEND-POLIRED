import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { MdGroups, MdVerifiedUser, MdPendingActions } from "react-icons/md";
import { BiNetworkChart } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import axios from "axios";
import { AuthContext } from "../../layout/AuthContext";
import { motion } from 'framer-motion';

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
