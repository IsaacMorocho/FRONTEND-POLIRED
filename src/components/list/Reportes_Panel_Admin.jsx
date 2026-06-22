import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { FiAlertCircle, FiCalendar, FiChevronLeft, FiChevronRight, FiX, FiUserX, FiSmartphone } from "react-icons/fi";
import { MdWarning, MdFilterList, MdAssignmentTurnedIn, MdCheckCircle, MdCancel } from "react-icons/md";
import { motion, AnimatePresence } from 'framer-motion';
import superadminService from "../../services/superadminService";

const ReportesPanelAdmin = () => {
  const [activeTab, setActiveTab] = useState('app'); // 'app', 'usuarios'
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resolviendo, setResolviendo] = useState(false);
  
  // Filtros de la barra lateral
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('pendiente'); // 'pendiente', 'resuelto', 'rechazado'
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

  const [modalDetalles, setModalDetalles] = useState({ visible: false, item: null });

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 6;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'app') {
        const data = await superadminService.getReportes('app');
        setDataList(data.reportes || []);
      } else if (activeTab === 'usuarios') {
        const data = await superadminService.getReportes('usuario');
        setDataList(data.reportes || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
    // Reset filters when tab changes
    setEstadoSeleccionado('pendiente');
    setCategoriaSeleccionada('Todas');
    setPaginaActual(1);
  }, [fetchData]);

  // Reset page when filters change
  useEffect(() => {
    setPaginaActual(1);
  }, [estadoSeleccionado, categoriaSeleccionada]);

  // Acciones
  const handleResolverApp = async (id, estado) => {
    setResolviendo(true);
    try {
      await superadminService.resolverReporteApp(id, { estado });
      toast.success(`Reporte de App ${estado}`);
      setModalDetalles({ visible: false, item: null });
      fetchData();
    } catch (error) {
      toast.error("Error al resolver el reporte");
      console.error(error);
    } finally {
      setResolviendo(false);
    }
  };

  const handleResolverUsuario = async (id, estado) => {
    setResolviendo(true);
    try {
      await superadminService.resolverReporteUsuario(id, { estado });
      toast.success(`Reporte de Usuario ${estado}`);
      setModalDetalles({ visible: false, item: null });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error al resolver el reporte");
      console.error(error);
    } finally {
      setResolviendo(false);
    }
  };

  // Lógica de filtrado
  let itemsMostrados = [];

  // Categorías dinámicas
  const categoriasDisponibles = ['Todas', ...new Set(dataList.map(item => item.categoria || item.tipo).filter(Boolean))];

  // Normalizar estados para filtrado
  let filtrados = dataList.filter(r => {
    const estado = (r.estado || r.estadoAprobacion || '').toLowerCase();
    if (estadoSeleccionado === 'pendiente') return estado === 'pendiente';
    if (estadoSeleccionado === 'resuelto') return ['aprobada', 'resuelto', 'resuelta'].includes(estado);
    if (estadoSeleccionado === 'rechazado') return ['rechazada', 'rechazado'].includes(estado);
    return true;
  });

  if (categoriaSeleccionada !== 'Todas') {
    filtrados = filtrados.filter(r => (r.tipo || 'Sin categoría') === categoriaSeleccionada);
  }
  
  itemsMostrados = filtrados;

  const totalPaginas = Math.ceil(itemsMostrados.length / itemsPorPagina);
  const itemsPaginados = itemsMostrados.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

  const resetFiltros = () => {
    setEstadoSeleccionado('pendiente');
    setCategoriaSeleccionada('Todas');
    setPaginaActual(1);
  };

  const getTabTitle = () => {
    if (activeTab === 'app') return 'Reportes de la Aplicación';
    if (activeTab === 'usuarios') return 'Reportes de Usuarios';
    return 'Reportes';
  };

  return (
    <div className="flex flex-col h-full gap-6 p-2 sm:p-4 w-full">
      {/* Tabs Menu */}
      <div className="flex flex-wrap bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1 w-full lg:w-fit self-center lg:self-start shadow-xl">
        <button
          onClick={() => setActiveTab('app')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'app' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          <FiSmartphone size={18} /> Reportes Aplicación
        </button>
        <button
          onClick={() => setActiveTab('usuarios')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'usuarios' ? 'bg-red-600 text-white shadow-lg shadow-red-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          <FiUserX size={18} /> Reportes Usuarios
        </button>

      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ---------------- BARRA LATERAL (FILTROS) ---------------- */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-72 shrink-0 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-8 shadow-xl lg:sticky lg:top-0 h-fit"
        >
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MdFilterList className="text-blue-500" />
              Filtros
            </h2>
            <button onClick={resetFiltros} className="text-sm text-slate-400 hover:text-blue-400 transition font-medium">
              Limpiar
            </button>
          </div>

          {/* Estado */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Estado</h3>
            <div className="flex flex-col gap-2">
              {[
                { id: 'pendiente', label: 'Pendientes', color: 'text-yellow-500' },
                { id: 'resuelto', label: 'Resueltos / Aprobados', color: 'text-green-500' },
                { id: 'rechazado', label: 'Rechazados', color: 'text-red-500' },
              ].map(opt => (
                <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input
                      type="radio"
                      name="estado"
                      value={opt.id}
                      checked={estadoSeleccionado === opt.id}
                      onChange={() => setEstadoSeleccionado(opt.id)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 rounded-full border-2 border-slate-600 peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all"></div>
                    <div className="absolute w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                  </div>
                  <span className={`text-sm font-medium transition ${estadoSeleccionado === opt.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Categoría */}
          {categoriasDisponibles.length > 1 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Categoría</h3>
              <div className="flex flex-wrap gap-2">
                {categoriasDisponibles.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoriaSeleccionada(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      categoriaSeleccionada === cat
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* ---------------- CUADRÍCULA DE TARJETAS ---------------- */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{getTabTitle()}</h1>
            <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-300 shrink-0">
              Total: <span className="font-bold text-white">{itemsMostrados.length}</span>
            </div>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-slate-400 text-lg animate-pulse">Cargando datos...</div>
            </div>
          ) : itemsMostrados.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-slate-500 text-lg flex flex-col items-center gap-3">
                <MdAssignmentTurnedIn size={48} className="text-slate-600" />
                <p>No se encontraron resultados para los filtros aplicados</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {itemsPaginados.map((item, idx) => {
                    let titulo = item.tipo || 'Sin Tipo';
                    
                    const desc = item.descripcion || item.proposito || 'Sin descripción';
                    const estadoItem = (item.estado || item.estadoAprobacion || '').toLowerCase();
                    const isResolved = ['aprobada', 'resuelto', 'resuelta'].includes(estadoItem);
                    const isRejected = ['rechazada', 'rechazado'].includes(estadoItem);
                    
                    return (
                      <motion.div
                        key={item._id || idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ y: -5 }}
                        className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl group cursor-pointer flex flex-col"
                        onClick={() => setModalDetalles({ visible: true, item })}
                      >
                        <div className="relative h-48 bg-slate-800 overflow-hidden shrink-0">
                          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${activeTab === 'app' ? 'from-purple-900/50 to-blue-900/50' : 'from-red-900/50 to-orange-900/50'}`}>
                            {activeTab === 'app' && <MdWarning size={64} className="text-white/10" />}
                            {activeTab === 'usuarios' && <FiUserX size={64} className="text-white/10" />}
                          </div>
                          
                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                              isResolved ? 'bg-green-600 text-white' :
                              isRejected ? 'bg-red-600 text-white' :
                              'bg-yellow-600 text-white'
                            }`}>
                              {item.estado ? item.estado.toUpperCase() : item.estadoAprobacion ? item.estadoAprobacion.toUpperCase() : 'PENDIENTE'}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{titulo}</h3>
                          
                          <div className="flex items-start gap-2 text-slate-400 text-sm mb-4">
                            <FiAlertCircle className="mt-1 shrink-0" />
                            <p className="line-clamp-2">{desc}</p>
                          </div>

                          <div className="mt-auto pt-4 border-t border-slate-800">
                            <div className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded-md">
                              <FiCalendar size={12} className="text-purple-400" />
                              <span>{new Date(item.createdAt || item.timestamp || Date.now()).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Paginación */}
              {itemsMostrados.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-slate-800 gap-4">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span>Mostrando Resultados:</span>
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-slate-300 font-medium border border-slate-700">
                      {(paginaActual - 1) * itemsPorPagina + 1} - {Math.min(paginaActual * itemsPorPagina, itemsMostrados.length)} de {itemsMostrados.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6">
                    <button
                      onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                      disabled={paginaActual === 1}
                      className="flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-white disabled:opacity-50 disabled:hover:text-slate-400 transition"
                    >
                      <FiChevronLeft size={18} /> Anterior
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPaginas || 1 }, (_, i) => i + 1).map(pageNum => (
                        <button
                          key={pageNum}
                          onClick={() => setPaginaActual(pageNum)}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl text-base font-medium transition ${
                            paginaActual === pageNum 
                              ? 'border border-slate-600 text-blue-400' 
                              : 'text-slate-400 hover:text-white'
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
                      Siguiente <FiChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ---------------- MODAL DE DETALLES ---------------- */}
      {modalDetalles.visible && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-slate-700 rounded-2xl p-0 w-full max-w-lg flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-slate-800 relative">
              <button
                onClick={() => setModalDetalles({ visible: false, item: null })}
                className="absolute top-6 right-6 p-2 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition z-10"
              >
                <FiX size={20} />
              </button>
              <h2 className="text-2xl font-bold text-white mb-6">Detalles</h2>
              <div className="space-y-4">
                {modalDetalles.item?.tipo && activeTab !== 'solicitudes_redes' && (
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <span className="text-sm font-medium text-slate-400 block mb-2">Tipo:</span>
                    <span className="text-white text-sm font-bold block">{modalDetalles.item.tipo}</span>
                  </div>
                )}
                {modalDetalles.item?.nombre && activeTab === 'solicitudes_redes' && (
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <span className="text-sm font-medium text-slate-400 block mb-2">Nombre de la Red:</span>
                    <span className="text-white text-sm font-bold block">{modalDetalles.item.nombre}</span>
                  </div>
                )}
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <span className="text-sm font-medium text-slate-400 block mb-2">Estado:</span>
                  <span className={`text-sm font-bold block ${
                    ['aprobada', 'resuelto', 'resuelta'].includes((modalDetalles.item?.estado || modalDetalles.item?.estadoAprobacion || '').toLowerCase()) ? 'text-green-400' :
                    ['rechazada', 'rechazado'].includes((modalDetalles.item?.estado || modalDetalles.item?.estadoAprobacion || '').toLowerCase()) ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {modalDetalles.item?.estado || modalDetalles.item?.estadoAprobacion || 'Pendiente'}
                  </span>
                </div>
                {activeTab !== 'solicitudes_redes' && (
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <span className="text-sm font-medium text-slate-400 block mb-2">Descripción / Motivo:</span>
                    <p className="text-white text-sm leading-relaxed">{modalDetalles.item?.descripcion || modalDetalles.item?.proposito || 'Sin descripción'}</p>
                  </div>
                )}

                {modalDetalles.item?.createdAt && (
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <span className="text-sm font-medium text-slate-400 block mb-2">Fecha de emisión:</span>
                    <span className="text-white text-sm font-bold block">
                      {new Date(modalDetalles.item.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                    </span>
                  </div>
                )}
                
                {/* Detalles extra según tab */}
                {activeTab === 'app' && modalDetalles.item?.reporterId && (
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <span className="text-sm font-medium text-slate-400 block mb-2">Reportado por:</span>
                    <span className="text-white text-sm font-bold block">
                      {typeof modalDetalles.item.reporterId === 'object' ? (
                        <>
                          <span className="block">{modalDetalles.item.reporterId.nombre} {modalDetalles.item.reporterId.apellido}</span>
                          <span className="block text-slate-400 font-normal text-xs">{modalDetalles.item.reporterId.email}</span>
                        </>
                      ) : (
                        `ID: ${modalDetalles.item.reporterId}`
                      )}
                    </span>
                  </div>
                )}
                {activeTab === 'solicitudes_redes' && (
                  <>
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                      <span className="text-sm font-medium text-slate-400 block mb-2">Descripción:</span>
                      <p className="text-white text-sm leading-relaxed">{modalDetalles.item?.descripcion || 'Sin descripción'}</p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                      <span className="text-sm font-medium text-slate-400 block mb-2">Propósito:</span>
                      <p className="text-white text-sm leading-relaxed">{modalDetalles.item?.proposito || 'Sin propósito'}</p>
                    </div>
                    {modalDetalles.item?.administrador && (
                      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <span className="text-sm font-medium text-slate-400 block mb-2">Solicitante (Administrador):</span>
                        <span className="text-white text-sm font-bold block">
                          {typeof modalDetalles.item.administrador === 'object' ? (
                            <>
                              <span className="block">{modalDetalles.item.administrador.nombre} {modalDetalles.item.administrador.apellido}</span>
                              <span className="block text-slate-400 font-normal text-xs">{modalDetalles.item.administrador.email}</span>
                            </>
                          ) : (
                            `ID: ${modalDetalles.item.administrador}`
                          )}
                        </span>
                      </div>
                    )}
                  </>
                )}
                {activeTab === 'usuarios' && modalDetalles.item?.meta?.reportadoUsuarioId && (
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <span className="text-sm font-medium text-slate-400 block mb-2">Usuario Reportado:</span>
                    <span className="text-white text-sm font-bold block">
                      {typeof modalDetalles.item.meta.reportadoUsuarioId === 'object' ? (
                        <>
                          <span className="block">{modalDetalles.item.meta.reportadoUsuarioId.nombre} {modalDetalles.item.meta.reportadoUsuarioId.apellido}</span>
                          <span className="block text-slate-400 font-normal text-xs">{modalDetalles.item.meta.reportadoUsuarioId.email}</span>
                        </>
                      ) : (
                        `ID: ${modalDetalles.item.meta.reportadoUsuarioId}`
                      )}
                    </span>
                  </div>
                )}

                {activeTab === 'habilitar_usuarios' && modalDetalles.item?.solicitante && (
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <span className="text-sm font-medium text-slate-400 block mb-2">Usuario Solicitante:</span>
                    <span className="text-white text-sm font-bold block">
                      <span className="block">{modalDetalles.item.solicitante.nombre} {modalDetalles.item.solicitante.apellido}</span>
                      <span className="block text-slate-400 font-normal text-xs">{modalDetalles.item.solicitante.email}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-slate-800 bg-slate-900/80">
              <div className="flex flex-col gap-3">
                {activeTab === 'app' && modalDetalles.item?.estado === 'pendiente' && (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleResolverApp(modalDetalles.item._id, 'resuelto')}
                      disabled={resolviendo}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl transition flex flex-col items-center justify-center gap-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center gap-2 font-semibold">
                        <MdCheckCircle size={20} /> Aceptar Reporte
                      </div>
                      <span className="text-[10px] font-normal text-blue-200 text-center leading-tight">Marcar como solucionado</span>
                    </button>
                    <button
                      onClick={() => handleResolverApp(modalDetalles.item._id, 'rechazado')}
                      disabled={resolviendo}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MdCancel size={20} /> Rechazar
                    </button>
                  </div>
                )}

                {activeTab === 'usuarios' && modalDetalles.item?.estado === 'pendiente' && (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleResolverUsuario(modalDetalles.item._id, 'resuelto')}
                      disabled={resolviendo}
                      className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-xl transition flex flex-col items-center justify-center gap-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center gap-2 font-semibold">
                        <MdCheckCircle size={20} /> Aceptar Reporte
                      </div>
                      <span className="text-[10px] font-normal text-red-200 text-center leading-tight">Se otorgará un strike al usuario</span>
                    </button>
                    <button
                      onClick={() => handleResolverUsuario(modalDetalles.item._id, 'rechazado')}
                      disabled={resolviendo}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MdCancel size={20} /> Desestimar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ReportesPanelAdmin;

