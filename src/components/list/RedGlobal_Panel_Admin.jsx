import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiAlertCircle, FiCalendar, FiChevronLeft, FiChevronRight, FiX, FiFileText } from "react-icons/fi";
import { MdFilterList, MdAssignmentTurnedIn, MdCheckCircle, MdCancel } from "react-icons/md";
import { motion, AnimatePresence } from 'framer-motion';
import superadminService from "../../services/superadminService";

const RedGlobalPanelAdmin = () => {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filtros de la barra lateral
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('pendiente'); // 'pendiente', 'resuelto', 'rechazado'
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

  const [modalDetalles, setModalDetalles] = useState({ visible: false, item: null });

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 6;

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  const getImageUrl = (path) => {
    if (!path || path === 'null' || path === 'undefined') return null;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const cleanPath = path.replace(/\\/g, '/');
    const base = API_BASE?.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
    return `${base}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const resPub = await superadminService.getReportes('publicacion');
      const resArt = await superadminService.getReportes('articulo');
      
      const combined = [...(resPub.reportes || []), ...(resArt.reportes || [])];
      
      const mapped = combined.map(item => {
        let catLegible = 'Desconocida';
        if (item.subtype === 'publicacion') {
          catLegible = 'Noticias';
        } else if (item.subtype === 'articulo') {
          const catInterna = item.meta?.articuloId?.categoria;
          if (catInterna?.toLowerCase() === 'venta') catLegible = 'Ventas';
          if (catInterna?.toLowerCase() === 'cursos') catLegible = 'Cursos';
        }
        return { ...item, categoriaLegible: catLegible };
      });
      
      mapped.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setDataList(mapped);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al cargar los reportes de la Red Global");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPaginaActual(1);
  }, [estadoSeleccionado, categoriaSeleccionada]);

  // Acciones
  const handleResolver = async (id, accion) => {
    try {
      const estado = accion === 'aprobar' ? 'Resuelta' : 'Rechazada';
      await superadminService.resolverReporteRedGlobalSuperAdmin(id, { estado });
      toast.success(`Reporte ${accion.toLowerCase() === 'aprobar' ? 'Aceptado (Contenido eliminado)' : 'Rechazado (Contenido mantenido)'}`);
      setModalDetalles({ visible: false, item: null });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error al resolver el reporte");
      console.error(error);
    }
  };

  // Lógica de filtrado
  let itemsMostrados = [];

  const categoriasDisponibles = ['Todas', 'Noticias', 'Ventas', 'Cursos'];

  let filtrados = dataList.filter(r => {
    const estado = (r.estado || r.estadoAprobacion || '').toLowerCase();
    if (estadoSeleccionado === 'pendiente') return estado === 'pendiente';
    if (estadoSeleccionado === 'resuelto') return ['aprobada', 'resuelto', 'resuelta'].includes(estado);
    if (estadoSeleccionado === 'rechazado') return ['rechazada', 'rechazado'].includes(estado);
    return true;
  });

  if (categoriaSeleccionada !== 'Todas') {
    filtrados = filtrados.filter(r => r.categoriaLegible === categoriaSeleccionada);
  }
  
  itemsMostrados = filtrados;

  const totalPaginas = Math.ceil(itemsMostrados.length / itemsPorPagina);
  const itemsPaginados = itemsMostrados.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

  const resetFiltros = () => {
    setEstadoSeleccionado('pendiente');
    setCategoriaSeleccionada('Todas');
    setPaginaActual(1);
  };

  return (
    <div className="flex flex-col h-full gap-6 p-2 sm:p-4 w-full">
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
                { id: 'resuelto', label: 'Resueltos / Aceptados', color: 'text-green-500' },
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
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Categoría</h3>
            <div className="flex flex-col gap-2">
              {categoriasDisponibles.map(cat => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input
                      type="radio"
                      name="categoria"
                      value={cat}
                      checked={categoriaSeleccionada === cat}
                      onChange={() => setCategoriaSeleccionada(cat)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 rounded-full border-2 border-slate-600 peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all"></div>
                    <div className="absolute w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                  </div>
                  <span className={`text-sm font-medium transition ${categoriaSeleccionada === cat ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ---------------- CUADRÍCULA DE TARJETAS ---------------- */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Reportes de Red Global</h1>
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
                    const desc = item.descripcion || 'Sin descripción';
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
                        <div className="relative h-32 bg-slate-800 overflow-hidden shrink-0">
                          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900/50 to-purple-900/50`}>
                            <FiFileText size={48} className="text-white/10" />
                          </div>
                          
                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                              isResolved ? 'bg-green-600 text-white' :
                              isRejected ? 'bg-red-600 text-white' :
                              'bg-yellow-600 text-white'
                            }`}>
                              {item.estado ? item.estado.toUpperCase() : 'PENDIENTE'}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{item.categoriaLegible}</h3>
                          
                          <div className="flex items-start gap-2 text-slate-400 text-sm mb-4">
                            <FiAlertCircle className="mt-1 shrink-0" />
                            <p className="line-clamp-2">{desc}</p>
                          </div>

                          <div className="mt-auto pt-4 border-t border-slate-800">
                            <div className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded-md">
                              <FiCalendar size={12} className="text-purple-400" />
                              <span>{new Date(item.createdAt || Date.now()).toLocaleDateString()}</span>
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
            className={`bg-slate-900 border border-slate-700 rounded-2xl p-0 w-full flex flex-col overflow-hidden max-h-[90vh] shadow-2xl ${
              modalDetalles.item?.meta?.publicacionId || modalDetalles.item?.meta?.articuloId
                ? 'max-w-4xl md:flex-row'
                : 'max-w-lg'
            }`}
          >
            {(modalDetalles.item?.meta?.publicacionId || modalDetalles.item?.meta?.articuloId) ? (
              <>
                {/* Lado izquierdo: Publicación o Artículo */}
                <div className="flex-1 min-h-0 md:max-h-full md:flex-1 p-4 md:p-6 overflow-y-auto bg-slate-950 border-b md:border-b-0 md:border-r border-slate-800 relative">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-white">Contenido Reportado</h2>
                  </div>
                  <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
                    {/* Header */}
                    <div className="p-4 flex items-center gap-3">
                      <img 
                        src={getImageUrl(
                          modalDetalles.item?.meta?.publicacionId?.autorId?.fotoPerfil || 
                          modalDetalles.item?.meta?.articuloId?.autorId?.fotoPerfil
                        ) || `https://ui-avatars.com/api/?name=${modalDetalles.item?.meta?.publicacionId?.autorId?.nombre || modalDetalles.item?.meta?.articuloId?.autorId?.nombre || 'User'}&background=random`}
                        alt="Avatar Autor"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-white text-sm">
                          {modalDetalles.item?.meta?.publicacionId?.autorId?.nombre || modalDetalles.item?.meta?.articuloId?.autorId?.nombre} {modalDetalles.item?.meta?.publicacionId?.autorId?.apellido || modalDetalles.item?.meta?.articuloId?.autorId?.apellido}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          {modalDetalles.item?.meta?.redId?.fotoPerfil && (
                            <img 
                              src={getImageUrl(modalDetalles.item.meta.redId.fotoPerfil)} 
                              alt="Avatar Red" 
                              className="w-4 h-4 rounded-full object-cover"
                            />
                          )}
                          <p className="text-xs text-slate-400">
                            {modalDetalles.item?.meta?.redId?.nombre || 'Red Comunitaria'}
                            {(modalDetalles.item?.meta?.publicacionId?.timestamp || modalDetalles.item?.meta?.articuloId?.createdAt) && 
                              ` • ${new Date(modalDetalles.item?.meta?.publicacionId?.timestamp || modalDetalles.item?.meta?.articuloId?.createdAt).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contenido */}
                    {(modalDetalles.item?.meta?.publicacionId?.tipoContenido === 'texto' || modalDetalles.item?.meta?.articuloId?.tipoContenido === 'texto') ? (
                      <div className="p-4 pt-0">
                        {(modalDetalles.item?.meta?.publicacionId?.titulo || modalDetalles.item?.meta?.articuloId?.titulo) && (
                          <div className="mb-2">
                            <h4 className="text-xl font-bold text-white break-words">
                              {modalDetalles.item?.meta?.publicacionId?.titulo || modalDetalles.item?.meta?.articuloId?.titulo}
                            </h4>
                            {modalDetalles.item?.meta?.articuloId?.precio !== undefined && (
                              <span className="inline-block mt-1 bg-emerald-900/50 text-emerald-300 px-2 py-0.5 rounded text-sm font-bold border border-emerald-800/50">
                                ${modalDetalles.item.meta.articuloId.precio}
                              </span>
                            )}
                          </div>
                        )}
                        <p className="text-sm text-slate-300 whitespace-pre-wrap break-words">
                          {modalDetalles.item?.meta?.publicacionId?.contenido || modalDetalles.item?.meta?.articuloId?.descripcion}
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Imagen */}
                        {(modalDetalles.item?.meta?.publicacionId?.mediaUrls?.length > 0 || modalDetalles.item?.meta?.articuloId?.mediaUrls?.length > 0) && (
                          <div className="w-full bg-black/40">
                            <img 
                              src={getImageUrl((modalDetalles.item?.meta?.publicacionId?.mediaUrls || modalDetalles.item?.meta?.articuloId?.mediaUrls)?.[0])}
                              alt="Contenido"
                              className="w-full h-auto object-contain max-h-[400px]"
                            />
                          </div>
                        )}
                        {/* Texto */}
                        <div className="p-4">
                          {(modalDetalles.item?.meta?.publicacionId?.titulo || modalDetalles.item?.meta?.articuloId?.titulo) && (
                            <div className="mb-2">
                              <h4 className="text-xl font-bold text-white break-words">
                                {modalDetalles.item?.meta?.publicacionId?.titulo || modalDetalles.item?.meta?.articuloId?.titulo}
                              </h4>
                              {modalDetalles.item?.meta?.articuloId?.precio !== undefined && (
                                <span className="inline-block mt-1 bg-emerald-900/50 text-emerald-300 px-2 py-0.5 rounded text-sm font-bold border border-emerald-800/50">
                                  ${modalDetalles.item.meta.articuloId.precio}
                                </span>
                              )}
                            </div>
                          )}
                          <p className="text-sm text-slate-300 whitespace-pre-wrap break-words">
                            <span className="font-bold text-white mr-2">
                              {modalDetalles.item?.meta?.publicacionId?.autorId?.username || modalDetalles.item?.meta?.publicacionId?.autorId?.nombre || modalDetalles.item?.meta?.articuloId?.autorId?.username || modalDetalles.item?.meta?.articuloId?.autorId?.nombre}
                            </span>
                            {modalDetalles.item?.meta?.publicacionId?.contenido || modalDetalles.item?.meta?.articuloId?.descripcion}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Columna Derecha: Detalles y Acciones */}
                <div className="w-full md:w-80 flex-1 md:flex-none flex flex-col bg-slate-900 relative min-h-0 md:max-h-full">
                  <button
                    onClick={() => setModalDetalles({ visible: false, item: null })}
                    className="absolute top-4 right-4 p-2 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition z-10"
                  >
                    <FiX size={20} />
                  </button>
                  <div className="p-4 md:p-6 flex-1 overflow-y-auto mt-0 md:mt-4">
                    <h2 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-4">Detalles del Reporte</h2>
                    <div className="space-y-2 md:space-y-4">
                      <div className="bg-slate-800 p-3 md:p-4 rounded-xl border border-slate-700">
                        <span className="text-[10px] md:text-xs font-medium text-slate-400 block mb-1">Categoría:</span>
                        <span className="text-white text-xs md:text-sm font-bold">{modalDetalles.item.categoriaLegible}</span>
                      </div>
                      <div className="bg-slate-800 p-3 md:p-4 rounded-xl border border-slate-700">
                        <span className="text-[10px] md:text-xs font-medium text-slate-400 block mb-1">Estado:</span>
                        <span className={`text-xs md:text-sm font-bold ${
                          ['aprobada', 'resuelto', 'resuelta'].includes((modalDetalles.item?.estado || '').toLowerCase()) ? 'text-green-400' :
                          ['rechazada', 'rechazado'].includes((modalDetalles.item?.estado || '').toLowerCase()) ? 'text-red-400' : 'text-yellow-400'
                        }`}>
                          {modalDetalles.item?.estado || 'Pendiente'}
                        </span>
                      </div>
                      <div className="bg-slate-800 p-3 md:p-4 rounded-xl border border-slate-700">
                        <span className="text-[10px] md:text-xs font-medium text-slate-400 block mb-1 md:mb-2">Descripción del reporte:</span>
                        <p className="text-white text-xs md:text-sm leading-relaxed">{modalDetalles.item?.descripcion || 'Sin descripción'}</p>
                      </div>
                      {modalDetalles.item?.reporterId && (
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                          <span className="text-xs font-medium text-slate-400 block mb-2">Reportado por:</span>
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
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-6 border-t border-slate-800 bg-slate-900/80 shrink-0">
                    <div className="flex flex-col gap-3">
                      {(!(modalDetalles.item?.estado) || modalDetalles.item.estado.toLowerCase() === 'pendiente') && (
                        <>
                          <p className="text-[10px] md:text-xs text-slate-400 text-center leading-tight mb-2">
                            Se eliminará el contenido y se otorgará un strike al autor.
                          </p>
                          <div className="flex flex-row md:flex-col gap-2 md:gap-3">
                            <button
                              onClick={() => handleResolver(modalDetalles.item._id, 'aprobar')}
                              className="flex-1 w-full flex items-center justify-center gap-1 md:gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-2 md:py-3 rounded-xl transition shadow-lg shadow-green-900/20 text-xs md:text-base"
                            >
                              <MdCheckCircle className="w-4 h-4 md:w-5 md:h-5" /> Aceptar
                            </button>
                            <button
                              onClick={() => handleResolver(modalDetalles.item._id, 'rechazar')}
                              className="flex-1 w-full flex items-center justify-center gap-1 md:gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-2 md:py-3 rounded-xl transition shadow-lg shadow-red-900/20 text-xs md:text-base"
                            >
                              <MdCancel className="w-4 h-4 md:w-5 md:h-5" /> Rechazar
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Layout original 1 columna si no hay meta
              <>
                <div className="p-6 border-b border-slate-800 relative">
                  <button
                    onClick={() => setModalDetalles({ visible: false, item: null })}
                    className="absolute top-6 right-6 p-2 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition z-10"
                  >
                    <FiX size={20} />
                  </button>
                  <h2 className="text-2xl font-bold text-white mb-6">Detalles del Reporte</h2>
                  <div className="space-y-4">
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                      <span className="text-sm font-medium text-slate-400 block mb-2">Categoría:</span>
                      <span className="text-white text-sm font-bold block">{modalDetalles.item.categoriaLegible}</span>
                    </div>
                    
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                      <span className="text-sm font-medium text-slate-400 block mb-2">Estado:</span>
                      <span className={`text-sm font-bold block ${
                        ['aprobada', 'resuelto', 'resuelta'].includes((modalDetalles.item?.estado || '').toLowerCase()) ? 'text-green-400' :
                        ['rechazada', 'rechazado'].includes((modalDetalles.item?.estado || '').toLowerCase()) ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {modalDetalles.item?.estado || 'Pendiente'}
                      </span>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                      <span className="text-sm font-medium text-slate-400 block mb-2">Descripción del reporte:</span>
                      <p className="text-white text-sm leading-relaxed">{modalDetalles.item?.descripcion || 'Sin descripción'}</p>
                    </div>

                    {modalDetalles.item?.reporterId && (
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
                  </div>
                </div>
                
                <div className="p-6 border-t border-slate-800 bg-slate-900/80">
                  <div className="flex flex-col gap-3">
                    {(!(modalDetalles.item?.estado) || modalDetalles.item.estado.toLowerCase() === 'pendiente') && (
                      <>
                        <p className="text-[10px] md:text-xs text-slate-400 text-center leading-tight mb-2">
                          Se eliminará el contenido y se otorgará un strike al autor.
                        </p>
                        <div className="flex flex-row md:flex-col gap-2 md:gap-3">
                          <button
                            onClick={() => handleResolver(modalDetalles.item._id, 'aprobar')}
                            className="flex-1 w-full flex items-center justify-center gap-1 md:gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-2 md:py-3 rounded-xl transition shadow-lg shadow-green-900/20 text-xs md:text-base"
                          >
                            <MdCheckCircle className="w-4 h-4 md:w-5 md:h-5" /> Aceptar
                          </button>
                          <button
                            onClick={() => handleResolver(modalDetalles.item._id, 'rechazar')}
                            className="flex-1 w-full flex items-center justify-center gap-1 md:gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 md:py-3 rounded-xl transition shadow-lg shadow-slate-900/20 text-xs md:text-base"
                          >
                            <MdCancel className="w-4 h-4 md:w-5 md:h-5" /> Rechazar
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default RedGlobalPanelAdmin;
