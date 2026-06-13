import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import adminRedService from '../../services/adminRedService';
import { FiMail, FiPhone, FiMapPin, FiLink } from 'react-icons/fi';

const CardProfileAR = () => {
  const [perfil, setPerfil] = useState(null);
  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  const getImageUrl = (path) => {
    if (!path || path === 'null' || path === 'undefined') return null;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const cleanPath = path.replace(/\\/g, '/');
    const base = API_BASE?.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
    return `${base}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
  };

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const data = await adminRedService.getPerfil();
        setPerfil(data);
      } catch (error) {
        console.error("Perfil error:", error);
      }
    };

    fetchPerfil();
  }, []);

  if (!perfil) {
    return (
      <div className="text-center text-slate-400 mt-10">
        Cargando...
      </div>
    );
  }

  // Contadores seguros
  const countPublicaciones = perfil.publicaciones ? (Array.isArray(perfil.publicaciones) ? perfil.publicaciones.length : perfil.publicaciones) : 0;
  // Redes puede venir como array o un objeto único
  const countRedes = perfil.redes ? (Array.isArray(perfil.redes) ? perfil.redes.length : 1) : (perfil.redAsignada ? 1 : 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit w-full"
    >
      {/* Cabecera del Perfil (Avatar + Info) */}
      <div className="flex flex-col items-center text-center space-y-4 mb-6">
        <img
          src={getImageUrl(perfil.fotoPerfil) || `https://ui-avatars.com/api/?name=${perfil.nombre}+${perfil.apellido}&background=2563eb&color=fff&size=200`}
          alt="perfil"
          className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-slate-800"
        />
        <div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 className="text-3xl font-bold text-white">
              {perfil.nombre} {perfil.apellido}
            </h2>
          </div>
          <p className="text-slate-400 text-base font-medium capitalize">
            {perfil.roles && perfil.roles.length > 0 ? perfil.roles[0].replace('_', ' ') : (perfil.rol ? perfil.rol.replace('_', ' ') : 'Administrador')}
          </p>
        </div>
      </div>

      {/* Caja de Estadísticas */}
      <div className="grid grid-cols-2 bg-slate-800/50 border border-slate-700 rounded-xl divide-x divide-slate-700 mb-6">
        <div className="flex flex-col items-center justify-center p-4">
          <span className="text-3xl font-bold text-white">{countPublicaciones}</span>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">Post</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4">
          <span className="text-3xl font-bold text-white">{countRedes}</span>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">Redes</span>
        </div>
      </div>

      {/* Información de Contacto */}
      <div className="space-y-4 px-2">
        <div className="flex items-center gap-4 text-slate-300">
          <FiMail className="text-slate-500 shrink-0" size={20} />
          <span className="text-base font-medium truncate">{perfil.email}</span>
        </div>
        
        {perfil.celular && (
          <div className="flex items-center gap-4 text-slate-300">
            <FiPhone className="text-slate-500 shrink-0" size={20} />
            <span className="text-base font-medium">{perfil.celular}</span>
          </div>
        )}
        
        <div className="flex items-center gap-4 text-slate-300">
          <FiMapPin className="text-slate-500 shrink-0" size={20} />
          <span className="text-base font-medium truncate">PoliRed Campus</span>
        </div>
        
        {perfil.username && (
          <div className="flex items-center gap-4 text-slate-300">
            <FiLink className="text-slate-500 shrink-0" size={20} />
            <span className="text-base font-medium hover:text-blue-400 transition truncate">@{perfil.username}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CardProfileAR;