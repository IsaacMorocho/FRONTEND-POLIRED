import { useEffect, useState } from "react";
import { FiX, FiUsers, FiFileText, FiGlobe } from "react-icons/fi";
import { MdVerifiedUser } from "react-icons/md";
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import superadminService from "../../services/superadminService";
import StrikesModal from "../strikes/StrikesModal";

const RedesPanelAdmin = () => {
  const [redes, setRedes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVer, setModalVer] = useState({ visible: false, red: null });
  const [modalAdmin, setModalAdmin] = useState({ visible: false, admin: null });
  const [strikesModal, setStrikesModal] = useState(null);

  const [filtroEstado, setFiltroEstado] = useState('todos');

  // Paginación y Filtrado
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 8;

  const redesFiltradas = redes.filter(red => {
    if (filtroEstado === 'todos') return true;
    return red.estadoAprobacion === filtroEstado;
  });

  const totalPaginas = Math.ceil(redesFiltradas.length / itemsPorPagina);
  const redesPaginadas = redesFiltradas.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

  const getRedPicUrl = (red) => {
    const profilePic = red?.fotoPerfil;
    if (!profilePic || profilePic === 'null' || profilePic === 'undefined') {
      return `https://ui-avatars.com/api/?name=${red?.nombre || 'Red'}&background=random`;
    }
    const path = profilePic;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const cleanPath = path.replace(/\\/g, '/');
    const base = import.meta.env.VITE_BACKEND_URL || '';
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
    return `${cleanBase}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
  };

  const fetchRedes = async () => {
    setLoading(true);
    try {
      const data = await superadminService.getRedes();
      setRedes(Array.isArray(data) ? data : data.redes || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedes();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Redes Comunitarias
          </h1>
          <p className="text-slate-400">Administra redes comunitarias del sistema</p>
        </div>
        
        <div>
          <select
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value);
              setPaginaActual(1);
            }}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:w-auto p-3 outline-none transition shadow-lg cursor-pointer hover:border-slate-500"
          >
            <option value="todos">Todas las Redes</option>
            <option value="pendiente">Solo Pendientes</option>
            <option value="aprobada">Solo Aprobadas</option>
          </select>
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-400">Cargando...</p>
        </div>
      ) : (
        <>
          <div className="w-full">
              {redesFiltradas.length === 0 ? (
                <div className="flex-1 flex items-center justify-center py-20">
                  <div className="text-slate-500 text-lg flex flex-col items-center gap-3">
                    <FiGlobe size={48} className="text-slate-600" />
                    <p>
                      {redes.length === 0 
                        ? 'No hay redes registradas' 
                        : 'No se encontraron resultados para los filtros aplicados'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2">
                    {redesPaginadas.map((red, idx) => (
                      <motion.div
                        key={red._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setModalVer({ visible: true, red })}
                        className="bg-slate-800/80 rounded-2xl border border-slate-700 hover:border-slate-500 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/10 group flex flex-col"
                      >
                        <div className="p-6 flex flex-col items-center relative flex-1">
                          <div className="relative mb-4">
                            <img 
                              src={getRedPicUrl(red)}
                              alt={red.nombre}
                              className="w-24 h-24 rounded-full object-cover border-4 border-slate-700 group-hover:border-slate-500 transition-colors"
                            />
                            {(red.esVerificada || red.esOficial) && (
                              <div className="absolute bottom-0 right-0 bg-slate-900 rounded-full p-1 shadow-lg border border-slate-700">
                                <MdVerifiedUser size={20} className={red.esOficial ? "text-yellow-400" : "text-blue-500"} />
                              </div>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-white text-center line-clamp-2 mb-2 group-hover:text-emerald-400 transition-colors">{red.nombre}</h3>
                          
                          {!red.esGlobal && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setStrikesModal({ tipo: 'red', id: red._id, nombre: red.nombre }); }}
                              className="text-yellow-400 hover:text-yellow-300 text-xs flex items-center justify-center gap-1 mb-2 bg-slate-900/50 px-2 py-1 rounded-full border border-yellow-900/50"
                              title="Ver strikes"
                            >
                              <AlertTriangle size={14} />
                              Strikes: {red.strikes?.length ?? 0}
                            </button>
                          )}

                          <div className="mt-auto pt-4 w-full border-t border-slate-700/50 flex flex-col gap-3">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-400 flex items-center gap-1"><FiUsers size={16} /> Miembros</span>
                              <span className="text-white font-semibold">{red.cantidadMiembros || 0}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-400 flex items-center gap-1"><FiFileText size={16} /> Publicaciones</span>
                              <span className="text-white font-semibold">{red.cantidadPublicaciones || 0}</span>
                            </div>
                            
                            <div className="mt-2 flex justify-center">
                              {red.estadoAprobacion === 'aprobada' ? (
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                  red.deshabilitada 
                                    ? 'bg-red-900/30 text-red-300 border border-red-800/50' 
                                    : 'bg-emerald-900/30 text-emerald-300 border border-emerald-800/50'
                                }`}>
                                  {red.deshabilitada ? 'Deshabilitada' : 'Habilitada'}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-900/30 text-orange-300 border border-orange-800/50">
                                  Pendiente
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

              {/* Paginación */}
              {redesFiltradas.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 p-2 gap-4">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span>Mostrando Resultados:</span>
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-slate-300 font-medium border border-slate-700">
                      {(paginaActual - 1) * itemsPorPagina + 1} - {Math.min(paginaActual * itemsPorPagina, redesFiltradas.length)} de {redesFiltradas.length}
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

      {/* Modal Ver Red */}
      {modalVer.visible && modalVer.red && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col shadow-2xl"
          >
            {/* Header / Cover */}
            <div className="relative h-20 bg-gradient-to-r from-blue-900/50 to-purple-900/50 flex shrink-0">
              <button
                onClick={() => setModalVer({ visible: false, red: null })}
                className="absolute top-4 right-4 p-2 bg-slate-900/50 hover:bg-slate-900 text-white rounded-full transition z-10"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="px-6 pb-4 relative flex-1 flex flex-col">
              {/* Profile Image & Name */}
              <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-end -mt-10 sm:-mt-12 mb-4">
                <div className="relative shrink-0">
                  <img 
                    src={getRedPicUrl(modalVer.red)} 
                    alt={modalVer.red.nombre} 
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-slate-900 object-cover shadow-lg"
                  />
                  {(modalVer.red.esVerificada || modalVer.red.esOficial) && (
                    <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-slate-900 rounded-full p-1 shadow-lg border border-slate-700">
                      <MdVerifiedUser size={24} className={modalVer.red.esOficial ? "text-yellow-400" : "text-blue-500"} />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left mt-2 sm:mt-0">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{modalVer.red.nombre}</h2>
                  <p className="text-slate-400 text-sm mt-1">Creada el {new Date(modalVer.red.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4 justify-center sm:justify-start">
                {modalVer.red.estadoAprobacion === 'aprobada' && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                    modalVer.red.deshabilitada ? 'bg-red-900/50 text-red-300 border border-red-800' : 'bg-green-900/50 text-green-300 border border-green-800'
                  }`}>
                    {modalVer.red.deshabilitada ? 'Deshabilitada' : 'Habilitada'}
                  </span>
                )}
                
                {modalVer.red.esVerificada && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold shadow-sm bg-blue-900/50 text-blue-300 border border-blue-800 flex items-center gap-1">
                    <MdVerifiedUser size={14} /> Verificada
                  </span>
                )}
                
                {modalVer.red.esOficial && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold shadow-sm bg-purple-900/50 text-purple-300 border border-purple-800 flex items-center gap-1">
                    <MdVerifiedUser size={14} /> Oficial
                  </span>
                )}
                
                {modalVer.red.esGlobal && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold shadow-sm bg-yellow-900/50 text-yellow-300 border border-yellow-800">
                    Red Global
                  </span>
                )}
                
                {modalVer.red.estadoAprobacion === 'pendiente' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold shadow-sm bg-orange-900/50 text-orange-300 border border-orange-800">
                    Estado: PENDIENTE
                  </span>
                )}
                {modalVer.red.estadoAprobacion === 'aprobada' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold shadow-sm bg-emerald-900/50 text-emerald-300 border border-emerald-800">
                    Estado: APROBADA
                  </span>
                )}
                {!modalVer.red.estadoAprobacion && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold shadow-sm bg-slate-800 text-slate-300 border border-slate-700">
                    Estado: N/A
                  </span>
                )}
              </div>

              {/* Data grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 col-span-1 md:col-span-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Descripción</span>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{modalVer.red.descripcion || 'Sin descripción'}</p>
                </div>
                
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 col-span-1 md:col-span-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Propósito</span>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{modalVer.red.proposito || 'Sin propósito especificado'}</p>
                </div>
                
                <div 
                  className={`bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 col-span-1 md:col-span-2 ${modalVer.red.administrador ? 'cursor-pointer hover:bg-slate-700/50 transition' : ''}`}
                  onClick={() => modalVer.red.administrador && setModalAdmin({ visible: true, admin: modalVer.red.administrador })}
                >
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Administrador / Dueño</span>
                  {modalVer.red.administrador ? (
                    <div className="flex items-center gap-3 mt-1">
                      <div className="w-10 h-10 rounded-full bg-emerald-900/50 border border-emerald-800 flex items-center justify-center text-emerald-300 font-bold uppercase overflow-hidden shrink-0">
                        {modalVer.red.administrador.fotoPerfil ? (
                          <img src={modalVer.red.administrador.fotoPerfil} alt={modalVer.red.administrador.nombre} className="w-full h-full object-cover" />
                        ) : (
                          modalVer.red.administrador.nombre?.charAt(0) || '?'
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-white text-sm font-semibold truncate">{modalVer.red.administrador.nombre} {modalVer.red.administrador.apellido}</p>
                        <p className="text-slate-400 text-xs truncate">{modalVer.red.administrador.email}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm italic">Esta red no tiene un administrador asignado.</p>
                  )}
                </div>
              </div>
              
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 flex flex-col sm:flex-row justify-around items-center text-center gap-4 mt-auto">
                <div className="flex flex-col items-center">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Miembros</span>
                  <span className="text-2xl font-bold text-white">{modalVer.red.cantidadMiembros || 0}</span>
                </div>
                <div className="hidden sm:block w-px h-10 bg-slate-700/50"></div>
                <div className="flex flex-col items-center">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Publicaciones</span>
                  <span className="text-2xl font-bold text-white">{modalVer.red.cantidadPublicaciones || 0}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Perfil Admin */}
      {modalAdmin.visible && modalAdmin.admin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative flex flex-col"
          >
            {/* Header / Cover */}
            <div className="h-24 bg-gradient-to-r from-blue-600/50 to-emerald-600/50 relative">
              <button 
                onClick={() => setModalAdmin({ visible: false, admin: null })}
                className="absolute top-4 right-4 p-2 bg-slate-900/50 hover:bg-slate-900 text-white rounded-full transition z-10"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="px-6 pb-6 relative flex flex-col items-center -mt-12">
              {/* Profile Image */}
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full border-4 border-slate-800 bg-slate-700 flex items-center justify-center text-3xl font-bold text-white overflow-hidden shadow-lg">
                  {modalAdmin.admin.fotoPerfil ? (
                    <img src={modalAdmin.admin.fotoPerfil} alt={modalAdmin.admin.nombre} className="w-full h-full object-cover" />
                  ) : (
                    modalAdmin.admin.nombre?.charAt(0) || '?'
                  )}
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white text-center">
                {modalAdmin.admin.nombre} {modalAdmin.admin.apellido}
              </h2>
              <p className="text-blue-400 text-sm font-medium mb-1">
                @{modalAdmin.admin.username || 'usuario'}
              </p>
              
              <div className="flex gap-2 mt-2 mb-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${modalAdmin.admin.status ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                  {modalAdmin.admin.status ? 'Activo' : 'Inactivo'}
                </span>
                {modalAdmin.admin.suspendido && (
                  <span className="px-2 py-1 rounded text-xs font-bold bg-red-900/50 text-red-400">Suspendido</span>
                )}
              </div>

              <div className="w-full bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 mt-2 space-y-3">
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold block">Email</span>
                  <p className="text-slate-300 text-sm break-all">{modalAdmin.admin.email}</p>
                </div>
                
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold block">Biografía</span>
                  <p className="text-slate-300 text-sm">
                    {modalAdmin.admin.biografia || <span className="italic text-slate-500">Sin biografía</span>}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {strikesModal && (
        <StrikesModal
          entidadTipo={strikesModal.tipo}
          entidadId={strikesModal.id}
          entidadNombre={strikesModal.nombre}
          onClose={() => setStrikesModal(null)}
        />
      )}
    </motion.div>
  );
};

export default RedesPanelAdmin;
