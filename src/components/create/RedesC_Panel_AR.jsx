import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../layout/AuthContext";
import { toast } from "react-toastify";
import { FiEdit2, FiSave, FiX, FiUsers, FiFileText, FiInfo, FiAlertTriangle } from "react-icons/fi";
import { MdVerifiedUser } from "react-icons/md";
import { motion } from 'framer-motion';
import adminRedService from "../../services/adminRedService";
import { compressImage } from "../../utils/imageCompression";

const RedesC_Panel_AR = () => {
  const { user } = useContext(AuthContext);
  const [red, setRed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" });
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  const getImageUrl = (path) => {
    if (!path || path === 'null' || path === 'undefined') return null;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const cleanPath = path.replace(/\\/g, '/');
    const base = API_BASE?.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
    return `${base}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData({
      nombre: red.nombre || "",
      descripcion: red.descripcion || "",
    });
    setPreview(null);
    setImagen(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setPreview(null);
    setImagen(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      data.append('nombre', formData.nombre);
      data.append('descripcion', formData.descripcion);
      if (imagen) {
        const compressedImagen = await compressImage(imagen);
        data.append('imagen', compressedImagen);
      }
      
      const response = await adminRedService.updateRed(data, true);
      setRed(response.red);
      setIsEditing(false);
      toast.success("Red comunitaria actualizada correctamente");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error al actualizar la red");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const fetchRed = async () => {
      try {
        const data = await adminRedService.getInfoRed();
        setRed(data.red);
      } catch (error) {
        console.error("Error al obtener la red:", error);
        toast.error("Error al cargar la información de la red", { autoClose: 3000 });
      } finally {
        setLoading(false);
      }
    };
    fetchRed();
  }, []);



  if (loading) {
    return <p className="text-center text-gray-500">Cargando información...</p>;
  }

  if (!red) {
    return <p className="text-center text-gray-500">No se encontró la red</p>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Mi Red
        </h1>
        <p className="text-slate-400">Información y configuración de la red comunitaria</p>
      </div>

      <div className="w-full">
        <div className="transition-all">
          
          {!isEditing ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tarjeta de Bienvenida y Red */}
              <div className="lg:col-span-2 bg-gradient-to-r from-emerald-900/40 to-slate-800/80 rounded-2xl p-8 border border-slate-700 flex flex-col justify-between relative overflow-hidden shadow-xl">
                <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                  <div className="relative shrink-0">
                    <img
                      src={getImageUrl(red.fotoPerfil) || `https://ui-avatars.com/api/?name=${red.nombre}&background=10b981&color=fff&size=128`}
                      alt="red"
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-emerald-500/50 object-cover shadow-lg"
                    />
                    {(red.esVerificada || red.esOficial) && (
                      <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-slate-900 rounded-full p-1 shadow-lg border border-slate-700">
                        <MdVerifiedUser size={24} className={red.esOficial ? "text-yellow-400" : "text-blue-500"} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">¡Hola, {user?.nombre || 'Usuario'}!</h2>
                    <p className="text-slate-300 text-lg mb-4">
                      Eres administrador de la red comunitaria <span className="font-semibold text-emerald-400">{red.nombre}</span>.
                    </p>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                      {red.descripcion || 'Gestiona los detalles de tu red y mantén a tu comunidad informada y segura.'}
                    </p>
                    <button 
                      onClick={handleEditClick} 
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-medium transition flex items-center gap-2 shadow-lg shadow-emerald-900/20 w-fit"
                    >
                      <FiEdit2 /> Editar Red
                    </button>
                  </div>
                </div>
                {/* Decoración de fondo opcional */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
              </div>

              {/* Tarjeta de Estadísticas */}
              <div className="bg-slate-800/80 backdrop-blur rounded-2xl p-6 border border-slate-700 flex flex-col justify-center shadow-xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  Estadísticas de tu red
                </h3>
                <div className="space-y-4">
                  <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium mb-1">Miembros</p>
                      <p className="text-3xl font-bold text-white">{red.miembros?.length ?? red.cantidadMiembros ?? '0'}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xl">
                      <FiUsers />
                    </div>
                  </div>
                  <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium mb-1">Publicaciones</p>
                      <p className="text-3xl font-bold text-white">{red.cantidadPublicaciones ?? '0'}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xl">
                      <FiFileText />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guía de Administrador */}
            <div className="mt-6 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 lg:p-8 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FiInfo className="text-blue-400" />
                Guía del Administrador de Red
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 hover:border-slate-600 transition">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                    <FiEdit2 size={20} />
                  </div>
                  <h4 className="font-bold text-white mb-2 text-sm">Gestionar Perfil</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Puedes editar el nombre, la descripción y la foto de perfil de tu red para mantenerla actualizada y atractiva.</p>
                </div>
                {/* Card 2 */}
                <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 hover:border-slate-600 transition">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 mb-4">
                    <FiAlertTriangle size={20} />
                  </div>
                  <h4 className="font-bold text-white mb-2 text-sm">Moderar Reportes</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Eres el encargado de revisar los reportes en tu red. Si aceptas un reporte, el contenido se elimina y el autor recibe un strike.</p>
                </div>

                {/* Card 4 */}
                <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 hover:border-slate-600 transition">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                    <MdVerifiedUser size={20} />
                  </div>
                  <h4 className="font-bold text-white mb-2 text-sm">Solicitar Mejoras</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Puedes enviar solicitudes a los SuperAdmins para obtener insignias de Verificación u Oficialización para tu red. (Aplica solo desde la aplicación movil)</p>
                </div>
              </div>
            </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-white">Editar Red</h2>
                <button 
                  type="button" 
                  onClick={handleCancelEdit} 
                  className="text-slate-400 hover:text-white transition"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <label className="cursor-pointer group relative">
                  <div className="relative shrink-0">
                    <img
                      src={preview || getImageUrl(red.fotoPerfil) || `https://ui-avatars.com/api/?name=${red.nombre}&background=10b981&color=fff&size=128`}
                      alt="red"
                      className="w-32 h-32 rounded-full border-2 border-dashed border-emerald-500 object-cover shadow-lg group-hover:opacity-50 transition"
                    />
                    {(red.esVerificada || red.esOficial) && !preview && (
                      <div className="absolute bottom-2 right-2 bg-slate-900 rounded-full p-1 shadow-lg border border-slate-700">
                        <MdVerifiedUser size={24} className={red.esOficial ? "text-yellow-400" : "text-blue-500"} />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition pointer-events-none">
                      <span className="bg-slate-900/80 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">Cambiar Foto</span>
                    </div>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-slate-400 text-sm block mb-1">Nombre de la red</label>
                  <input 
                    type="text" 
                    name="nombre" 
                    value={formData.nombre} 
                    onChange={handleChange} 
                    required
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-sm block mb-1">Descripción</label>
                  <textarea 
                    name="descripcion" 
                    value={formData.descripcion} 
                    onChange={handleChange} 
                    required
                    rows="4"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700 mt-6">
                <button 
                  type="button" 
                  onClick={handleCancelEdit} 
                  className="px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition flex items-center gap-2 shadow-lg shadow-emerald-900/20"
                  disabled={saving}
                >
                  {saving ? 'Guardando...' : <><FiSave size={16} /> Guardar Cambios</>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </motion.div>
    
  );
};

export default RedesC_Panel_AR;