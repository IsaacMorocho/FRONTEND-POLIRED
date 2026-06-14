import { useState, useEffect } from 'react';
import superadminService from '../../services/superadminService';
import { toast } from 'react-toastify';
import { MdCheck, MdClose } from 'react-icons/md';

const Apelaciones_Panel_Admin = () => {
  const [apelaciones, setApelaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedApelacion, setSelectedApelacion] = useState(null);
  const [notaResolucion, setNotaResolucion] = useState('');
  const [resolviendo, setResolviendo] = useState(false);

  const fetchApelaciones = async () => {
    try {
      setLoading(true);
      const data = await superadminService.getApelaciones();
      setApelaciones(data);
    } catch (error) {
      toast.error('Error al cargar apelaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApelaciones();
  }, []);

  const openModal = (apelacion) => {
    setSelectedApelacion(apelacion);
    setNotaResolucion('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApelacion(null);
    setNotaResolucion('');
  };

  const handleResolver = async (estado) => {
    if (!notaResolucion.trim()) {
      toast.error('Debe proveer una nota de resolución');
      return;
    }
    
    setResolviendo(true);
    try {
      await superadminService.resolverApelacion(selectedApelacion._id, {
        estado,
        notaResolucion
      });
      toast.success(`Apelación ${estado} exitosamente`);
      fetchApelaciones();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Error al resolver apelación');
    } finally {
      setResolviendo(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-white">Cargando apelaciones...</div>;
  }

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Gestión de Apelaciones</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800/50 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">Fecha</th>
              <th className="px-4 py-3">Estudiante</th>
              <th className="px-4 py-3">Motivo</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 rounded-tr-lg text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {apelaciones.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                  No hay apelaciones registradas.
                </td>
              </tr>
            ) : (
              apelaciones.map((ap) => (
                <tr key={ap._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    {new Date(ap.fechaCreacion).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-medium text-white">{ap.nombre}</div>
                    <div className="text-xs text-slate-400">{ap.correo}</div>
                  </td>
                  <td className="px-4 py-4 max-w-xs truncate" title={ap.motivo}>
                    {ap.motivo}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      ap.estado === 'pendiente' ? 'bg-yellow-500/20 text-yellow-400' :
                      ap.estado === 'aprobada' ? 'bg-green-500/20 text-green-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {ap.estado.charAt(0).toUpperCase() + ap.estado.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {ap.estado === 'pendiente' ? (
                      <button
                        onClick={() => openModal(ap)}
                        className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                      >
                        Resolver
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500">Resuelta</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && selectedApelacion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-700 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">Resolver Apelación</h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-800">
                  <MdClose size={24} />
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Estudiante</label>
                  <p className="text-slate-200">{selectedApelacion.nombre} ({selectedApelacion.correo})</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Motivo de la apelación</label>
                  <div className="bg-slate-800 p-3 rounded-lg text-sm text-slate-300 break-words whitespace-pre-wrap break-all">
                    {selectedApelacion.motivo}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nota de Resolución (se enviará por correo)</label>
                <textarea
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                  rows="4"
                  value={notaResolucion}
                  onChange={(e) => setNotaResolucion(e.target.value)}
                  placeholder="Escribe aquí el motivo de la decisión..."
                ></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900 flex justify-end gap-4 shrink-0">
              <button
                onClick={() => handleResolver('rechazada')}
                disabled={resolviendo}
                className="flex items-center gap-2 px-6 py-3 text-base font-bold bg-red-600 text-white hover:bg-red-500 rounded-lg shadow-lg shadow-red-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdClose size={20} /> Rechazar
              </button>
              <button
                onClick={() => handleResolver('aprobada')}
                disabled={resolviendo}
                className="flex items-center gap-2 px-6 py-3 text-base font-bold bg-green-600 text-white hover:bg-green-500 rounded-lg shadow-lg shadow-green-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdCheck size={20} /> Aprobar (Reactivar)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Apelaciones_Panel_Admin;
