import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiX, FiAlertCircle, FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdWarning, MdAssignmentTurnedIn, MdPendingActions, MdFilterList, MdCheckCircle, MdCancel } from "react-icons/md";
import { motion, AnimatePresence } from 'framer-motion';
import adminRedService from "../../services/adminRedService";

const ReportesSolicitudesAR = () => {
  const [reportes, setReportes] = useState([]);
  const [solicitudesVerificacion, setSolicitudesVerificacion] = useState([]);
  const [solicitudesRehabilitacion, setSolicitudesRehabilitacion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resolviendo, setResolviendo] = useState(false);
  
  // Filtros de la barra lateral
  const [vistaSeleccionada, setVistaSeleccionada] = useState('reportes'); // 'reportes', 'verificacion', 'rehabilitacion'
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('pendiente'); // 'pendiente', 'resuelto', 'rechazado'
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

  const [modalDetalles, setModalDetalles] = useState({ visible: false, item: null, tipo: null });

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 6;

  const getImageUrl = (path) => {
    if (!path || path === 'null' || path === 'undefined') return null;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const cleanPath = path.replace(/\\/g, '/');
    const base = API_BASE?.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
    return `${base}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
  };

  // Cargar datos
  const fetchReportes = async () => {
    setLoading(true);
    try {
      const data = await adminRedService.getReportes();
      setReportes(Array.isArray(data) ? data : data.reportes || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSolicitudesVerificacion = async () => {
    setLoading(true);
    try {
      const data = await adminRedService.getSolicitudesVerificacion();
      setSolicitudesVerificacion(Array.isArray(data) ? data : data.solicitudes || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSolicitudesRehabilitacion = async () => {
    setLoading(true);
    try {
      const data = await adminRedService.getSolicitudesRehabilitacion();
      setSolicitudesRehabilitacion(Array.isArray(data) ? data : data.solicitudes || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vistaSeleccionada === 'reportes') fetchReportes();
    else if (vistaSeleccionada === 'verificacion') fetchSolicitudesVerificacion();
    else if (vistaSeleccionada === 'oficialización') fetchSolicitudesRehabilitacion();
    setPaginaActual(1); // Reset page on view change
  }, [vistaSeleccionada]);

  // Reset page when filters change
  useEffect(() => {
    setPaginaActual(1);
  }, [estadoSeleccionado, categoriaSeleccionada]);

  // Acciones
  const handleResolverReporte = async (reporteId, estado) => {
    setResolviendo(true);
    try {
      await adminRedService.resolverReporte(reporteId, { estado });
      const nuevoEstado = estado.toLowerCase() === 'resuelta' ? 'resuelto' : estado.toLowerCase();
      
      const reporteResuelto = reportes.find(r => r._id === reporteId);
      const publicacionId = reporteResuelto?.meta?.publicacionId?._id || reporteResuelto?.meta?.publicacionId;

      setReportes(reportes.map(r => {
        if (r._id === reporteId) {
          return { ...r, estado: nuevoEstado };
        }
        // Si el reporte resuelto fue aceptado (contenido eliminado), cerramos también los demás reportes pendientes de la misma publicación
        if (nuevoEstado === 'resuelto' && publicacionId && r.estado === 'pendiente') {
          const rPubId = r.meta?.publicacionId?._id || r.meta?.publicacionId;
          if (rPubId === publicacionId) {
            return { ...r, estado: 'resuelto' };
          }
        }
        return r;
      }));
      setModalDetalles({ visible: false, item: null, tipo: null });
      toast.success(`Reporte ${estado}`);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al resolver el reporte");
    } finally {
      setResolviendo(false);
    }
  };

  // Lógica de filtrado unificada
  let itemsMostrados = [];
  let categoriasDisponibles = ['Todas'];

  if (vistaSeleccionada === 'reportes') {
    // Normalizar estados para filtrado
    let filtrados = reportes.filter(r => {
      const estado = (r.estado || '').toLowerCase();
      if (estadoSeleccionado === 'pendiente') return estado === 'pendiente';
      if (estadoSeleccionado === 'resuelto') return ['aprobado', 'aprobada', 'resuelto', 'resuelta'].includes(estado);
      if (estadoSeleccionado === 'rechazado') return ['rechazado', 'rechazada'].includes(estado);
      return true;
    });

    categoriasDisponibles = ['Todas', ...new Set(reportes.map(r => r.tipo || 'Sin categoría'))];

    if (categoriaSeleccionada !== 'Todas') {
      filtrados = filtrados.filter(r => (r.tipo || 'Sin categoría') === categoriaSeleccionada);
    }
    itemsMostrados = filtrados;
  } else if (vistaSeleccionada === 'verificacion') {
    itemsMostrados = solicitudesVerificacion.filter(s => {
      const estado = (s.estado || '').toLowerCase();
      if (estadoSeleccionado === 'pendiente') return estado === 'pendiente' || !estado;
      if (estadoSeleccionado === 'resuelto') return ['aprobado', 'aprobada', 'resuelto', 'resuelta'].includes(estado);
      if (estadoSeleccionado === 'rechazado') return ['rechazado', 'rechazada'].includes(estado);
      return true;
    });
  } else if (vistaSeleccionada === 'oficialización') {
    itemsMostrados = solicitudesRehabilitacion.filter(s => {
      const estado = (s.estado || '').toLowerCase();
      if (estadoSeleccionado === 'pendiente') return estado === 'pendiente' || !estado;
      if (estadoSeleccionado === 'resuelto') return ['aprobado', 'aprobada', 'resuelto', 'resuelta'].includes(estado);
      if (estadoSeleccionado === 'rechazado') return ['rechazado', 'rechazada'].includes(estado);
      return true;
    });
  }

  const totalPaginas = Math.ceil(itemsMostrados.length / itemsPorPagina);
  const itemsPaginados = itemsMostrados.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

  const resetFiltros = () => {
    setVistaSeleccionada('reportes');
    setEstadoSeleccionado('pendiente');
    setCategoriaSeleccionada('Todas');
    setPaginaActual(1);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full p-2 sm:p-4">
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

        {/* Vista (Tipo de Solicitud) */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Tipo de Vista</h3>
          <div className="flex flex-col gap-2">
            {[
              { id: 'reportes', label: 'Reportes', icon: MdWarning },
              { id: 'verificacion', label: 'Verificación', icon: MdPendingActions },
              { id: 'rehabilitacion', label: 'Rehabilitación', icon: MdAssignmentTurnedIn },
            ].map(opt => (
              <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5">
                  <input
                    type="radio"
                    name="vista"
                    value={opt.id}
                    checked={vistaSeleccionada === opt.id}
                    onChange={() => setVistaSeleccionada(opt.id)}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 rounded-full border-2 border-slate-600 peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all"></div>
                  <div className="absolute w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                </div>
                <span className={`text-sm font-medium transition ${vistaSeleccionada === opt.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
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

        {/* Categoría (Amenities / Property Type) */}
        {vistaSeleccionada === 'reportes' && categoriasDisponibles.length > 1 && (
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

      {/* ---------------- CUADRÍCULA DE TARJETAS (PROPERTY LIST) ---------------- */}
      <div className="flex-1 flex flex-col">
        {/* Cabecera Lista */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Lista de Solicitudes</h1>
          <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-300">
            Total: <span className="font-bold text-white">{itemsMostrados.length}</span>
          </div>
        </div>

        {/* Loading / Empty States */}
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
            {/* Grid de Tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {itemsPaginados.map((item, idx) => {
                  // Extraer datos comunes para la tarjeta
                  const isReporte = vistaSeleccionada === 'reportes';
                  const titulo = isReporte ? item.tipo : (vistaSeleccionada === 'verificacion' ? 'Solicitud de Verificación' : 'Solicitud de Rehabilitación');
                  const desc = item.descripcion || 'Sin descripción';
                  const isResolved = ['Aprobada', 'resuelto', 'Resuelta'].includes(item.estado);
                  const isRejected = ['Rechazada', 'rechazado'].includes(item.estado);
                  
                  // Imagen (Si es reporte y tiene mediaUrls, usar la imagen de la publicacion. Sino un gradiente)
                  let coverImgUrl = null;
                  if (isReporte && item.meta?.publicacionId?.mediaUrls?.[0]) {
                    coverImgUrl = getImageUrl(item.meta.publicacionId.mediaUrls[0]);
                  }
                  
                  return (
                    <motion.div
                      key={item._id || idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ y: -5 }}
                      className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl group cursor-pointer flex flex-col"
                      onClick={() => setModalDetalles({ visible: true, item, tipo: isReporte ? 'reporte' : vistaSeleccionada })}
                    >
                      {/* Portada de Tarjeta */}
                      <div className="relative h-48 bg-slate-800 overflow-hidden shrink-0">
                        {coverImgUrl ? (
                          <img src={coverImgUrl} alt="Cover" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${
                            isReporte ? 'from-purple-900/50 to-blue-900/50' : 'from-slate-800 to-slate-700'
                          }`}>
                            <MdWarning size={64} className="text-white/10" />
                          </div>
                        )}
                        
                        {/* Status Badge */}
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

                      {/* Cuerpo de la Tarjeta */}
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{titulo}</h3>
                        
                        <div className="flex items-start gap-2 text-slate-400 text-sm mb-4">
                          <FiAlertCircle className="mt-1 shrink-0" />
                          <p className="line-clamp-2">{desc}</p>
                        </div>

                        {/* Etiquetas Inferiores (Fecha) */}
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

            {/* Paginación Siempre Visible */}
            {itemsMostrados.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-slate-800 gap-4">
                {/* Lado izquierdo: Showing Result */}
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span>Mostrando Resultados:</span>
                  <span className="px-3 py-1 bg-slate-800 rounded-full text-slate-300 font-medium border border-slate-700">
                    {(paginaActual - 1) * itemsPorPagina + 1} - {Math.min(paginaActual * itemsPorPagina, itemsMostrados.length)} de {itemsMostrados.length}
                  </span>
                </div>

                {/* Lado derecho: Controles */}
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

      {/* ---------------- MODAL DE DETALLES (Existente Adaptado) ---------------- */}
      {modalDetalles.visible && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`bg-slate-900 border border-slate-700 rounded-2xl p-0 w-full flex flex-col overflow-hidden max-h-[90vh] shadow-2xl ${
              modalDetalles.tipo === 'reporte' && modalDetalles.item?.meta?.publicacionId
                ? 'max-w-4xl md:flex-row'
                : 'max-w-lg'
            }`}
          >
            {/* Layout para Reporte con Publicación (2 columnas) */}
            {modalDetalles.tipo === 'reporte' && modalDetalles.item?.meta?.publicacionId ? (
              <>
                {/* Lado izquierdo: Publicación */}
                <div className="flex-1 min-h-0 md:max-h-full md:flex-1 p-4 md:p-6 overflow-y-auto bg-slate-950 border-b md:border-b-0 md:border-r border-slate-800 relative">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-white">Contenido Reportado</h2>
                  </div>
                  <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
                    {/* Publicación Header */}
                    <div className="p-4 flex items-center gap-3">
                      <img 
                        src={getImageUrl(modalDetalles.item.meta.publicacionId.autorId?.fotoPerfil) || `https://ui-avatars.com/api/?name=${modalDetalles.item.meta.publicacionId.autorId?.nombre || 'User'}&background=random`}
                        alt="Avatar Autor"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-white text-sm">
                          {modalDetalles.item.meta.publicacionId.autorId?.nombre} {modalDetalles.item.meta.publicacionId.autorId?.apellido}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          {modalDetalles.item.meta.redId?.fotoPerfil && (
                            <img 
                              src={getImageUrl(modalDetalles.item.meta.redId.fotoPerfil)} 
                              alt="Avatar Red" 
                              className="w-4 h-4 rounded-full object-cover"
                            />
                          )}
                          <p className="text-xs text-slate-400">
                            {modalDetalles.item.meta.redId?.nombre || 'Red Comunitaria'}
                            {modalDetalles.item.meta.publicacionId.timestamp && ` • ${new Date(modalDetalles.item.meta.publicacionId.timestamp).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contenido según tipo */}
                    {modalDetalles.item.meta.publicacionId.tipoContenido === 'texto' ? (
                      <div className="p-4 pt-0">
                        {modalDetalles.item.meta.publicacionId.titulo && (
                          <h4 className="text-xl font-bold text-white mb-2 break-words">
                            {modalDetalles.item.meta.publicacionId.titulo}
                          </h4>
                        )}
                        <p className="text-sm text-slate-300 whitespace-pre-wrap break-words">
                          {modalDetalles.item.meta.publicacionId.contenido}
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Publicación Imagen */}
                        {modalDetalles.item.meta.publicacionId.mediaUrls?.length > 0 && (
                          <div className="w-full bg-black/40">
                            <img 
                              src={getImageUrl(modalDetalles.item.meta.publicacionId.mediaUrls[0])}
                              alt="Publicación"
                              className="w-full h-auto object-contain max-h-[400px]"
                            />
                          </div>
                        )}
                        {/* Publicación Texto de Imagen */}
                        <div className="p-4">
                          <p className="text-sm text-slate-300 whitespace-pre-wrap break-words">
                            <span className="font-bold text-white mr-2">
                              {modalDetalles.item.meta.publicacionId.autorId?.username || modalDetalles.item.meta.publicacionId.autorId?.nombre}
                            </span>
                            {modalDetalles.item.meta.publicacionId.contenido}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Columna Derecha: Detalles y Acciones */}
                <div className="w-full md:w-80 flex-1 md:flex-none flex flex-col bg-slate-900 relative min-h-0 md:max-h-full">
                  <button
                    onClick={() => setModalDetalles({ visible: false, item: null, tipo: null })}
                    className="absolute top-4 right-4 p-2 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition z-10"
                  >
                    <FiX size={20} />
                  </button>
                  <div className="p-4 md:p-6 flex-1 overflow-y-auto mt-0 md:mt-4">
                    <h2 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-4">Detalles del Reporte</h2>
                    <div className="space-y-2 md:space-y-4">
                      <div className="bg-slate-800 p-3 md:p-4 rounded-xl border border-slate-700">
                        <span className="text-[10px] md:text-xs font-medium text-slate-400 block mb-1">Tipo de reporte:</span>
                        <span className="text-white text-xs md:text-sm font-bold">{modalDetalles.item?.tipo || 'N/A'}</span>
                      </div>
                      <div className="bg-slate-800 p-3 md:p-4 rounded-xl border border-slate-700">
                        <span className="text-[10px] md:text-xs font-medium text-slate-400 block mb-1">Estado:</span>
                        <span className={`text-xs md:text-sm font-bold ${
                          ['Aprobada', 'resuelto', 'Resuelta'].includes(modalDetalles.item?.estado) ? 'text-green-400' :
                          ['Rechazada', 'rechazado'].includes(modalDetalles.item?.estado) ? 'text-red-400' : 'text-yellow-400'
                        }`}>
                          {modalDetalles.item?.estado || 'Pendiente'}
                        </span>
                      </div>
                      <div className="bg-slate-800 p-3 md:p-4 rounded-xl border border-slate-700">
                        <span className="text-[10px] md:text-xs font-medium text-slate-400 block mb-1 md:mb-2">Descripción del denunciante:</span>
                        <p className="text-white text-xs md:text-sm leading-relaxed">{modalDetalles.item?.descripcion || 'Sin descripción'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-6 border-t border-slate-800 bg-slate-900/80 shrink-0">
                    <div className="flex flex-col gap-3">
                      {modalDetalles.tipo === 'reporte' && (!modalDetalles.item?.estado || modalDetalles.item?.estado === 'pendiente') && (
                        <>
                          <p className="text-[10px] md:text-xs text-slate-400 text-center leading-tight mb-2">
                            Se eliminará el contenido y se otorgará un strike.
                          </p>
                          <div className="flex flex-row md:flex-col gap-2 md:gap-3">
                            <button
                              onClick={() => handleResolverReporte(modalDetalles.item._id, 'resuelto')}
                              disabled={resolviendo}
                              className="flex-1 w-full flex items-center justify-center gap-1 md:gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-2 md:py-3 rounded-xl transition shadow-lg shadow-green-900/20 text-xs md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <MdCheckCircle className="w-4 h-4 md:w-5 md:h-5" /> Aceptar
                            </button>
                            <button
                              onClick={() => handleResolverReporte(modalDetalles.item._id, 'rechazado')}
                              disabled={resolviendo}
                              className="flex-1 w-full flex items-center justify-center gap-1 md:gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-2 md:py-3 rounded-xl transition shadow-lg shadow-red-900/20 text-xs md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
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
              // Layout Original para Solicitudes u otros tipos (1 columna)
              <>
                <div className="p-6 border-b border-slate-800 relative">
                  <button
                    onClick={() => setModalDetalles({ visible: false, item: null, tipo: null })}
                    className="absolute top-6 right-6 p-2 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition"
                  >
                    <FiX size={20} />
                  </button>
                  <h2 className="text-2xl font-bold text-white mb-6">Detalles de Solicitud</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
                      <span className="text-sm font-medium text-slate-400">Tipo:</span>
                      <span className="text-white text-sm font-bold">{modalDetalles.item?.tipo || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
                      <span className="text-sm font-medium text-slate-400">Estado:</span>
                      <span className={`text-sm font-bold ${
                        ['Aprobada', 'resuelto', 'Resuelta'].includes(modalDetalles.item?.estado) ? 'text-green-400' :
                        ['Rechazada', 'rechazado'].includes(modalDetalles.item?.estado) ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {modalDetalles.item?.estado || 'Pendiente'}
                      </span>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                      <span className="text-sm font-medium text-slate-400 block mb-2">Descripción:</span>
                      <p className="text-white text-sm leading-relaxed">{modalDetalles.item?.descripcion || 'Sin descripción'}</p>
                    </div>
                    {modalDetalles.tipo === 'reporte' && modalDetalles.item?.subtype === 'publicacion' && !modalDetalles.item?.meta?.publicacionId && (
                      <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-4">
                        <p className="text-yellow-200 text-sm flex items-center gap-2">
                          <MdWarning size={20} /> La publicación original ya no existe o fue eliminada.
                        </p>
                      </div>
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

export default ReportesSolicitudesAR;
