import { Link, useOutlet, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext} from './AuthContext';
import { motion,AnimatePresence } from 'framer-motion'
import { SlLogout } from "react-icons/sl";

const Dashboard = () => {
  const location = useLocation();
  const outlet = useOutlet();
  const urlActual = location.pathname;
  const {logout} = useContext(AuthContext);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

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
              {user?.rol}-{user?.nombre}
            </div>
            <Link to="/dashboard">
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
              <SlLogout className="h-5 w-9"/>
            </button>
          </div>
        </div>

      {/* Layout*/}
      <div className='md:flex md:min-h-screen'>
        <div className='md:w-1/6 bg-slate-300 px-5 py-4'>
          <div className='sticky top-16'>
            <ul className='mt-5 py-45'>
              <li className='text-center text-2xl'>
                <Link
                  to='/dashboard'
                  style={{ fontFamily: 'Lora, serif' }}
                  className={`${
                    urlActual === '/dashboard'
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
                  to='/dashboard/usuarios'
                  style={{ fontFamily: 'Lora, serif' }}
                  className={`${
                    urlActual === '/dashboard/usuarios'
                      ? 'transition-all duration-700 ease-in-out text-slate-300 bg-gray-700 px-3 py-2 rounded-md text-center'
                      : 'text-gray-700'
                  } text-2xl block mt-2 hover:text-slate-400`}
                >
                  Usuarios
                </Link>
              </li>
              <hr className='mt-5 border-gray-700' />
              <li className='text-center'>
                <Link
                  to='/dashboard/redes'
                  style={{ fontFamily: 'Lora, serif' }}
                  className={`${
                    urlActual === '/dashboard/redes'
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

        {/* Animacion al seleccionar cada op*/}
        <div className='flex-1 flex flex-col justify-between h-screen bg-gray-100'>
          <div className='overflow-y-scroll p-8 mt-4'>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.key}
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}>
                {outlet}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
