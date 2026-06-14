import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import authService from '../services/authService';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export const ConfirmarCuenta = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'

  const confirmar = async () => {
    setStatus('loading');
    try {
      await authService.confirmarCuenta(token);
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
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
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/[0.08] rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle top border shine */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />
          
          {/* Logo container */}
          <div className="text-center mb-12 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
              className="inline-flex justify-center items-center p-6 bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] rounded-3xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
            >
              <img 
                src="/images/logo_actual.png" 
                alt="PoliRed Logo" 
                className="w-32 h-auto object-contain drop-shadow-lg" 
              />
            </motion.div>
          </div>

          <div className="relative z-10 min-h-[220px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {status === 'idle' ? (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center text-center space-y-6"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                    <CheckCircle className="w-14 h-14 text-blue-400 relative z-10" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Verificación requerida</h2>
                    <p className="text-blue-100/50 font-medium mb-6 max-w-[280px]">Haz clic en el botón para confirmar y activar tu cuenta.</p>
                  </div>
                  <button 
                    onClick={confirmar}
                    className="mt-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] active:scale-95"
                  >
                    Activar mi cuenta
                  </button>
                </motion.div>
              ) : status === 'loading' ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center text-center space-y-6"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                    <Loader2 className="w-14 h-14 text-blue-400 animate-spin relative z-10" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Activando cuenta</h2>
                    <p className="text-blue-100/50 font-medium">Por favor, espera un momento...</p>
                  </div>
                </motion.div>
              ) : status === 'error' ? (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center text-center"
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-red-400 mb-4 tracking-tight">Error de activación</h2>
                  <p className="text-red-100/60 mb-10 text-[15px] leading-relaxed max-w-[280px]">
                    El enlace no es válido o tu cuenta ya fue activada anteriormente.
                  </p>
                  
                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
                  <p className="text-white/30 text-xs tracking-[0.2em] uppercase font-bold">
                    Vuelve a la aplicación
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center text-center"
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-emerald-400 mb-4 tracking-tight">¡Cuenta activada!</h2>
                  <p className="text-emerald-100/60 mb-10 text-[15px] leading-relaxed max-w-[280px]">
                    Tu cuenta ha sido confirmada exitosamente. Ya puedes iniciar sesión.
                  </p>
                  
                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
                  <p className="text-white/30 text-xs tracking-[0.2em] uppercase font-bold">
                    Vuelve a la aplicación
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
