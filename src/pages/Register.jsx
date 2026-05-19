import { useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

export const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    //enviar al backend
    const {register, handleSubmit, formState: {errors}}= useForm();
const registro =async(data)=>{
    try{
        const url="http://localhost:3000/api/registro"
        const respuesta =await axios.post(url,data)
        console.log(respuesta)
        toast.success(respuesta.data.msg)
    }catch(error){
        console.log(error)
        toast.error(error.response.data.msg)
    }
}
    return (
        <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col md:flex-row min-h-screen">
            {/* Sección de formulario de registro */}
            <div className="w-full md:w-1/2 min-h-screen bg-white flex justify-center items-center px-4 py-8">

                <div className="w-full max-w-md">
                    {/* Contenedor del formulario */}

                    <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-center uppercase text-gray-500">Bienvenido(a)</h1>
                    <small className="text-gray-400 block my-3 md:my-4 text-xs md:text-sm">Por favor ingresa tus datos</small> 
                    
                    <form onSubmit={handleSubmit(registro)}>

                        {/* Campo para nombre */}
                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold">Nombre</label>
                            <input type="text" placeholder="Ingresa tu nombre" className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500" {...register("nombre", {required:"El nombre es obligatorio"})}/>
                            {errors.nombre && <p className="text-red-800">{errors.nombre.message}</p>} {/*cada input del formulario asocia el metodo registrer y los errores*/}
                        </div>

                        {/* Campo para apellido */}
                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold">Apellido</label>
                            <input type="text" placeholder="Ingresa tu apellido" className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500" {...register("apellido", {required:"El apellido es obligatorio"})}/>
                            {errors.apellido && <p className="text-red-800">{errors.nombre.message}</p>} {/*cada input del formulario asocia el metodo registrer y los errores*/}
                        </div>

                        {/* Campo para dirección */}
                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold">Dirección</label>
                            <input type="text" placeholder="Ingresa tu dirección de domicilio" className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500" {...register("direccion", {required:"La direccion es obligatoria"})}/>
                            {errors.direccion && <p className="text-red-800">{errors.nombre.message}</p>} {/*cada input del formulario asocia el metodo registrer y los errores*/}
                        </div>
                        
                        {/* Campo para celular */}
                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold">Celular</label>
                            <input type="number" placeholder="Ingresa tu celular" className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500" {...register("celular", {required:"El celular es obligatorio"})}/>
                            {errors.celular && <p className="text-red-800">{errors.nombre.message}</p>} {/*cada input del formulario asocia el metodo registrer y los errores*/}
                        </div>

                        {/* Campo para correo electrónico */}
                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold">Correo electrónico</label>
                            <input type="email" placeholder="Ingresa tu correo electrónico" className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500" {...register("correo", {required:"El correo electronico es obligatorio"})}/>
                            {errors.correo && <p className="text-red-800">{errors.nombre.message}</p>} {/*cada input del formulario asocia el metodo registrer y los errores*/} 
                        </div>

                        {/* Campo para contraseña */}
                        <div className="mb-3 relative">
                            <label className="mb-2 block text-sm font-semibold">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"} // Cambia el tipo del input entre 'text' y 'password' según el estado
                                    placeholder="********************"
                                    className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500 pr-10"
                                />
                                {/* Botón para mostrar/ocultar la contraseña */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)} // Cambia el estado para mostrar/ocultar la contraseña
                                    className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
                                >
                                    {/* Icono que cambia según el estado de la contraseña */}
                                    {showPassword ? (
                                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A9.956 9.956 0 0112 19c-4.418 0-8.165-2.928-9.53-7a10.005 10.005 0 0119.06 0 9.956 9.956 0 01-1.845 3.35M9.9 14.32a3 3 0 114.2-4.2m.5 3.5l3.8 3.8m-3.8-3.8L5.5 5.5" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9.95 0a9.96 9.96 0 0119.9 0m-19.9 0a9.96 9.96 0 0119.9 0M3 3l18 18" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Botón para enviar el formulario */}
                        <div className="mb-3">
                            <button className="bg-gray-500 text-slate-300 border py-2 w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-gray-900 hover:text-white">Registrarse</button>
                        </div>

                    </form>

                    {/* Enlace para iniciar sesión si ya tiene una cuenta */}
                    <div className="mt-3 text-xs md:text-sm flex flex-col sm:flex-row justify-between items-center gap-2">
                        <p>¿Ya posees una cuenta?</p>
                        <Link to="/login" className="py-2 px-5 bg-gray-500 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900">Iniciar sesión</Link>
                    </div>

                </div>

            </div>

            {/* Sección con imagen de fondo, solo visible en pantallas medianas y grandes */}
            <div className="w-full md:w-1/2 min-h-[300px] md:min-h-screen bg-[url('/public/images/dogregister.jpg')] bg-no-repeat bg-cover bg-center hidden md:block"></div>
        </motion.div>
    );
};
