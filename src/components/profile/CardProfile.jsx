import { useEffect, useState, useContext } from "react";
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { AuthContext } from '../../layout/AuthContext';

export const CardProfile = () => {
  const [perfil, setPerfil] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const { updateUser } = useContext(AuthContext);

  const token = sessionStorage.getItem("token");

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

  useEffect(() => {
    fetchPerfil();
  }, []);

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

      // Actualizar el avatar en el AuthContext para que se refleje en el Dashboard
      updateUser({ avatar: data.avatar });

      toast.success(data.msg || "Avatar actualizado correctamente");
    } catch (error) {
      console.error("Error al subir avatar:", error);
      toast.error(error.message || "Error al subir el avatar");
    } finally {
      setSubiendo(false);
    }
  };

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
          src={perfil.avatar || "https://cdn-icons-png.flaticon.com/512/4715/4715329.png"}
          alt="img-client"
          className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-gray-500 object-cover"
        />
        <label className="bg-blue-500 text-white rounded-md px-3 md:px-4 py-2 cursor-pointer hover:bg-red-500 text-xs md:text-sm">
          {subiendo ? "Subiendo..." : "Cambiar Avatar"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </label>
      </div>

      {/* Información */}
      <div className="space-y-2 text-sm sm:text-base">
        <div className="flex">
          <b className="w-24">Nombre:</b> <span>{perfil.nombre}</span>
        </div>
        <div className="flex">
          <b className="w-24">Apellido:</b> <span>{perfil.apellido}</span>
        </div>
        <div className="flex">
          <b className="w-24">Teléfono:</b> <span>{perfil.celular}</span>
        </div>
        <div className="flex">
          <b className="w-24">Correo:</b> <span>{perfil.email}</span>
        </div>
        <div className="flex text-sm md:text-base">
          <b className="w-20 md:w-24">Rol:</b> <span>{perfil.rol}</span>
        </div>
      </div>
    </motion.div>
  );
};
