import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiAlertCircle, FiCalendar, FiChevronLeft, FiChevronRight, FiX, FiShield, FiStar, FiUserMinus } from "react-icons/fi";
import { MdFilterList, MdAssignmentTurnedIn, MdCheckCircle, MdCancel } from "react-icons/md";
import { motion, AnimatePresence } from 'framer-motion';
import superadminService from "../../services/superadminService";

const SolicitudesRedesPanelAdmin = () => {
  const [activeTab, setActiveTab] = useState('verificacion'); // 'verificacion', 'oficializacion', 'revocacion'
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationMeta, setPaginationMeta] = useState(null);

  // Filtros de la barra lateral
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('pendiente'); // 'pendiente', 'resuelto', 'rechazado'

  const [modalDetalles, setModalDetalles] = useState({ visible: false, item: null });

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 6;
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [resolverLoading, setResolverLoading] = useState(false);

  const mapEstadoQuery = (estado) => {
    if (estado === 'resuelto') return 'aprobada';
    if (estado === 'rechazado') return 'rechazada';
    return estado;
  };

  const getSolicitudRedId = (item) => {
    const redCandidate = item?.redId || item?.red || item?.redComunitaria || item?.meta?.redId || item?.meta?.red || item?.meta?.redComunitaria;
    if (typeof redCandidate === 'object' && redCandidate !== null) return redCandidate._id || redCandidate.id;
    return redCandidate || item?.red || item?.meta?.redId;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        setPaginationMeta(null);
        if (activeTab === 'verificacion') {
          const data = await superadminService.getSolicitudes('verificacion');
          setDataList(data.solicitudes || []);
        } else if (activeTab === 'oficializacion') {
          const data = await superadminService.getSolicitudes('oficializacion');
          setDataList(data.solicitudes || []);
        } else if (activeTab === 'revocacion') {
          const data = await superadminService.getSolicitudesRevocacionAdminRed({
            estado: mapEstadoQuery(estadoSeleccionado),
            page: paginaActual,
            limit: itemsPorPagina,
          });
          setDataList(data.solicitudes || data.solicitudesRevocacion || data.docs || data.data || []);
          setPaginationMeta(data.pagination || data.meta || {
            total: data.totalDocs || data.total || data.totalSolicitudes,
            totalPages: data.totalPages || data.pages,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    if (activeTab !== 'revocacion') {
      setPaginationMeta(null);
    }
  }, [activeTab, refreshTrigger, estadoSeleccionado, paginaActual]);

  useEffect(() => {
    setEstadoSeleccionado('pendiente');
    setPaginaActual(1);
  }, [activeTab]);

  // Reset page when filters change
  useEffect(() => {
    setPaginaActual(1);
  }, [estadoSeleccionado]);

  // Acciones
  const handleResolverSolicitud = async (id, accion, subtype) => {
    setResolverLoading(true);
    try {
      if (subtype === 'verificacion') {
        await superadminService.resolverSolicitudVerificacion(id, { estado: accion });
      } else if (subtype === 'oficializacion') {
        await superadminService.resolverSolicitudOficializacion(id, { estado: accion });
      }
      toast.success(`Solicitud de red procesada`);
      setModalDetalles({ visible: false, item: null });
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error al procesar la solicitud");
      console.error(error);
    } finally {
      setResolverLoading(false);
    }
  };

  const handleResolverRevocacion = async (item, accion) => {
    setResolverLoading(true);
    try {
      if (!item._id) {
        toast.error("No se pudo identificar la solicitud");
        return;
      }
      await superadminService.resolverSolicitudRevocarAdminRed(item._id, {
        accion,
        respuesta: accion === 'Aprobar' ? 'Te he revocado el rol' : 'No se aprobó la revocación del rol',
      });
      toast.success(`Solicitud de revocación ${accion === 'Aprobar' ? 'aprobada' : 'rechazada'}`);
      setModalDetalles({ visible: false, item: null });
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error al resolver el reporte");
      console.error(error);
    } finally {
      setResolverLoading(false);
    }
  };

  // Lógica de filtrado
  let itemsMostrados = [];

  // Normalizar estados para filtrado
  let filtrados = activeTab === 'revocacion' ? dataList : dataList.filter(r => {
    const estado = (r.estado || '').toLowerCase();
    if (estadoSeleccionado === 'pendiente') return estado === 'pendiente';
    if (estadoSeleccionado === 'resuelto') return ['aprobado', 'aprobada', 'resuelto', 'resuelta'].includes(estado);
    if (estadoSeleccionado === 'rechazado') return ['rechazado', 'rechazada'].includes(estado);
    return true;
  });

  itemsMostrados = filtrados;

  const totalBackend = paginationMeta?.total || paginationMeta?.totalDocs || paginationMeta?.totalSolicitudes;
  const totalPaginas = activeTab === 'revocacion'
    ? (paginationMeta?.totalPages || paginationMeta?.pages || Math.ceil((totalBackend || itemsMostrados.length) / itemsPorPagina) || 1)
    : Math.ceil(itemsMostrados.length / itemsPorPagina);
  const itemsPaginados = activeTab === 'revocacion'
    ? itemsMostrados
    : itemsMostrados.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

  const resetFiltros = () => {
    setEstadoSeleccionado('pendiente');
    setPaginaActual(1);
  };

  const getTabTitle = () => {
    if (activeTab === 'verificacion') return 'Solicitudes de Verificación';
    if (activeTab === 'oficializacion') return 'Solicitudes de Oficialización';
    if (activeTab === 'revocacion') return 'Solicitudes de Revocación de Rol';
    return '';
  };

  return (
    <div className="flex flex-col h-full gap-6 p-2 sm:p-4 w-full">
      {/* Tabs Menu */}
      <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1 w-full lg:w-fit self-center lg:self-start shadow-xl flex-wrap">
        <button
          onClick={() => setActiveTab('verificacion')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'verificacion' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          <FiShield size={18} /> Verificación
        </button>
        <button
          onClick={() => setActiveTab('oficializacion')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'oficializacion' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          <FiStar size={18} /> Oficialización
        </button>
        <button
          onClick={() => setActiveTab('revocacion')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'revocacion' ? 'bg-red-600 text-white shadow-lg shadow-red-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          <FiUserMinus size={18} /> Solicitudes de Revocación de Rol
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
        </motion.div>

        {/* ---------------- CUADRÍCULA DE TARJETAS ---------------- */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{getTabTitle()}</h1>
            <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-300 shrink-0">
              Total: <span className="font-bold text-white">{totalBackend || itemsMostrados.length}</span>
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
                    let titulo = 'Solicitud de Red';
                    if (activeTab === 'verificacion') titulo = 'Solicitar Verificación';
                    if (activeTab === 'oficializacion') titulo = 'Solicitar Oficialización';
                    if (activeTab === 'revocacion') titulo = 'Solicitud de Revocación de Rol';

                    const desc = item.descripcion || (item.meta?.justificacion || 'Sin descripción');
                    const estadoItem = (item.estado || '').toLowerCase();
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
                          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${activeTab === 'verificacion' ? 'from-blue-900/50 to-cyan-900/50' :
                            activeTab === 'oficializacion' ? 'from-purple-900/50 to-pink-900/50' :
                              'from-red-900/50 to-rose-900/50'
                            }`}>
                            {activeTab === 'verificacion' && <FiShield size={64} className="text-white/10" />}
                            {activeTab === 'oficializacion' && <FiStar size={64} className="text-white/10" />}
                            {activeTab === 'revocacion' && <FiUserMinus size={64} className="text-white/10" />}
                          </div>

                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${isResolved ? 'bg-green-600 text-white' :
                              isRejected ? 'bg-red-600 text-white' :
                                'bg-yellow-600 text-white'
                              }`}>
                              {item.estado ? item.estado.toUpperCase() : 'PENDIENTE'}
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
                      {(paginaActual - 1) * itemsPorPagina + 1} - {Math.min(paginaActual * itemsPorPagina, totalBackend || itemsMostrados.length)} de {totalBackend || itemsMostrados.length}
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
                          className={`w-10 h-10 flex items-center justify-center rounded-xl text-base font-medium transition ${paginaActual === pageNum
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
            className="bg-slate-900 border border-slate-700 rounded-2xl p-0 w-full max-w-lg flex flex-col overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
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
                <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <span className="text-sm font-medium text-slate-400">Estado:</span>
                  <span className={`text-sm font-bold ${['aprobada', 'resuelto', 'resuelta'].includes((modalDetalles.item?.estado || '').toLowerCase()) ? 'text-green-400' :
                    ['rechazada', 'rechazado'].includes((modalDetalles.item?.estado || '').toLowerCase()) ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                    {modalDetalles.item?.estado || 'Pendiente'}
                  </span>
                </div>

                {/* Detalles extra según tab */}
                {activeTab === 'verificacion' && (
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col gap-3">
                    <div>
                      <span className="text-xs font-medium text-slate-400">Red a verificar:</span>
                      <p className="text-white text-sm break-words">{modalDetalles.item?.meta?.nombreRed}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-400">Correo Institucional:</span>
                      <p className="text-white text-sm break-words">{modalDetalles.item?.meta?.correoInstitucional}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-400">Cantidad Miembros:</span>
                      <p className="text-white text-sm">{modalDetalles.item?.meta?.cantidadMiembros}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'oficializacion' && (
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col gap-3">
                    <div>
                      <span className="text-xs font-medium text-slate-400">Red a oficializar:</span>
                      <p className="text-white text-sm break-words">{modalDetalles.item?.meta?.nombreRed}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-400">Cargo:</span>
                      <p className="text-white text-sm break-words">{modalDetalles.item?.meta?.cargo}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-400">Dependencia:</span>
                      <p className="text-white text-sm break-words">{modalDetalles.item?.meta?.dependencia}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-400">Justificación:</span>
                      <p className="text-white text-sm break-words">{modalDetalles.item?.meta?.justificacion}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'revocacion' && (
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col gap-3">
                    <div>
                      <span className="text-xs font-medium text-slate-400">Red asociada:</span>
                      <p className="text-white text-sm break-words">{modalDetalles.item?.redId?.nombre || modalDetalles.item?.red?.nombre || modalDetalles.item?.meta?.redId?.nombre || modalDetalles.item?.meta?.nombreRed || getSolicitudRedId(modalDetalles.item) || 'No disponible'}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-400">Solicitante:</span>
                      <p className="text-white text-sm break-words">
                        {modalDetalles.item?.solicitante?.nombre || modalDetalles.item?.adminRed?.nombre || modalDetalles.item?.usuario?.nombre || 'No disponible'} {modalDetalles.item?.solicitante?.apellido || modalDetalles.item?.adminRed?.apellido || modalDetalles.item?.usuario?.apellido || ''}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-400">Descripción:</span>
                      <p className="text-white text-sm break-words">{modalDetalles.item?.descripcion || modalDetalles.item?.meta?.descripcion || 'Sin descripción'}</p>
                    </div>
                  </div>
                )}


              </div>
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900/80">
              <div className="flex flex-col gap-3">
                {(!modalDetalles.item?.estado || (modalDetalles.item.estado).toLowerCase() === 'pendiente') && (
                  <>
                    <button
                      disabled={resolverLoading}
                      onClick={() => {
                        if (activeTab === 'revocacion') handleResolverRevocacion(modalDetalles.item, 'Aprobar');
                        else {
                          const actionMap = {
                            'verificacion': 'Aprobada',
                            'oficializacion': 'Aprobada'
                          };
                          handleResolverSolicitud(modalDetalles.item._id, actionMap[activeTab], activeTab);
                        }
                      }}
                      className="w-full flex flex-col items-center justify-center gap-0.5 bg-green-600 hover:bg-green-500 text-white py-2 rounded-xl transition shadow-lg shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center gap-2 font-bold">
                        <MdCheckCircle size={20} /> Aprobar Solicitud
                      </div>
                      {activeTab === 'revocacion' && (
                        <span className="text-[10px] font-normal text-green-200 text-center leading-tight">Se revocará el rol de Admin de Red al solicitante</span>
                      )}
                    </button>
                    <button
                      disabled={resolverLoading}
                      onClick={() => {
                        if (activeTab === 'revocacion') handleResolverRevocacion(modalDetalles.item, 'Rechazar');
                        else {
                          const actionMap = {
                            'verificacion': 'Rechazada',
                            'oficializacion': 'Rechazada'
                          };
                          handleResolverSolicitud(modalDetalles.item._id, actionMap[activeTab], activeTab);
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MdCancel size={20} /> Rechazar
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default SolicitudesRedesPanelAdmin;
