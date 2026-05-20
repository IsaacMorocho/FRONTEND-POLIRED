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
      <div className="text-center text-black mt-10">
        Cargando perfil...
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-full w-full mx-auto bg-slate-300 shadow-lg rounded-lg p-4 md:p-6 space-y-6 md:space-y-8"
    >
      <div className="flex flex-col items-center space-y-2">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png"
          alt="img-client"
          className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-black object-cover"
        />
      </div>

      {/* Información */}
      <div className="space-y-2 text-xs md:text-sm">
        <div className="flex">
          <b className="w-20 md:w-24">Nombre:</b> <span>{perfil.nombre}</span>
        </div>
        <div className="flex">
          <b className="w-24">Apellido:</b> <span>{perfil.apellido}</span>
        </div>
        <div className="flex">
          <b className="w-24">Teléfono:</b> <span>{perfil.celular || 'No registrado'}</span>
        </div>
        <div className="flex">
          <b className="w-24">Correo:</b> <span>{perfil.email}</span>
        </div>
        <div className="flex">
          <b className="w-24">Rol:</b> <span>{perfil.rol}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CardProfileAR