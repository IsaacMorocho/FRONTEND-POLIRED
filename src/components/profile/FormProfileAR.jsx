import { useState, useEffect, useContext, useMemo } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../layout/AuthContext";import { motion } from 'framer-motion';
const NAME_MIN = 2;
const NAME_MAX = 50;
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜáéíóúñÑ' -]+$/;

const normalizeSpaces = (str) =>
  str.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");

const toTitleCase = (str) =>
  str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const validateNombre = (value, original) => {
  const v = normalizeSpaces(value);
  if (v === original) return ""; 
  if (v.length === 0) return "El nombre no puede estar vacío.";
  if (!NAME_REGEX.test(v)) return "El nombre solo puede contener letras, espacios, guiones y apóstrofes.";
  if (v.length < NAME_MIN) return `El nombre debe tener al menos ${NAME_MIN} caracteres.`;
  if (v.length > NAME_MAX) return `El nombre no puede superar ${NAME_MAX} caracteres.`;
  return "";
};

const validateApellido = (value, original) => {
  const v = normalizeSpaces(value);
  if (v === original) return "";
  if (v.length === 0) return "El apellido no puede estar vacío.";
  if (!NAME_REGEX.test(v)) return "El apellido solo puede contener letras, espacios, guiones y apóstrofes.";
  if (v.length < NAME_MIN) return `El apellido debe tener al menos ${NAME_MIN} caracteres.`;
  if (v.length > NAME_MAX) return `El apellido no puede superar ${NAME_MAX} caracteres.`;
  return "";
};

const normalizePhone = (value) => value.replace(/\D/g, "").slice(0, 10);

const validateCelular = (value, original) => {
  const v = normalizePhone(value);
  if (v === normalizePhone(original || "")) return "";
  if (v.length === 0) return "El celular no puede estar vacío.";
  if (!/^\d{10}$/.test(v)) return "El celular debe tener 10 dígitos.";
  if (!/^09/.test(v)) return "El celular debe iniciar con 09.";
  return "";
};

const joinHumanList = (arr) => {
  if (arr.length <= 1) return arr[0] || "";
  return `${arr.slice(0, -1).join(", ")} y ${arr.slice(-1)}`;
};

