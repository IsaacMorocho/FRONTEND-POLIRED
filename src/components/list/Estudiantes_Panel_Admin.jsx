import { useEffect, useState } from 'react'
import { FiMail, FiX, FiUserX } from 'react-icons/fi'
import { AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import superadminService from '../../services/superadminService'
import StrikesModal from '../strikes/StrikesModal'

const EstudiantesPanelAdmin = () => {
  const [estudiantes, setEstudiantes] = useState([])
  const [loading, setLoading] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos') // 'todos' | 'activos' | 'suspendidos'
  const [modalVer, setModalVer] = useState({ visible: false, estudiante: null })
  const [strikesModal, setStrikesModal] = useState(null)
  const [paginaActual, setPaginaActual] = useState(1)
  
  const itemsPorPagina = 10 // Aumentado a 10 porque ahora es una tabla

  const estudiantesFiltrados = estudiantes.filter(e => {
    if (filtroEstado === 'activos' && e.suspendido) return false;
    if (filtroEstado === 'suspendidos' && !e.suspendido) return false;
    
    if (busqueda) {
      const b = busqueda.toLowerCase();
      const nombreCompleto = `${e.nombre || ''} ${e.apellido || ''}`.toLowerCase();
      const username = (e.username || '').toLowerCase();
      const email = (e.email || '').toLowerCase();
      if (!nombreCompleto.includes(b) && !username.includes(b) && !email.includes(b)) {
        return false;
      }
    }
    return true;
  });

  const totalPaginas = Math.ceil(estudiantesFiltrados.length / itemsPorPagina);
  const estudiantesPaginados = estudiantesFiltrados.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

  const fetchEstudiantes = async () => {
    setLoading(true)
    try {
      const data = await superadminService.getEstudiantes()
      setEstudiantes(Array.isArray(data) ? data : data.estudiantes || [])
    } catch (error) {
      console.error('Error cargando estudiantes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEstudiantes()
  }, [])

  const getAvatarUrl = (estudiante) => {
    const foto = estudiante?.fotoPerfil
    if (!foto || foto === 'null' || foto === 'undefined') {
      return `https://ui-avatars.com/api/?name=${estudiante?.nombre || 'U'}+${estudiante?.apellido || ''}&background=random`
    }
    if (foto.startsWith('http') || foto.startsWith('data:')) return foto
    const base = import.meta.env.VITE_BACKEND_URL || ''
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base
    return `${cleanBase}${foto.startsWith('/') ? '' : '/'}${foto}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Gestión de Usuarios
          </h1>
          <p className="text-slate-400">Administra los estudiantes y cuentas del sistema</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Buscar por nombre, email, username..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:w-64 p-3 outline-none transition shadow-lg"
          />
          <select
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value);
              setPaginaActual(1);
            }}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:w-auto p-3 outline-none transition shadow-lg cursor-pointer hover:border-slate-500"
          >
            <option value="todos">Todos los Usuarios</option>
            <option value="activos">Solo Activos</option>
            <option value="suspendidos">Solo Suspendidos</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-400">Cargando...</p>
        </div>
      ) : (
        <>
          <div className="w-full bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
            {estudiantesFiltrados.length === 0 ? (
              <div className="flex-1 flex items-center justify-center py-20">
                <div className="text-slate-500 text-lg flex flex-col items-center gap-3">
                  <FiUserX size={48} className="text-slate-600" />
                  <p>
                    {estudiantes.length === 0 
                      ? 'No hay usuarios registrados' 
                      : 'No se encontraron resultados para los filtros aplicados'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-900/50 text-xs uppercase text-slate-400 border-b border-slate-700">
                      <tr>
                        <th className="px-6 py-4 font-medium">Estudiante</th>
                        <th className="px-6 py-4 font-medium hidden md:table-cell">Contacto</th>
                        <th className="px-6 py-4 font-medium">Estado</th>
                        <th className="px-6 py-4 font-medium">Strikes</th>
                        <th className="px-6 py-4 font-medium text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {estudiantesPaginados.map((estudiante) => (
                        <tr 
                          key={estudiante._id} 
                          onClick={() => setModalVer({ visible: true, estudiante })}
                          className="hover:bg-slate-700/30 transition-colors cursor-pointer group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <img 
                                src={getAvatarUrl(estudiante)} 
                                alt={estudiante.nombre} 
                                className="w-10 h-10 rounded-full object-cover border-2 border-slate-700 group-hover:border-slate-500 transition-colors"
                              />
                              <div className="min-w-0">
                                <p className="font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                                  @{estudiante.username || 'usuario'}
                                </p>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 hidden md:table-cell">
                            <div className="flex items-center gap-2 text-slate-400">
                              <FiMail size={14} className="shrink-0" />
                              <span className="truncate max-w-[200px]">{estudiante.email}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex flex-col items-start gap-1">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${!estudiante.suspendido ? 'bg-green-900/50 text-green-400 border border-green-800/50' : 'bg-red-900/50 text-red-400 border border-red-800/50'}`}>
                                {!estudiante.suspendido ? 'Activo' : 'Suspendido'}
                              </span>
                              {estudiante.roles?.includes('admin_red') && (
                                <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-900/50 text-blue-400 border border-blue-800/50">
                                  Admin Red
                               </span>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-yellow-400">
                              <AlertTriangle size={16} />
                              <span className="font-bold">{estudiante.strikes?.length ?? 0}/5</span>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                setStrikesModal({ tipo: 'usuario', id: estudiante._id, nombre: estudiante.username || estudiante.nombre }); 
                              }}
                              className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors border border-slate-600 shadow-sm"
                              title="Gestionar Strikes"
                            >
                              Ver Strikes
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginación (debajo de la tabla) */}
                {estudiantesFiltrados.length > 0 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-slate-700/50 bg-slate-900/20 gap-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span>Mostrando:</span>
                      <span className="px-3 py-1 bg-slate-800 rounded-full text-slate-300 font-medium border border-slate-700">
                        {(paginaActual - 1) * itemsPorPagina + 1} - {Math.min(paginaActual * itemsPorPagina, estudiantesFiltrados.length)} de {estudiantesFiltrados.length}
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
                                ? 'bg-blue-600 text-white' 
                                : 'text-slate-400 hover:text-white hover:bg-slate-700'
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
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal Ver Estudiante */}
      {modalVer.visible && modalVer.estudiante && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative flex flex-col"
          >
            <div className="h-24 bg-gradient-to-r from-blue-600/50 to-emerald-600/50 relative">
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
              
              <div className="flex gap-2 mt-2 mb-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${!modalVer.estudiante.suspendido ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                  {!modalVer.estudiante.suspendido ? 'Activo' : 'Suspendido'}
                </span>
                {modalVer.estudiante.roles?.includes('admin_red') && (
                  <span className="px-2 py-1 rounded text-xs font-bold bg-blue-900/50 text-blue-400">Admin Red</span>
                )}
              </div>

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

                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold block mb-1">Biografía</span>
                  <p className="text-slate-300 text-sm break-words break-all">
                    {modalVer.estudiante.biografia || <span className="italic text-slate-500">Sin biografía</span>}
                  </p>
                </div>
              </div>

              <div className="w-full mt-4 flex gap-3">
                <button
                  onClick={() => {
                    setStrikesModal({ tipo: 'usuario', id: modalVer.estudiante._id, nombre: modalVer.estudiante.username || modalVer.estudiante.nombre });
                  }}
                  className="flex-1 flex justify-center items-center gap-2 py-2 rounded-xl text-sm font-bold bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                >
                  <AlertTriangle size={16} className="text-yellow-400" />
                  Ver Strikes
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {strikesModal && (
        <StrikesModal
          entidadTipo="usuario"
          entidadId={strikesModal.id}
          entidadNombre={strikesModal.nombre}
          onClose={() => {
            setStrikesModal(null);
            fetchEstudiantes(); // Refresh para reflejar los strikes o si ha sido suspendido tras sumar 5 strikes
          }}
        />
      )}
    </motion.div>
  )
}

export default EstudiantesPanelAdmin
