import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../layout/AuthContext";
import { TrashIcon } from "@heroicons/react/24/outline";
import { motion } from 'framer-motion'; 

const Publicaciones_Panel_AR = () => {
  const { token } = useContext(AuthContext);
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publicacionAEliminar, setPublicacionAEliminar] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchPublicaciones = async () => {
      try {
        const res = await fetch(`${API_URL}/publicaciones/listar/admin`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al obtener publicaciones");

        const data = await res.json();
        setPublicaciones(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPublicaciones();
    }
  }, [token]);

  const eliminarPublicacion = async () => {
    if (!publicacionAEliminar) return;

    try {
      const res = await fetch(
        `${API_URL}/publicaciones/admin/eliminar/${publicacionAEliminar._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Error al eliminar la publicación");

      // Filtrar publicación eliminada
      setPublicaciones((prev) =>
        prev.filter((pub) => pub._id !== publicacionAEliminar._id)
      );

      setModalOpen(false);
      setPublicacionAEliminar(null);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center text-gray-600">
        Cargando publicaciones...
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="max-w-7xl mx-auto p-4 md:p-6"
    >
      {publicaciones.length > 0 ? (
        Object.entries(
          publicaciones.reduce((acc, pub) => {
            const red = pub.comunidadId?.nombre || "Sin red asignada";
            if (!acc[red]) acc[red] = [];
            acc[red].push(pub);
            return acc;
          }, {})
        ).map(([redNombre, pubs]) => (
          <div key={redNombre} className="mb-8 md:mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-center text-gray-600 mb-4 md:mb-6">
              {redNombre}
            </h2>

            <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
              {pubs.map((pub) => (
                <div
                  key={pub._id}
                  className="relative rounded-lg shadow-lg border border-gray-200 w-full max-w-xs flex flex-col group"
                >
                  <div className="bg-gray-700 rounded-t-xl text-white px-3 md:px-4 py-2 font-semibold text-base md:text-lg w-full break-words">
                    Autor: {pub.autorId.nombre} {pub.autorId.apellido}
                  </div>
                  <div className="bg-white rounded-lg p-4 space-y-2 w-full break-words flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-gray-800">{pub.titulo}</h3>
                    <p className="text-gray-700 break-words flex-grow">
                      {pub.contenido}
                    </p>
                    <p className="text-sm text-gray-500 italic mt-2">
                      {`Publicado el: ${new Date(pub.timestamp).toLocaleDateString()}`}
                    </p>

                    {/* Ícono de eliminar visible al hover */}
                    <button
                      onClick={() => {
                        setPublicacionAEliminar(pub);
                        setModalOpen(true);
                      }}
                      className="absolute bottom-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-gray-500 text-center">
          No hay publicaciones disponibles.
        </div>
      )}

      {/* Modal de confirmación */}
      {modalOpen && publicacionAEliminar && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full z-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            ¿Deseas eliminar la publicación de{" "}
            <span className="font-bold">
              {publicacionAEliminar.autorId.nombre}{" "}
              {publicacionAEliminar.autorId.apellido}
            </span>{" "}
            titulada <span className="italic">"{publicacionAEliminar.titulo}"</span>?
          </h3>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={eliminarPublicacion}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    )}

    </motion.div>
  );

};

export default Publicaciones_Panel_AR;
