import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../layout/AuthContext";
import { toast } from "react-toastify";
import { motion } from 'framer-motion';
import publicacionesService from "../../services/publicacionesService";

const Articulos = () => {
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [articuloAEliminar, setArticuloAEliminar] = useState(null);
  const { token } = useContext(AuthContext);

  const fetchArticulos = async () => {
    try {
      const data = await publicacionesService.getArticulosAdmin();
      setArticulos(data.articulos || []);
    } catch (error) {
      console.error("Error al obtener artículos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchArticulos();
  }, [token]);

  // Formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const confirmarEliminar = (articulo) => {
    setArticuloAEliminar(articulo);
    setModalOpen(true);
  };

  //Eliminar artículo
  const eliminarArticulo = async () => {
    if (!articuloAEliminar) return;

    try {
      await publicacionesService.eliminarArticuloAdmin(articuloAEliminar._id);

      toast.success("Articulo eliminado exitosamente");
      setArticulos((prev) =>
        prev.filter((art) => art._id !== articuloAEliminar._id)
      );
    } catch (error) {
      console.error("Error al eliminar artículo:", error);
      alert("Error al eliminar el artículo. Intente nuevamente.");
    } finally {
      setModalOpen(false);
      setArticuloAEliminar(null);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Cargando artículos...</p>;
  }

  if (articulos.length === 0) {
    return <p className="text-center text-gray-500">No hay artículos disponibles</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {articulos.map((articulo) => (
          <div
            key={articulo._id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
          >
            <div className="bg-gray-700 text-white px-3 md:px-4 py-2 font-semibold text-sm md:text-base">
              Autor: {articulo.autorId.nombre} {articulo.autorId.apellido}
            </div>

            <div className="p-3 md:p-4 space-y-2 md:space-y-3">
              <h3 className="text-base md:text-lg font-bold text-gray-800">{articulo.titulo}</h3>
              <p className="text-sm md:text-base text-gray-600">{articulo.descripcion}</p>
              <p className="text-sm md:text-base text-gray-800 font-semibold">
                Precio: ${articulo.precio.toFixed(2)}
              </p>

              <p
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  articulo.vendido
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {articulo.vendido ? "Vendido" : "Disponible"}
              </p>

              <p className="text-xs text-gray-500 italic">
                Publicado el {formatearFecha(articulo.createdAt)}
              </p>

              {/* Botón eliminar */}
              <button
                onClick={() => confirmarEliminar(articulo)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de confirmación */}
      {modalOpen && articuloAEliminar && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          ></div>

          <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full z-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              ¿Deseas eliminar el artículo{" "}
              <span className="italic">&quot;{articuloAEliminar.titulo}&quot;</span> de{" "}
              <span className="font-bold">
                {articuloAEliminar.autorId.nombre}{" "}
                {articuloAEliminar.autorId.apellido}
              </span>
              ?
            </h3>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={eliminarArticulo}
                className="px-3 md:px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm md:text-base"
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

export default Articulos;
