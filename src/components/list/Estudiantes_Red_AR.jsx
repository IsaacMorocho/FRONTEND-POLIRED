import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { MdPeople } from "react-icons/md";
import { AlertTriangle } from "lucide-react";
import { FiX, FiMail } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';
import adminRedService from "../../services/adminRedService";
import { AuthContext } from "../../layout/AuthContext";

const EstudiantesRedAR = () => {
  const { user } = useContext(AuthContext);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalExpulsar, setModalExpulsar] = useState({ visible: false, estudianteId: null, nombre: '' });
  const [modalVer, setModalVer] = useState({ visible: false, estudiante: null });
  
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 6;

  // Cargar estudiantes de la red
  const fetchEstudiantes = async () => {
    setLoading(true);
    try {
      const data = await adminRedService.getEstudiantes();
      setEstudiantes(Array.isArray(data) ? data : data.estudiantes || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  const totalPaginas = Math.ceil(estudiantes.length / itemsPorPagina);
  const estudiantesPaginados = estudiantes.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

  // Eliminar estudiante
  const handleEliminar = async () => {
    if (!modalExpulsar.estudianteId) return;
    try {
      await adminRedService.eliminarEstudiante(modalExpulsar.estudianteId);
      setEstudiantes(estudiantes.filter(e => e._id !== modalExpulsar.estudianteId));
      toast.success("Miembro expulsado correctamente");
      setModalExpulsar({ visible: false, estudianteId: null, nombre: '' });
      // Ajustar página si es necesario
      if (estudiantesPaginados.length === 1 && paginaActual > 1) {
        setPaginaActual(paginaActual - 1);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al expulsar al miembro");
    }
  };

  const getAvatarUrl = (estudiante) => {
    const foto = estudiante?.fotoPerfil;
    if (!foto || foto === 'null' || foto === 'undefined') {
      return `https://ui-avatars.com/api/?name=${estudiante?.nombre || 'U'}+${estudiante?.apellido || ''}&background=random`;
    }
    if (foto.startsWith('http') || foto.startsWith('data:')) return foto;
    const base = import.meta.env.VITE_BACKEND_URL || '';
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
    return `${cleanBase}${foto.startsWith('/') ? '' : '/'}${foto}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <MdPeople size={32} /> Estudiantes de mi Red
        </h1>
        <p className="text-slate-400">Gestiona los estudiantes pertenecientes a tu red comunitaria</p>
      </div>

      {/* Tabla de estudiantes */}
      {loading ? (
        <div className="text-slate-400 text-center py-12">Cargando estudiantes...</div>
      ) : (
        <div className="w-full bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
          {estudiantes.length === 0 ? (
            <div className="text-slate-400 text-center py-12">No hay estudiantes en tu red</div>
          ) : (
            <div className="w-full flex flex-col p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {estudiantesPaginados.map((estudiante) => (
                  <div
                    key={estudiante._id}
                    onClick={() => setModalVer({ visible: true, estudiante })}
                    className="flex items-center justify-between bg-slate-900/50 hover:bg-slate-700/30 transition-colors rounded-xl p-4 border border-slate-700 group cursor-pointer"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img 
                        src={getAvatarUrl(estudiante)} 
                        alt={estudiante.nombre} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-700 group-hover:border-slate-500 transition-colors shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-white text-base md:text-lg truncate group-hover:text-blue-400 transition-colors">
                          @{estudiante.username || 'usuario'}
                        </p>
                      </div>
                    </div>

                    {estudiante._id !== (user?._id || user?.id) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalExpulsar({ 
                            visible: true, 
                            estudianteId: estudiante._id,
                            nombre: `${estudiante.nombre} ${estudiante.apellido}`
                          });
                        }}
                        className="shrink-0 text-xs md:text-sm font-bold bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors shadow-lg shadow-red-900/20"
                        title="Expulsar Miembro"
                      >
                        Expulsar
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Paginación */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-2 p-4 gap-4 border-t border-slate-700/50">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span>Mostrando:</span>
                  <span className="px-3 py-1 bg-slate-900/50 rounded-full text-slate-300 font-medium border border-slate-700/50">
                    {(paginaActual - 1) * itemsPorPagina + 1} - {Math.min(paginaActual * itemsPorPagina, estudiantes.length)} de {estudiantes.length}
                  </span>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                  <button
                    onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                    disabled={paginaActual === 1}
                    className="flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-white disabled:opacity-50 disabled:hover:text-slate-400 transition"
                  >
                    Anterior
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPaginas || 1 }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => setPaginaActual(pageNum)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                          paginaActual === pageNum 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setPaginaActual(p => Math.min(totalPaginas || 1, p + 1))}
                    disabled={paginaActual === (totalPaginas || 1)}
                    className="flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-white disabled:opacity-50 disabled:hover:text-slate-400 transition"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Confirmación de Expulsión */}
      <AnimatePresence>
        {modalExpulsar.visible && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
                  <AlertTriangle size={32} className="text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  ¿Expulsar Miembro?
                </h2>
                <p className="text-slate-300 mb-6">
                  Estás a punto de expulsar a <span className="font-bold text-white">{modalExpulsar.nombre}</span> de tu red comunitaria. Esta acción <span className="text-red-400 font-bold">no se puede deshacer</span>. 
                  El usuario dejará de tener acceso a las funciones exclusivas de la red y sus publicaciones podrían ser afectadas.
                </p>
                <div className="flex gap-4 w-full">
                  <button
                    onClick={() => setModalExpulsar({ visible: false, estudianteId: null, nombre: '' })}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold transition border border-slate-700"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleEliminar}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-red-900/20"
                  >
                    Expulsar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Ver Estudiante */}
      <AnimatePresence>
        {modalVer.visible && modalVer.estudiante && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative flex flex-col"
            >
              <div className="h-24 bg-gradient-to-r from-blue-600/50 to-purple-600/50 relative">
                <button 
                  onClick={() => setModalVer({ visible: false, estudiante: null })}
                  className="absolute top-4 right-4 p-2 bg-slate-900/50 hover:bg-slate-900 text-white rounded-full transition z-10"
                >
                  <FiX size={20} />
                </button>
              </div>
              
              <div className="px-6 pb-6 relative flex flex-col items-center -mt-12">
                <div className="relative mb-4">
                  <img 
                    src={getAvatarUrl(modalVer.estudiante)}
                    alt={modalVer.estudiante.nombre}
                    className="w-24 h-24 rounded-full border-4 border-slate-800 object-cover shadow-lg bg-slate-700"
                  />
                </div>
                
                <h2 className="text-2xl font-bold text-white text-center">
                  {modalVer.estudiante.nombre} {modalVer.estudiante.apellido}
                </h2>
                <p className="text-blue-400 text-sm font-medium mb-1">
                  @{modalVer.estudiante.username || 'usuario'}
                </p>
                
                <div className="w-full bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 mt-2 space-y-4">
                  <div>
                    <span className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1 mb-1"><FiMail /> Email</span>
                    <p className="text-slate-300 text-sm break-all">{modalVer.estudiante.email}</p>
                  </div>
                  
                  {modalVer.estudiante.createdAt && (
                    <div>
                      <span className="text-xs text-slate-500 uppercase font-semibold block mb-1">Registrado el</span>
                      <p className="text-slate-300 text-sm">{new Date(modalVer.estudiante.createdAt).toLocaleDateString()}</p>
                    </div>
                  )}

                  {modalVer.estudiante.biografia && (
                    <div>
                      <span className="text-xs text-slate-500 uppercase font-semibold block mb-1">Biografía</span>
                      <p className="text-slate-300 text-sm break-words break-all">
                        {modalVer.estudiante.biografia}
                      </p>
                    </div>
                  )}
                </div>

                <div className="w-full mt-6">
                  <button
                    onClick={() => setModalVer({ visible: false, estudiante: null })}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-xl font-bold transition-colors shadow-lg"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EstudiantesRedAR;
