import { Link, useOutlet, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext} from './AuthContext';
import { motion, AnimatePresence } from 'framer-motion'
import { SlLogout } from "react-icons/sl";
import { MdPerson, MdPeople, MdPublic, MdWarning, MdMenu, MdClose } from 'react-icons/md';

const Dashboard = () => {
  const location = useLocation();
  const outlet = useOutlet();
  const urlActual = location.pathname;
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Perfil', icon: MdPerson },
    { path: '/dashboard/usuarios', label: 'Usuarios', icon: MdPeople },
    { path: '/dashboard/redes', label: 'Redes', icon: MdPublic },
    { path: '/dashboard/reportes', label: 'Reportes', icon: MdWarning },
  ];

  const isActive = (path) => urlActual === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/95 border-b border-slate-800">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="/images/logo_admin.png"
                alt="PoliRED"
                className="w-10 h-10 rounded-full"
              />
              <span
                style={{ fontFamily: 'Lora, serif' }}
                className="hidden sm:block text-lg font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              >
                PoliRED Control
              </span>
            </div>

            {/* Center - User Info */}
            <div className="hidden md:flex items-center gap-2">
              <div className="text-sm text-slate-300">
                <p className="font-semibold">{user?.nombre}</p>
                <p className="text-xs text-slate-400">{user?.rol}</p>
              </div>
            </div>

            {/* Right - Avatar & Logout */}
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="hidden md:block">
                <img
                  src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/4715/4715329.png"}
                  alt="user"
                  className="w-9 h-9 rounded-full border border-blue-500 hover:border-purple-500 transition"
                />
              </Link>
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center justify-center gap-2 text-sm text-white bg-red-600/80 hover:bg-red-700 px-3 py-2 rounded-lg transition"
              >
                <SlLogout className="w-4 h-4" />
                <span>Salir</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-slate-300 hover:text-white"
              >
                {mobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className='flex flex-col md:flex-row md:min-h-[calc(100vh-64px)]'>
        {/* Sidebar - Desktop */}
        <div className='hidden md:block w-64 bg-slate-900 border-r border-slate-800'>
          <nav className='sticky top-16 p-6'>
            <ul className='space-y-2'>
              {navItems.map(({ path, label, icon: Icon }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-300 ${
                      isActive(path)
                        ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-blue-500/50 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon size={20} />
                    <span style={{ fontFamily: 'Lora, serif' }}>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='md:hidden bg-slate-800 border-b border-slate-700'
            >
              <nav className='p-4 space-y-2'>
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-300 ${
                      isActive(path)
                        ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-blue-500/50 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                  </Link>
                ))}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 text-sm text-white bg-red-600/80 hover:bg-red-700 px-3 py-2 rounded-lg transition mt-2"
                >
                  <SlLogout className="w-4 h-4" />
                  Salir
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className='flex-1 overflow-auto'>
          <div className='max-w-6xl mx-auto p-4 sm:p-6 lg:p-8'>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {outlet}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
