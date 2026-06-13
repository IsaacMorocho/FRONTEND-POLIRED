import { useEffect, useState, useContext } from "react";
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { AuthContext } from '../../layout/AuthContext';
import superadminService from '../../services/superadminService';
import { compressImage } from '../../utils/imageCompression';

export const CardProfile = () => {
  const [perfil, setPerfil] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const { updateUser, user } = useContext(AuthContext);

  const fetchPerfil = async () => {
    try {
      const data = await superadminService.getPerfil();
      setPerfil(data);
    } catch (error) {
      console.error("Perfil error:", error);
    }
  };

  // Cargar perfil al montar el componente
  useEffect(() => {
    fetchPerfil();
  }, []);

  // Recargar perfil cuando cambie el usuario en el contexto
  // Esto ocurre cuando FormProfile actualiza el perfil y llama a login()
  useEffect(() => {
    if (user && user.nombre) {
      fetchPerfil();
    }
  }, [user]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSubiendo(true);
      const compressedFile = await compressImage(file);
      
      const formData = new FormData();
      formData.append("imagen", compressedFile);

      const data = await superadminService.updateAvatar(formData);
      
      setPerfil((prev) => ({
        ...prev, 
        avatar: data.avatar,
      }));

      updateUser({ avatar: data.avatar });
      toast.success(data.msg || "Avatar actualizado");
    } catch (error) {
      console.error("Error al subir avatar:", error);
      toast.error(error.response?.data?.msg || "Error al subir el avatar");
    } finally {
      setSubiendo(false);
    }
  };

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
          src={perfil.avatar || `https://ui-avatars.com/api/?name=${perfil.nombre}+${perfil.apellido}&background=2563eb&color=fff&size=128`}
          alt="perfil"
          className="w-32 h-32 rounded-full border-2 border-blue-500 object-cover shadow-lg"
        />
        <label className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg px-4 py-2 cursor-pointer hover:shadow-lg transition text-sm font-medium">
          {subiendo ? "Subiendo..." : "Cambiar Avatar"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
            disabled={subiendo}
          />
        </label>
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
          <span className="text-slate-400 text-sm">Email</span>
          <span className="text-white font-medium text-right text-sm break-all">{perfil.email}</span>
        </div>
        <div className="flex justify-between items-start border-t border-slate-700 pt-3 mt-3">
          <span className="text-slate-400 text-sm">Roles</span>
          <div className="flex flex-wrap gap-2 justify-end">
            {(perfil.roles || [perfil.rol]).filter(Boolean).map((r, i) => (
              <span key={i} className="inline-block px-3 py-1 bg-blue-600/30 text-blue-300 rounded-full text-xs font-medium">
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
