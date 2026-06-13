import { useEffect, useState } from 'react'
import { AlertTriangle, X, Trash2, Shield } from 'lucide-react'
import { getStrikesUsuario, eliminarStrikeUsuario, getStrikesRed, eliminarStrikeRed } from '../../services/superadminService'

// entidadTipo: 'usuario' | 'red'
// entidadId: string (ObjectId)
// onClose: función para cerrar el modal
export default function StrikesModal({ entidadTipo, entidadId, entidadNombre, onClose }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const MAX_STRIKES = 5
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = entidadTipo === 'usuario'
          ? await getStrikesUsuario(entidadId)
          : await getStrikesRed(entidadId)
        setData(res.data)
      } catch {
        setError('No se pudieron cargar los strikes.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [entidadId, entidadTipo, refreshTrigger])

  const handleEliminar = async (strikeId) => {
    try {
      entidadTipo === 'usuario'
        ? await eliminarStrikeUsuario(entidadId, strikeId)
        : await eliminarStrikeRed(entidadId, strikeId)
      setRefreshTrigger(prev => prev + 1) // refrescar
    } catch {
      alert('Error al eliminar el strike.')
    }
  }

  const strikes = data?.strikes ?? []
  const porcentaje = (strikes.length / MAX_STRIKES) * 100
  const colorBarra = strikes.length <= 2 ? 'bg-yellow-400'
    : strikes.length <= 3 ? 'bg-orange-500'
    : 'bg-red-600'
  const suspendido = data?.suspendido || data?.deshabilitada

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg mx-4 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-yellow-400" size={20} />
            <h2 className="text-white font-bold text-lg">
              Strikes — {entidadNombre}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {loading && <p className="text-gray-400 text-sm text-center py-8">Cargando...</p>}
        {error && <p className="text-red-400 text-sm text-center py-8">{error}</p>}

        {!loading && !error && data && (
          <>
            {/* Estado */}
            {suspendido && (
              <div className="flex items-center gap-2 bg-red-900/30 border border-red-700 rounded-lg px-4 py-2 mb-4">
                <Shield size={16} className="text-red-400" />
                <span className="text-red-300 text-sm font-medium">
                  {entidadTipo === 'usuario' ? 'Cuenta suspendida' : 'Red deshabilitada'}
                </span>
              </div>
            )}

            {/* Barra de progreso */}
            <div className="mb-5">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Infracciones acumuladas</span>
                <span className={`font-bold ${strikes.length >= 5 ? 'text-red-400' : 'text-white'}`}>
                  {strikes.length} / {MAX_STRIKES}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${colorBarra}`}
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
            </div>

            {/* Lista de strikes */}
            {strikes.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-6">Sin infracciones registradas.</p>
            ) : (
              <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {strikes.map((strike, i) => (
                  <li key={strike._id} className="bg-gray-800 rounded-xl px-4 py-3 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-500">#{i + 1}</span>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">
                          {strike.tipoReporte ?? 'red'}
                        </span>
                      </div>
                      <p className="text-white text-sm leading-snug truncate">{strike.motivo}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(strike.fecha).toLocaleDateString('es-EC', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEliminar(strike._id)}
                      className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0 mt-1"
                      title="Eliminar strike"
                    >
                      <Trash2 size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  )
}
