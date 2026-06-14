import { useState } from 'react'
import { Link } from 'react-router-dom'
import { crearApelacion } from '../services/apelacionService'

const ApelarPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    motivo: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setIsLoading(true)
    
    try {
      await crearApelacion(formData)
      setSuccess(true)
    } catch (error) {
      if (error.response?.status === 409) {
        setErrorMsg('Ya tienes una apelación pendiente de revisión.')
      } else {
        setErrorMsg(error.response?.data?.msg || 'Hubo un error al enviar tu apelación.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <div className="flex flex-col md:flex-row w-full max-w-[1400px] mx-auto bg-slate-900 md:my-12 md:rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
        
        {/* Lado Izquierdo: Branding y Título (40%) */}
        <div className="w-full md:w-[40%] bg-slate-950 p-8 md:p-12 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-slate-800">
          <img src="/images/logo_actual.png" alt="PoliRED" className="w-24 h-24 rounded-full mb-6 shadow-lg border-2 border-slate-800" />
          <h2 className="text-3xl font-bold text-white mb-4">Solicitud de Apelación</h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            Has llegado aquí porque tu cuenta ha sido suspendida temporalmente. Explica tu caso de manera detallada y lo revisaremos a la brevedad posible.
          </p>
        </div>

        {/* Lado Derecho: Formulario (60%) */}
        <div className="w-full md:w-[60%] p-8 md:p-12 flex items-center bg-slate-900">
          <div className="w-full max-w-lg mx-auto">
            {success ? (
              <div className="text-center animate-fade-in bg-slate-800 p-8 rounded-xl border border-slate-700">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 mb-6">
                  <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">¡Solicitud Enviada!</h3>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Tu apelación fue enviada correctamente. Recibirás una respuesta a tu correo electrónico una vez que nuestro equipo administrativo la haya revisado.
                </p>
                <Link to="/" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-900/20 transition-colors">
                  Volver a la página principal
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 animate-fade-in">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label htmlFor="nombre" className="block text-sm font-semibold text-slate-300 mb-2">Nombre completo</label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>

                <div>
                  <label htmlFor="correo" className="block text-sm font-semibold text-slate-300 mb-2">Correo electrónico</label>
                  <input
                    id="correo"
                    name="correo"
                    type="email"
                    required
                    value={formData.correo}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="El correo de tu cuenta suspendida"
                  />
                  <p className="mt-2 text-xs text-slate-500">Usaremos este correo para identificar tu cuenta y enviarte la respuesta.</p>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label htmlFor="motivo" className="block text-sm font-semibold text-slate-300">Motivo de apelación</label>
                    <span className="text-xs text-slate-500 font-medium">{formData.motivo.length}/1000</span>
                  </div>
                  <textarea
                    id="motivo"
                    name="motivo"
                    rows="5"
                    maxLength="1000"
                    required
                    value={formData.motivo}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                    placeholder="Explica detalladamente por qué consideras que tu cuenta debe ser reactivada..."
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-3.5 px-4 rounded-lg shadow-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-blue-900/40 hover:-translate-y-0.5'}`}
                  >
                    {isLoading ? 'Enviando solicitud...' : 'Enviar apelación'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApelarPage
