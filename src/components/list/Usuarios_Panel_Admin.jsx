import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { MdPersonAdd, MdPersonRemove, MdCheckCircle } from "react-icons/md";
import { BiBlock } from "react-icons/bi";
import axios from "axios";
import { AuthContext } from "../../layout/AuthContext";
import { motion } from 'framer-motion';

const UsuariosPanelAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalActualizar, setModalActualizar] = useState({ visible: false, usuario: null });
  const [filtro, setFiltro] = useState('todos');
  const { token: contextToken } = useContext(AuthContext);
  const token = contextToken || sessionStorage.getItem("token");

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  // Obtener todos los estudiantes (GET /estudiantes)
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/estudiantes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(res.data);
      toast.success("Estudiantes cargados correctamente");
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
      toast.error(error.response?.data?.msg || "Error al cargar estudiantes");
    } finally {
      setLoading(false);
    }
  };

  // Obtener estudiante por ID (GET /estudiantes/:id)
  const fetchUsuarioPorId = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/estudiantes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      console.error("Error al cargar estudiante:", error);
      toast.error("Error al cargar datos del estudiante");
      return null;
    }
  };

  // Actualizar estudiante (PATCH /actualizar-estudiantes/:id)
  const handleActualizar = async (id, datos) => {
    try {
      const res = await axios.patch(`${API_BASE}/actualizar-estudiantes/${id}`, datos, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(usuarios.map(u => u._id === id ? res.data.estudiante : u));
      setModalActualizar({ visible: false, usuario: null });
      toast.success("Estudiante actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar:", error);
      toast.error(error.response?.data?.msg || "Error al actualizar");
    }
  };

  // Eliminar estudiante (DELETE /eliminar-estudiantes/:id)
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este estudiante?")) return;
    
    try {
      await axios.delete(`${API_BASE}/eliminar-estudiantes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(usuarios.filter(u => u._id !== id));
      toast.success("Estudiante eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error(error.response?.data?.msg || "Error al eliminar");
    }
  };

  // Suspender estudiante (PATCH /estudiantes/:id/suspender)
  const handleSuspender = async (id) => {
    try {
      const res = await axios.patch(`${API_BASE}/estudiantes/${id}/suspender`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(usuarios.map(u => u._id === id ? { ...u, suspendido: true } : u));
      toast.success("Estudiante suspendido correctamente");
    } catch (error) {
      console.error("Error al suspender:", error);
      toast.error(error.response?.data?.msg || "Error al suspender");
    }
  };

  // Habilitar estudiante (PATCH /estudiantes/:id/habilitar)
  const handleHabilitar = async (id) => {
    try {
      const res = await axios.patch(`${API_BASE}/estudiantes/${id}/habilitar`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(usuarios.map(u => u._id === id ? { ...u, suspendido: false } : u));
      toast.success("Estudiante habilitado correctamente");
    } catch (error) {
      console.error("Error al habilitar:", error);
      toast.error(error.response?.data?.msg || "Error al habilitar");
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter(usuario => {
    if (filtro === 'suspendidos') return usuario.suspendido;
    if (filtro === 'activos') return !usuario.suspendido;
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-white rounded-lg shadow-lg"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <MdPersonAdd size={32} className="text-blue-600" />
        Gestión de Usuarios
      </h1>

      {/* Filtros */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setFiltro('todos')}
          className={`px-4 py-2 rounded-lg transition ${filtro === 'todos' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Todos
        </button>
        <button
          onClick={() => setFiltro('activos')}
          className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${filtro === 'activos' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          <MdCheckCircle /> Activos
        </button>
        <button
          onClick={() => setFiltro('suspendidos')}
          className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${filtro === 'suspendidos' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          <BiBlock /> Suspendidos
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-200 text-gray-800">
              <tr>
                <th className="p-3 border">Nombre</th>
                <th className="p-3 border">Apellido</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Teléfono</th>
                <th className="p-3 border">Estado</th>
                <th className="p-3 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map(usuario => (
                <motion.tr
                  key={usuario._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-100 transition border-b"
                >
                  <td className="p-3 border">{usuario.nombre}</td>
                  <td className="p-3 border">{usuario.apellido}</td>
                  <td className="p-3 border text-sm">{usuario.email}</td>
                  <td className="p-3 border">{usuario.celular || 'N/A'}</td>
                  <td className="p-3 border">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${usuario.suspendido ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                      {usuario.suspendido ? 'Suspendido' : 'Activo'}
                    </span>
                  </td>
                  <td className="p-3 border">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setModalActualizar({ visible: true, usuario })}
                        className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded transition flex items-center gap-1"
                        title="Editar"
                      >
                        <FiEdit size={18} />
                      </button>
                      {!usuario.suspendido ? (
                        <button
                          onClick={() => handleSuspender(usuario._id)}
                          className="bg-yellow-500 hover:bg-yellow-700 text-white p-2 rounded transition flex items-center gap-1"
                          title="Suspender"
                        >
                          <BiBlock size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleHabilitar(usuario._id)}
                          className="bg-green-500 hover:bg-green-700 text-white p-2 rounded transition flex items-center gap-1"
                          title="Habilitar"
                        >
                          <MdCheckCircle size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleEliminar(usuario._id)}
                        className="bg-red-500 hover:bg-red-700 text-white p-2 rounded transition flex items-center gap-1"
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

      {/* Modal de actualización */}
      {modalActualizar.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full"
          >
            <h2 className="text-2xl font-bold mb-4">Actualizar Usuario</h2>
            <ActualizarUsuarioForm
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

// Componente de formulario para actualizar usuario
const ActualizarUsuarioForm = ({ usuario, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || '',
    apellido: usuario?.apellido || '',
    email: usuario?.email || '',
    celular: usuario?.celular || '',
    roles: usuario?.roles || ['Estudiante']
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(usuario._id, formData);
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
        <label className="block text-sm font-semibold mb-1">Apellido</label>
        <input
          type="text"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Teléfono</label>
        <input
          type="tel"
          name="celular"
          value={formData.celular}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
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

export default UsuariosPanelAdmin;
