import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiAlertTriangle, FiCheckCircle, FiLoader, FiSend } from "react-icons/fi";
import { motion } from "framer-motion";
import adminRedService from "../../services/adminRedService";

const descripcionInicial = "Solicito que se revoque mi rol de Admin de Red";

const RevocarRolAR = () => {
  const [red, setRed] = useState(null);
  const [descripcion, setDescripcion] = useState(descripcionInicial);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const fetchRed = async () => {
      try {
        const data = await adminRedService.getInfoRed();
        setRed(data.red || data);
      } catch (error) {
        console.error("Error al obtener la red:", error);
        toast.error(error.response?.data?.msg || "Error al cargar la información de la red");
      } finally {
        setLoading(false);
      }
    };

    fetchRed();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!red?._id) {
      toast.error("No se pudo identificar la red comunitaria actual");
      return;
    }

    const descripcionLimpia = descripcion.trim();
    if (!descripcionLimpia) {
      toast.error("Ingresa una descripción para la solicitud");
      return;
    }

    setEnviando(true);
    try {
      await adminRedService.solicitarRevocacionAdmin({
        redId: red._id,
        descripcion: descripcionLimpia,
      });
      toast.success("Solicitud de revocación enviada al superadministrador");
      setDescripcion(descripcionInicial);
    } catch (error) {
      console.error("Error al solicitar revocación:", error);
      toast.error(error.response?.data?.msg || "Error al enviar la solicitud de revocación");
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-400">
        <FiLoader className="mr-2 animate-spin" /> Cargando información de la red...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Revocar mi rol</h1>
        <p className="text-slate-400">
          Envía una solicitud al superadministrador para dejar de ser administrador de tu red comunitaria.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-start gap-4 rounded-xl border border-yellow-800/50 bg-yellow-950/30 p-4 mb-6">
            <FiAlertTriangle className="text-yellow-400 shrink-0 mt-1" size={24} />
            <div>
              <h2 className="text-white font-bold mb-1">Solicitud de cambio de rol</h2>
              <p className="text-sm text-yellow-100/80 leading-relaxed">
                Al enviar esta solicitud, el superadministrador revisará tu caso. Si se aprueba, tu rol cambiará de
                Admin de Red a Estudiante y perderás acceso a las herramientas administrativas de esta red.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-slate-300 text-sm font-semibold block mb-2">Red comunitaria</label>
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3">
                <p className="text-white font-semibold">{red?.nombre || "Red no disponible"}</p>
                <p className="text-xs text-slate-500 mt-1">ID: {red?._id || "No disponible"}</p>
              </div>
            </div>

            <div>
              <label htmlFor="descripcion" className="text-slate-300 text-sm font-semibold block mb-2">
                Descripción de la solicitud
              </label>
              <textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows="6"
                maxLength={500}
                required
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition resize-none placeholder:text-slate-500"
                placeholder="Describe por qué solicitas la revocación de tu rol de Admin de Red"
              />
              <p className="text-xs text-slate-500 mt-2">{descripcion.length}/500 caracteres</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end border-t border-slate-800 pt-5">
              <button
                type="button"
                onClick={() => setDescripcion(descripcionInicial)}
                disabled={enviando}
                className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition disabled:opacity-50"
              >
                Restaurar descripción
              </button>
              <button
                type="submit"
                disabled={enviando || !red?._id}
                className="px-5 py-2.5 text-sm font-medium bg-red-600 hover:bg-red-500 text-white rounded-lg transition flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enviando ? <><FiLoader className="animate-spin" /> Enviando...</> : <><FiSend /> Enviar solicitud</>}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl h-fit">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FiCheckCircle className="text-emerald-400" /> Antes de enviar
          </h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex gap-2"><span className="text-emerald-400">•</span> Verifica que la red mostrada sea la correcta.</li>
            <li className="flex gap-2"><span className="text-emerald-400">•</span> Explica claramente el motivo de tu solicitud.</li>
            <li className="flex gap-2"><span className="text-emerald-400">•</span> La aprobación final depende del superadministrador.</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default RevocarRolAR;