const FormProfileAR = () => {
  const { token, user, login } = useContext(AuthContext);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [celular, setCelular] = useState("");
  const [loading, setLoading] = useState(false);

  const [touched, setTouched] = useState({
    nombre: false,
    apellido: false,
    celular: false,
  });

  useEffect(() => {
    if (user) {
      setNombre(user.nombre || "");
      setApellido(user.apellido || "");
      setCelular(user.celular || "");
      setTouched({ nombre: false, apellido: false, celular: false });
    }
  }, [user]);

  const errors = useMemo(() => {
    return {
      nombre: validateNombre(nombre, user?.nombre || ""),
      apellido: validateApellido(apellido, user?.apellido || ""),
      celular: validateCelular(celular, user?.celular || ""),
    };
  }, [nombre, apellido, celular, user]);

  const hasBlockingErrors = useMemo(() => {
    const nombreChanged = normalizeSpaces(nombre) !== normalizeSpaces(user?.nombre || "");
    const apellidoChanged = normalizeSpaces(apellido) !== normalizeSpaces(user?.apellido || "");
    const celularChanged = normalizePhone(celular) !== normalizePhone(user?.celular || "");
    return (
      (nombreChanged && !!errors.nombre) ||
      (apellidoChanged && !!errors.apellido) ||
      (celularChanged && !!errors.celular)
    );
  }, [errors, nombre, apellido, celular, user]);

  const handleActualizar = async () => {
    const payload = {};
    const nNorm = normalizeSpaces(nombre);
    const aNorm = normalizeSpaces(apellido);
    const cNorm = normalizePhone(celular);

    // Validar antes de enviar
    const nombreErr = validateNombre(nombre, user?.nombre || "");
    const apellidoErr = validateApellido(apellido, user?.apellido || "");
    const celularErr = validateCelular(celular, user?.celular || "");

    if (nombreErr || apellidoErr || celularErr) {
      const msgs = [nombreErr, apellidoErr, celularErr].filter(Boolean).join(" ");
      toast.error(msgs || "Corrige los errores antes de continuar.");
      setTouched({ nombre: true, apellido: true, celular: true });
      return;
    }

    if (nNorm !== normalizeSpaces(user?.nombre || "") && nNorm !== "") payload.nombre = toTitleCase(nNorm);
    if (aNorm !== normalizeSpaces(user?.apellido || "") && aNorm !== "") payload.apellido = toTitleCase(aNorm);
    if (cNorm !== normalizePhone(user?.celular || "") && cNorm !== "") payload.celular = cNorm;

    if (Object.keys(payload).length === 0) {
      toast.error("Debe llenar al menos un campo diferente para actualizar.");
      return;
    }

    // Prepara etiquetas para el toast de confirmación
    const updatedLabels = [];
    if (payload.nombre) updatedLabels.push("Nombre");
    if (payload.apellido) updatedLabels.push("Apellido");
    if (payload.celular) updatedLabels.push("Celular");

    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/perfil/admin-red/actualizar`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Error al actualizar");
      }

      // Actualizar el usuario en el contexto
      const updatedUser = { ...user, ...payload };
      login(token, updatedUser);

      // Toast de confirmación con los campos exactos que cambiaron
      const list = joinHumanList(updatedLabels);
      const singular = updatedLabels.length === 1;
      toast.success(`${list} ${singular ? "actualizado" : "actualizados"} correctamente.`);

      // Refleja la normalización resultante en el UI
      if (payload.nombre) setNombre(payload.nombre);
      if (payload.apellido) setApellido(payload.apellido);
      if (payload.celular) setCelular(payload.celular);
      setTouched({ nombre: false, apellido: false, celular: false });
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error al actualizar los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6"
    >
      <h2 className="text-xl font-semibold text-white mb-6">Información Personal</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Nombre</label>
            <input
              type="text"
              placeholder="Nombre"
              className={`w-full bg-slate-900 border rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none transition ${
                touched.nombre && errors.nombre 
                  ? "border-red-500 focus:border-red-500" 
                  : "border-slate-700 focus:border-blue-500"
              }`}
              value={nombre}
              onChange={(e) => {
                const v = e.target.value;
                const cleaned = normalizeSpaces(v.replace(/\s{2,}/g, " ")).slice(0, NAME_MAX);
                setNombre(cleaned);
              }}
              onBlur={() => {
                setNombre((prev) => (prev ? toTitleCase(normalizeSpaces(prev)) : prev));
                setTouched((t) => ({ ...t, nombre: true }));
              }}
              aria-invalid={touched.nombre && !!errors.nombre}
              aria-describedby="nombre-error"
              maxLength={NAME_MAX + 5}
              autoComplete="given-name"
            />
            {touched.nombre && errors.nombre && (
              <p id="nombre-error" className="mt-1 text-xs text-red-400">
                {errors.nombre}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Apellido</label>
            <input
              type="text"
              placeholder="Apellido"
              className={`w-full bg-slate-900 border rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none transition ${
                touched.apellido && errors.apellido 
                  ? "border-red-500 focus:border-red-500" 
                  : "border-slate-700 focus:border-blue-500"
              }`}
              value={apellido}
              onChange={(e) => {
                const v = e.target.value;
                const cleaned = normalizeSpaces(v.replace(/\s{2,}/g, " ")).slice(0, NAME_MAX);
                setApellido(cleaned);
              }}
              onBlur={() => {
                setApellido((prev) => (prev ? toTitleCase(normalizeSpaces(prev)) : prev));
                setTouched((t) => ({ ...t, apellido: true }));
              }}
              aria-invalid={touched.apellido && !!errors.apellido}
              aria-describedby="apellido-error"
              maxLength={NAME_MAX + 5}
              autoComplete="family-name"
            />
            {touched.apellido && errors.apellido && (
              <p id="apellido-error" className="mt-1 text-xs text-red-400">
                {errors.apellido}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Teléfono</label>
          <input
            type="tel"
            placeholder="09XXXXXXXX"
            className={`w-full bg-slate-900 border rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none transition ${
              touched.celular && errors.celular 
                ? "border-red-500 focus:border-red-500" 
                : "border-slate-700 focus:border-blue-500"
            }`}
            value={celular}
            onChange={(e) => {
              setCelular(normalizePhone(e.target.value));
            }}
            onBlur={() => setTouched((t) => ({ ...t, celular: true }))}
            inputMode="numeric"
            pattern="\d*"
            aria-invalid={touched.celular && !!errors.celular}
            aria-describedby="celular-error"
            autoComplete="tel"
          />
          {touched.celular && errors.celular && (
            <p id="celular-error" className="mt-1 text-xs text-red-400">
              {errors.celular}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleActualizar}
          disabled={loading || hasBlockingErrors}
          className={`w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:shadow-lg transition ${
            loading || hasBlockingErrors ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Actualizando..." : "Guardar Cambios"}
        </button>
      </div>
    </motion.div>
  );
};

export default FormProfileAR;