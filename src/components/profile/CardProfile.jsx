import { useEffect, useState, useContext } from "react";
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { AuthContext } from '../../layout/AuthContext';

export const CardProfile = () => {
  const [perfil, setPerfil] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const { updateUser, token: contextToken, user } = useContext(AuthContext);

  const token = contextToken || sessionStorage.getItem("token");

  const fetchPerfil = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/perfil-superadmin`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error al obtener el perfil");
      const data = await response.json();
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

    const formData = new FormData();
    formData.append("imagen", file);

    try {
      setSubiendo(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/perfil/avatar`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Error al actualizar el avatar");
      }
      
      const data = await response.json();

      setPerfil((prev) => ({
        ...prev, 
        avatar: data.avatar,
      }));

      updateUser({ avatar: data.avatar });
      toast.success(data.msg || "Avatar actualizado");
    } catch (error) {
      console.error("Error al subir avatar:", error);
      toast.error(error.message || "Error al subir el avatar");
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
          src={perfil.avatar || "https://cdn-icons-png.flaticon.com/512/4715/4715329.png"}
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
