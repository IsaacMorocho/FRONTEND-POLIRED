import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { MdPersonAdd, MdCheckCircle } from "react-icons/md";
import { BiBlock } from "react-icons/bi";
import axios from "axios";
import { AuthContext } from "../../layout/AuthContext";
import { motion } from 'framer-motion';

const UsuariosPanelAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalActualizar, setModalActualizar] = useState({ visible: false, usuario: null });
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const { token: contextToken } = useContext(AuthContext);
  const token = contextToken || sessionStorage.getItem("token");

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/estudiantes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(res.data);
      toast.success("Datos cargados");
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
      toast.error(error.response?.data?.msg || "Error al cargar");
    } finally {
      setLoading(false);
    }
  };

  const handleActualizar = async (id, datos) => {
    try {
      const res = await axios.patch(`${API_BASE}/actualizar-estudiantes/${id}`, datos, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(usuarios.map(u => u._id === id ? res.data.estudiante : u));
      setModalActualizar({ visible: false, usuario: null });
      toast.success("Actualizado");
    } catch (error) {
      console.error("Error al actualizar:", error);
      toast.error("Error al actualizar");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar usuario?")) return;
    try {
      await axios.delete(`${API_BASE}/eliminar-estudiantes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(usuarios.filter(u => u._id !== id));
      toast.success("Eliminado");
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("Error al eliminar");
    }
  };

  const handleSuspender = async (id) => {
    try {
      await axios.patch(`${API_BASE}/estudiantes/${id}/suspender`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(usuarios.map(u => u._id === id ? { ...u, suspendido: true } : u));
      toast.success("Suspendido");
    } catch (error) {
      console.error("Error al suspender:", error);
      toast.error("Error al suspender");
    }
  };

  const handleHabilitar = async (id) => {
    try {
      await axios.patch(`${API_BASE}/estudiantes/${id}/habilitar`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(usuarios.map(u => u._id === id ? { ...u, suspendido: false } : u));
      toast.success("Habilitado");
    } catch (error) {
      console.error("Error al habilitar:", error);
      toast.error("Error al habilitar");
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const usuariosFiltrados = usuarios
    .filter(usuario => {
      if (filtro === 'suspendidos') return usuario.suspendido;
      if (filtro === 'activos') return !usuario.suspendido;
      return true;
    })
    .filter(usuario => 
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busqueda.toLowerCase())
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
          Gestión de Usuarios
        </h1>
        <p className="text-slate-400">Administra estudiantes del sistema</p>
      </div>

      {/* Controles */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 space-y-4">
        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'todos', label: 'Todos', count: usuarios.length },
            { key: 'activos', label: 'Activos', count: usuarios.filter(u => !u.suspendido).length },
            { key: 'suspendidos', label: 'Suspendidos', count: usuarios.filter(u => u.suspendido).length },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFiltro(key)}
              className={`px-4 py-2 rounded-lg transition text-sm font-medium ${
                filtro === key
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:text-white'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Búsqueda */}
        <div className="flex items-center gap-2 bg-slate-900 rounded-lg px-3 py-2">
          <FiSearch className="text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none"
          />
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-400">Cargando...</p>
        </div>
      ) : usuariosFiltrados.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400">No hay usuarios para mostrar</p>
        </div>
      ) : (
        <div className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/50 border-b border-slate-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300">Teléfono</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300">Estado</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((usuario, idx) => (
                  <motion.tr
                    key={usuario._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-slate-700 hover:bg-slate-700/20 transition"
                  >
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{usuario.nombre} {usuario.apellido}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm">{usuario.email}</td>
                    <td className="px-4 py-3 text-slate-400 text-sm">{usuario.celular || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        usuario.suspendido 
                          ? 'bg-red-900/30 text-red-300' 
                          : 'bg-green-900/30 text-green-300'
                      }`}>
                        {usuario.suspendido ? 'Suspendido' : 'Activo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setModalActualizar({ visible: true, usuario })}
                          className="p-2 text-blue-400 hover:bg-blue-900/30 rounded transition"
                          title="Editar"
                        >
                          <FiEdit size={18} />
                        </button>
                        {!usuario.suspendido ? (
                          <button
                            onClick={() => handleSuspender(usuario._id)}
                            className="p-2 text-yellow-400 hover:bg-yellow-900/30 rounded transition"
                            title="Suspender"
                          >
                            <BiBlock size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleHabilitar(usuario._id)}
                            className="p-2 text-green-400 hover:bg-green-900/30 rounded transition"
                            title="Habilitar"
                          >
                            <MdCheckCircle size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleEliminar(usuario._id)}
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
        </div>
      )}

      {/* Modal */}
      {modalActualizar.visible && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-md w-full"
          >
            <h2 className="text-xl font-bold text-white mb-4">Actualizar Usuario</h2>
            <ActualizarForm
              usuario={modalActualizar.usuario}
              onSubmit={handleActualizar}
              onCancel={() => setModalActualizar({ visible: false, usuario: null })}
            />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

const ActualizarForm = ({ usuario, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || '',
    apellido: usuario?.apellido || '',
    email: usuario?.email || '',
    celular: usuario?.celular || '',
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(usuario._id, formData); }} className="space-y-4">
      {[
        { name: 'nombre', label: 'Nombre' },
        { name: 'apellido', label: 'Apellido' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'celular', label: 'Teléfono' },
      ].map(({ name, label, type = 'text' }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
          <input
            type={type}
            value={formData[name]}
            onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      ))}
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

export default UsuariosPanelAdmin;
