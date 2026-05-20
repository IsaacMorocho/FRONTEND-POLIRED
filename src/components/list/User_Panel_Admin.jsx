import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiUserPlus } from "react-icons/fi";
import { MdDeleteForever, MdPublishedWithChanges } from "react-icons/md";
import axios from "axios";
import { AuthContext } from "../../layout/AuthContext";
import { motion } from 'framer-motion';

const UserCRUD = () => {
  const initialInfo = { nombre: "", apellido: "", celular: "", correo: "", redComunitaria: "", contraseña: "" };
  const [userInfo, setUserInfo] = useState(initialInfo);
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState({ type: null, visible: false, user: null });
  const { token: contextToken } = useContext(AuthContext);
  const token = contextToken || sessionStorage.getItem("token");
  const NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ ]{2,35}$/;
  const CEL_REGEX = /^\d{1,10}$/;

  const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateName = (label, value) => {
    if (!NAME_REGEX.test(value)) {
      toast.error(`${label} debe tener entre 2 y 35 caracteres, solo letras y espacios.`);
      return false;
    }
    return true;
  };

  const validateCel = (value) => {
    if (!value) return true; 
    if (!CEL_REGEX.test(value)) {
      toast.error("Celular debe contener solo números (0-9) y máximo 10 dígitos.");
      return false;
    }
    return true;
  };

  const validateEmail = (value) => {
    const trimmed = value?.trim() ?? "";
    if (trimmed.length < 6) {
      toast.error("Correo debe tener al menos 6 caracteres.");
      return false;
    }
    if (trimmed !== value) {
      toast.error("Correo no debe tener espacios al inicio ni al final.");
      return false;
    }
    if (/\s/.test(trimmed)) {
      toast.error("Correo no debe contener espacios internos.");
      return false;
    }
    if (!EMAIL_FORMAT.test(trimmed)) {
      toast.error("Correo debe tener un formato válido (usuario@dominio.com).");
      return false;
    }
    return true;
  };

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/estudiantes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error al cargar estudiantes");
      setUsers(await res.json());
    } catch (e) { console.error(e); toast.error(e.message); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, apellido, correo, contraseña, celular } = userInfo;
    if (!nombre || !apellido || !correo || !contraseña) {
      toast.error("Completa los campos obligatorios.");
      return;
    }

    if (!validateName("Nombre", nombre)) return;
    if (!validateName("Apellido", apellido)) return;
    if (!validateCel(celular)) return;
    if (!validateEmail(correo)) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/crear-estudiantes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: userInfo.nombre,
          apellido: userInfo.apellido,
          email: userInfo.correo.trim(),
          password: userInfo.contraseña,
          celular: userInfo.celular,
          redComunitaria: userInfo.redComunitaria
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      toast.success("Estudiante creado correctamente.");
      setUserInfo(initialInfo);
      fetchUsers();
    } catch (e) { toast.error(e.message); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const id = modal.user._id;
    const payload = {};

    if (modal.user.nombre) payload.nombre = modal.user.nombre;
    if (modal.user.apellido) payload.apellido = modal.user.apellido;
    if (modal.user.celular) payload.celular = modal.user.celular;
    if (modal.user.email) payload.email = modal.user.email;
    if (modal.user.redComunitaria) payload.redComunitaria = modal.user.redComunitaria;
    if (modal.user.password) payload.password = modal.user.password;

    if (Object.keys(payload).length === 0) {
      toast.error("Debe modificar al menos un campo.");
      return;
    }

    // Validaciones sobre los campos que se van a enviar
    if (payload.nombre && !validateName("Nombre", payload.nombre)) return;
    if (payload.apellido && !validateName("Apellido", payload.apellido)) return;
    if (payload.celular && !validateCel(payload.celular)) return;
    if (payload.email && !validateEmail(payload.email)) return;

    // Asegurar trim del email si viene
    if (payload.email) payload.email = payload.email.trim();

    try {
      console.log("ID que se envía:", id);
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/actualizar-estudiantes/${id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Estudiante actualizado correctamente");
      await fetchUsers();
      setModal({ visible: false, type: null, user: null });
    } catch (err) {
      console.error("Error al actualizar:", err);
      toast.error("Error al actualizar estudiante");
    }
  };

  const getCreateInputProps = (k) => {
    if (k === "nombre" || k === "apellido") {
      return {
        maxLength: 35,
        pattern: "[A-Za-zÁÉÍÓÚÜáéíóúüÑñ ]{2,35}",
        title: "Solo letras y espacios, entre 2 y 35 caracteres"
      };
    }
    if (k === "celular") {
      return {
        maxLength: 10,
        inputMode: "numeric",
        pattern: "\\d{0,10}",
        title: "Solo números (0-9), máximo 10 dígitos"
      };
    }
    if (k === "correo") {
      return {
        minLength: 6,
        title: "Mínimo 6 caracteres, sin espacios al inicio/fin, formato usuario@dominio.com"
      };
    }
    return {};
  };

  const getUpdateInputProps = (k) => {
    if (k === "nombre" || k === "apellido") {
      return {
        maxLength: 35,
        pattern: "[A-Za-zÁÉÍÓÚÜáéíóúüÑñ ]{2,35}",
        title: "Solo letras y espacios, entre 2 y 35 caracteres"
      };
    }
    if (k === "celular") {
      return {
        maxLength: 10,
        inputMode: "numeric",
        pattern: "\\d{0,10}",
        title: "Solo números (0-9), máximo 10 dígitos"
      };
    }
    if (k === "email") {
      return {
        minLength: 6,
        title: "Mínimo 6 caracteres, sin espacios al inicio/fin, formato usuario@dominio.com"
      };
    }
    return {};
  };

  const handleDeleteConfirm = async () => {
    const { _id } = modal.user;
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/eliminar-estudiantes/${_id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.msg);
    toast.success("Estudiante eliminado.");
    setModal({ type: null, visible: false, user: null });
    fetchUsers();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="max-w-6xl mx-auto p-3 md:p-4"
    >
      <form onSubmit={handleSubmit}>
        <fieldset className="bg-slate-300 p-4 md:p-7 rounded-lg shadow-md mb-4 md:mb-6">
          <legend className="text-lg md:text-xl font-bold text-gray-300 bg-gray-700 px-3 md:px-4 py-1 rounded-md">
            Crear nuevo estudiante
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
            {["nombre","apellido","correo","contraseña","celular"].map((k) => (
              <div key={k}>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  {k.charAt(0).toUpperCase()+k.slice(1)}
                </label>
                <input
                  type={k === "correo" ? "email" : k === "contraseña" ? "password" : "text"}
                  name={k}
                  value={userInfo[k]}
                  onChange={(e) => setUserInfo(prev => ({...prev, [k]: e.target.value}))}
                  className="w-full p-2 border border-gray-700 rounded-md text-sm md:text-base"
                  required={["nombre","apellido","correo","contraseña"].includes(k)}
                  {...getCreateInputProps(k)}
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="flex items-center justify-center bg-white border border-slate-300 text-gray-700 
            px-4 py-2 rounded shadow-md hover:bg-gray-700 hover:scale-105 duration-200 hover:text-white transition-all">
            <FiUserPlus className="mr-2" />
            Crear Estudiante
          </button>
        </fieldset>
      </form>

      <div className="bg-slate-300 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Lista de Estudiantes</h2>
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-700 text-white">
                  {["Nombre","Apellido","Celular","Correo","Red Comunitaria","Acciones"].map(th => (
                    <th key={th} className="py-2 px-4 border border-gray-600">{th}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border border-gray-600 text-center">{u.nombre}</td>
                    <td className="py-2 px-4 border border-gray-600 text-center">{u.apellido}</td>
                    <td className="py-2 px-4 border border-gray-600 text-center">{u.celular || "--"}</td>
                    <td className="py-2 px-4 border border-gray-600 text-center">{u.email}</td>
                    <td className="py-2 px-4 border border-gray-600 text-center">
                      {u.redComunitaria.length > 0 ? u.redComunitaria.map(red => red.nombre).join(', '): "--"}
                    </td>
                    <td className="py-2 px-4 border border-gray-600">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => setModal({ type: "update", visible: true, user: {...u} })}
                          title="Actualizar"
                          className="p-1 text-blue-600 hover:text-blue-800"
                        ><MdPublishedWithChanges className="h-5 w-5" /></button>
                        <button
                          onClick={() => setModal({ type: "delete", visible: true, user: u })}
                          title="Eliminar"
                          className="p-1 text-red-600 hover:text-red-800"
                        ><MdDeleteForever className="h-5 w-5" /></button>
                      </div>
                    </td>
                   </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="text-center py-4">No hay estudiantes registrados</p>}
      </div>

      {modal.visible && modal.type === "update" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-7 w-102 relative">
            <button
              onClick={() => setModal({ type: null, visible: false, user: null })}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold">
              &times;
            </button>
            <h3 className="font-lato text-lg font-bold mb-4 text-center">Actualizar Estudiante</h3>
            <form onSubmit={handleUpdate} className="space-y-3">
              {["nombre", "apellido", "celular", "email"].map(k => (
                <div key={k}>
                  <label className="block text-sm font-medium mb-1">
                    {k.charAt(0).toUpperCase() + k.slice(1)}
                  </label>
                  <input
                    type={k === "email" ? "email" : "text"}
                    value={modal.user[k] || ""}
                    onChange={e => setModal(prev => ({
                      ...prev, user: { ...prev.user, [k]: e.target.value }
                    }))}
                    className="w-full border border-gray-500 rounded px-2 py-1"
                    {...getUpdateInputProps(k)}
                  />
                </div>
              ))}
              <button type="submit" className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:scale-102 duration-200 hover:bg-slate-300 hover:text-gray-700 border">
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}

      {modal.visible && modal.type === "delete" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <button onClick={() => setModal({ type: null, visible: false, user: null })} className="text-xl font-bold absolute top-2 right-4">×</button>
            <p className="text-sm md:text-base">¿Eliminar a <strong>{modal.user?.nombre}</strong> ?</p>
            <div className="flex justify-end space-x-3 md:space-x-4 mt-4">
              <button onClick={() => setModal({ type: null, visible: false, user: null })} className="px-3 md:px-4 py-2 border rounded text-sm md:text-base">Cancelar</button>
              <button onClick={handleDeleteConfirm} className="px-3 md:px-4 py-2 bg-red-600 text-white rounded text-sm md:text-base">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
export default UserCRUD;