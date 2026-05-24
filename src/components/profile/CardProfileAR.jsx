import { useEffect, useState } from "react";
import { motion } from 'framer-motion';

const CardProfileAR = () => {
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    const fetchPerfil = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/perfil/admin-red`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) throw new Error("Error al obtener el perfil");
        const data = await response.json();
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 space-y-6 h-fit"
    >
      {/* Avatar Section */}
      <div className="flex flex-col items-center space-y-4">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png"
          alt="perfil"
          className="w-32 h-32 rounded-full border-2 border-blue-500 object-cover shadow-lg"
        />
      </div>

      {/* Información */}
      <div className="space-y-3 border-t border-slate-700 pt-6">
        <div className="flex justify-between items-start">
          <span className="text-slate-400 text-sm">Nombre</span>
          <span className="text-white font-medium text-right">{perfil.nombre}</span>
        </div>
        <div className="flex justify-between items-start">
          <span className="text-slate-400 text-sm">Apellido</span>
          <span className="text-white font-medium text-right">{perfil.apellido}</span>
        </div>
        <div className="flex justify-between items-start">
          <span className="text-slate-400 text-sm">Teléfono</span>
          <span className="text-white font-medium text-right">{perfil.celular || '—'}</span>
        </div>
        <div className="flex justify-between items-start">
          <span className="text-slate-400 text-sm">Email</span>
          <span className="text-white font-medium text-right text-sm break-all">{perfil.email}</span>
        </div>
        <div className="flex justify-between items-start border-t border-slate-700 pt-3 mt-3">
          <span className="text-slate-400 text-sm">Rol</span>
          <span className="inline-block px-3 py-1 bg-blue-600/30 text-blue-300 rounded-full text-xs font-medium">
            {perfil.rol}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default CardProfileAR;