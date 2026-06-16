import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  const salir = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden p-4 font-sans">
      {/* Background abstract gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/[0.08] rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden text-center">
          {/* Subtle top border shine */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />
          
          <div className="mb-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
              className="inline-flex justify-center items-center bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] rounded-[2.5rem] shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] ring-1 ring-white/10 p-4"
            >
              <img
                src="/images/notFound.png"
                alt="Página no encontrada"
                className="w-48 h-64 object-cover drop-shadow-lg [mask-image:radial-gradient(circle,white_70%,transparent_100%)]"
              />
            </motion.div>
          </div>

          <div className="relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-red-600 mb-2 tracking-tighter"
            >
              404
            </motion.h1>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight"
            >
              ¡Vaya! No encontramos esta página
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white/60 mb-10 text-[15px] leading-relaxed"
            >
              Puede que el enlace esté roto o que la página haya sido movida.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button
                onClick={salir}
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-full text-white font-medium transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform relative z-10" />
                <span className="relative z-10 tracking-wide">Regresar</span>
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};