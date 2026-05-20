import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../layout/AuthContext';
import { motion } from 'framer-motion'; 

const MIN_LEN = 8;
const COMPLEXITY_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/; 
const CardPasswordAR = () => {
  const { token: contextToken } = useContext(AuthContext);
  const [showActual, setShowActual] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNuevo, setPasswordNuevo] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleActualizarPassword = async () => {
    const actual = passwordActual ?? "";
    const nueva = passwordNuevo ?? "";

    // Validaciones básicas
    if (!actual.trim() || !nueva.trim()) {
      toast.error("Por favor, llena ambos campos.", { autoClose: 3000 });
      return;
    }

    // Espacios al inicio/fin
    if (actual !== actual.trim()) {
      toast.error("La contraseña actual no debe tener espacios al inicio ni al final.", { autoClose: 3000 });
      return;
    }
    if (nueva !== nueva.trim()) {
      toast.error("La nueva contraseña no debe tener espacios al inicio ni al final.", { autoClose: 3000 });
      return;
    }

    const actualT = actual.trim();
    const nuevaT = nueva.trim();

    // Longitud mínima
    if (actualT.length < MIN_LEN) {
      toast.error(`La contraseña actual debe tener al menos ${MIN_LEN} caracteres.`, { autoClose: 3000 });
      return;
    }
    if (nuevaT.length < MIN_LEN) {
      toast.error(`La nueva contraseña debe tener al menos ${MIN_LEN} caracteres.`, { autoClose: 3000 });
      return;
    }

    // Diferente a la actual
    if (actualT === nuevaT) {
      toast.error("La nueva contraseña debe ser diferente a la actual.", { autoClose: 3000 });
      return;
    }

    // Complejidad
    if (!COMPLEXITY_REGEX.test(nuevaT)) {
      toast.error("La nueva contraseña debe incluir mayúscula, minúscula, número y símbolo.", { autoClose: 3000 });
      return;
    }

    const token = contextToken || sessionStorage.getItem("token");
    if (!token) {
      toast.error("Token no disponible. Vuelve a iniciar sesión.", { autoClose: 3000 });
      return;
    }

    try {
      setCargando(true);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/perfil/admin-red/actualizar/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            passwordactual: actualT,
            passwordnuevo: nuevaT,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "No se pudo actualizar la contraseña.");
      }

      toast.success("Contraseña actualizada correctamente.", { autoClose: 3000 });
      setPasswordActual("");
      setPasswordNuevo("");
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      toast.error(error.message || "Error en la actualización.", { autoClose: 3000 });
    } finally {
      setCargando(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className='mt-5'>
        <h1 className='font-black text-xl md:text-2xl text-gray-500 mt-12 md:mt-16'>Actualizar contraseña</h1>
        <hr className='my-3 md:my-4 border-t-2 border-gray-400' />
      </div>

      <form>
        <div className="mb-4 md:mb-5">
          <label className="mb-2 block text-xs md:text-sm font-semibold">Contraseña actual</label>
          <div className="relative">
            <input
              type={showActual ? "text" : "password"}
              placeholder="Ingrese su contraseña actual"
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
              className="shadow-md block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 pr-10"
              required
              minLength={MIN_LEN}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowActual((s) => !s)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
              aria-label={showActual ? "Ocultar contraseña" : "Mostrar contraseña"}>
              {showActual ? (
                <svg className="w-5 h-5" />
              ) : (
                <svg className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="mb-5">
          <label className="mb-2 block text-sm font-semibold">Nueva contraseña</label>
          <div className="relative">
            <input
              type={showNueva ? "text" : "password"}
              placeholder="Ingrese su nueva contraseña"
              value={passwordNuevo}
              onChange={(e) => setPasswordNuevo(e.target.value)}
              className="shadow-md block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 pr-10"
              required
              minLength={MIN_LEN}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowNueva((s) => !s)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
              aria-label={showNueva ? "Ocultar contraseña" : "Mostrar contraseña"}>
              {showNueva ? (
                <svg className="w-5 h-5" />
              ) : (
                <svg className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Mín. {MIN_LEN} caracteres, incluye mayúscula, minúscula, número y símbolo. Sin espacios al inicio/fin.
          </p>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={handleActualizarPassword}
            disabled={cargando}
            className="bg-white border border-gray-400 text-gray-700 px-4 py-2 rounded shadow-md 
              hover:bg-gray-700 hover:scale-105 duration-200 hover:text-white transition-all disabled:opacity-60">
            {cargando ? "Actualizando..." : "Actualizar Contraseña"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CardPasswordAR;