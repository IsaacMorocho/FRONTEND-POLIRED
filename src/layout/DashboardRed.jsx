import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { SlLogout } from "react-icons/sl";

const DashboardRed = () => {
  const location = useLocation();
  const urlActual = location.pathname;
  const navigate = useNavigate();
  const { logout, user, isAuthenticated } = useContext(AuthContext);

  // Validación de rol
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    if (!user || user.rol !== 'Admin_Red') {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Redirigir por defecto a perfilAR si solo entra a /dashboardRed
  useEffect(() => {
    if (location.pathname === '/dashboardRed') {
      navigate('/dashboardRed/perfilAR', { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Encabezado */}
      <div className="w-full bg-gray-700 py-3 px-4 flex flex-wrap items-center justify-between gap-4 z-50">
        <div className="flex items-center gap-2">
          <img
            src="/images/logo_admin.png"
            alt="logo"
            className="rounded-full w-10 h-10"
          />
          <span
            style={{ fontFamily: 'Lora, serif' }}
            className="text-lg font-semibold text-slate-100 block lg:hidden"
          >
            PANEL DE CONTROL
          </span>
        </div>

        <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 text-2xl
           font-semibold text-slate-100 tracking-widest" style={{ fontFamily: 'Lora, serif' }}>
          PANEL DE CONTROL
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-end">
          <div className="text-sm sm:text-md font-semibold text-slate-100 text-center">
            Administrador de Red - {user ? `${user.nombre} ${user.apellido}` : ''}
          </div>
          <Link to="/dashboardRed/perfilAR">
            <img
              src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/4715/4715329.png"}
              alt="user"
              className="w-10 h-10 border-2 border-green-600 rounded-full"
            />
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center text-white text-sm sm:text-md hover:bg-red-900 bg-red-800 px-3 py-2 rounded-lg">
            Cerrar Sesión
            <SlLogout className="h-5 w-9" />
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className='md:flex md:min-h-screen'>
        <div className='md:w-1/6 bg-slate-300 px-5 py-4'>
          <div className='sticky top-16'>
            <ul className='mt-5 py-45'>
              <li className='text-center text-2xl'>
                <Link
                  to='/dashboardRed/perfilAR'
                  style={{ fontFamily: 'Lora, serif' }}
                  className={`${
                    urlActual === '/dashboardRed/perfilAR'
                      ? 'transition-all duration-700 ease-in-out text-slate-300 bg-gray-700 px-3 py-2 rounded-md text-center'
                      : 'text-gray-700'
                  } text-2xl block mt-2 hover:text-slate-400`}
                >
                  Perfil
                </Link>
              </li>
              <hr className='mt-5 border-gray-700' />

              <li className='text-center'>
                <Link
                  to='/dashboardRed/publicaciones'
                  style={{ fontFamily: 'Lora, serif' }}
                  className={`${
                    urlActual === '/dashboardRed/publicaciones'
                      ? 'transition-all duration-700 ease-in-out text-slate-300 bg-gray-700 px-3 py-2 rounded-md text-center'
                      : 'text-gray-700'
                  } text-2xl block mt-2 hover:text-slate-400`}
                >
                  Publicaciones
                </Link>
              </li>
              <hr className='mt-5 border-gray-700' />
              <li className='text-center'>
                <Link
                  to='/dashboardRed/redesAR'
                  style={{ fontFamily: 'Lora, serif' }}
                  className={`${
                    urlActual === '/dashboardRed/redesAR'
                      ? 'transition-all duration-700 ease-in-out text-slate-300 bg-gray-700 px-3 py-2 rounded-md text-center'
                      : 'text-gray-700'
                  } text-2xl block mt-2 hover:text-slate-400`}
                >
                  Red Comunitaria
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contenido dinámico */}
        <div className='flex-1 flex flex-col justify-between h-screen bg-gray-100'>
          <div className='overflow-y-scroll p-8 mt-4'>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.key}
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}>
                <Outlet /> {/* Aquí se renderiza perfilAR, publicaciones, etc */}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardRed;
