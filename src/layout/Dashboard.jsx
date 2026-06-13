import { Link, useOutlet, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext} from './AuthContext';
import { motion, AnimatePresence } from 'framer-motion'
import { SlLogout } from "react-icons/sl";
import { MdPerson, MdPeople, MdPublic, MdWarning, MdMenu, MdClose, MdMoreVert, MdAssignmentTurnedIn } from 'react-icons/md';
import { FiUsers } from 'react-icons/fi';
import { LuPanelLeftClose, LuPanelLeftOpen } from 'react-icons/lu';

const Dashboard = () => {
  const location = useLocation();
  const outlet = useOutlet();
  const urlActual = location.pathname;
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerDropdownOpen, setHeaderDropdownOpen] = useState(false);
  const [sidebarDropdownOpen, setSidebarDropdownOpen] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const getProfilePicUrl = () => {
    const profilePic = user?.avatar || user?.fotoPerfil;
    if (!profilePic || profilePic === 'null' || profilePic === 'undefined') {
      return `https://ui-avatars.com/api/?name=${user?.nombre || 'User'}&background=random`;
    }
    const path = profilePic;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const cleanPath = path.replace(/\\/g, '/');
    const base = import.meta.env.VITE_BACKEND_URL || '';
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
    return `${cleanBase}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard/redes', label: 'Redes Comunitarias', icon: MdPublic },
    { path: '/dashboard/estudiantes', label: 'Usuarios', icon: FiUsers },
    { path: '/dashboard/red-global', label: 'Red Global', icon: MdPublic },
    { path: '/dashboard/reportes', label: 'Reportes', icon: MdWarning },
    { path: '/dashboard/solicitudes', label: 'Solicitudes', icon: MdPeople },
    { path: '/dashboard/solicitudes-redes', label: 'Solicitudes de Redes', icon: MdAssignmentTurnedIn },
  ];

  const isActive = (path) => urlActual === path;

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden w-full max-w-[100vw]">
      
      {/* Sidebar - Desktop */}
      <motion.div 
        animate={{ width: isSidebarOpen ? 256 : 80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:flex flex-col bg-slate-900 border-r border-slate-800 shrink-0 z-30 relative"
      >
        {/* Logo Area */}
        <div className={`h-16 flex items-center border-b border-slate-800 shrink-0 ${isSidebarOpen ? 'px-5 justify-start' : 'justify-center'}`}>
          <img
            src="/images/logo_actual.png"
            alt="PoliRED"
            className={`w-11 h-11 rounded-full shrink-0 transition-all ${isSidebarOpen ? 'mr-3' : ''}`}
          />
          {isSidebarOpen && (
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent truncate">
              PoliRED
            </span>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3">
          {isSidebarOpen && (
            <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 whitespace-nowrap">
              Dashboards
            </p>
          )}
          <ul className="space-y-2">
            {navItems.map(({ path, label, icon: Icon }) => {
              const active = isActive(path);
              return (
                <li key={path}>
                  <Link
                    to={path}
                    className={`flex items-center gap-3 rounded-lg transition-all duration-200 group relative ${
                      isSidebarOpen ? 'px-3 py-2.5' : 'justify-center p-3'
                    } ${
                      active
                        ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon size={20} className={`shrink-0 ${active ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'}`} />
                    {isSidebarOpen && <span className="font-medium text-sm truncate">{label}</span>}
                    
                    {/* Tooltip for collapsed state */}
                    {!isSidebarOpen && (
                      <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl border border-slate-700">
                        {label}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom Profile Area */}
        <div className="p-4 border-t border-slate-800 shrink-0 overflow-visible">
          <div className={`flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'} relative`}>
            
            {/* Si el sidebar esta colapsado, el avatar abre el menu. Si esta expandido, son los 3 puntos */}
            <button
              onClick={() => !isSidebarOpen && setSidebarDropdownOpen(!sidebarDropdownOpen)}
              className={`flex-shrink-0 ${!isSidebarOpen ? 'cursor-pointer hover:opacity-80' : 'cursor-default'} focus:outline-none`}
            >
              <img
                src={getProfilePicUrl()}
                alt="Perfil"
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-700 hover:border-slate-500 transition"
              />
            </button>
            
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.nombre}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email || user?.rol}</p>
              </div>
            )}

            {isSidebarOpen && (
              <button 
                onClick={() => setSidebarDropdownOpen(!sidebarDropdownOpen)}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition focus:outline-none"
              >
                <MdMoreVert size={20} />
              </button>
            )}

            <AnimatePresence>
              {sidebarDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, x: isSidebarOpen ? 0 : 10 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`absolute bottom-full mb-2 ${isSidebarOpen ? 'left-0 right-0' : 'left-full ml-4'} w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50`}
                >
                  <div className="p-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setSidebarDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition"
                    >
                      <MdPerson size={18} /> Ver perfil
                    </Link>
                    <button
                      onClick={() => {
                        setSidebarDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-slate-700 rounded-md transition"
                    >
                      <SlLogout size={18} /> Cerrar sesión
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-950 min-w-0 z-10 relative">
        
        {/* Header */}
        <header className="relative z-40 h-16 flex items-center justify-between px-4 sm:px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur shrink-0 min-w-0">
          
          {/* Left: Sidebar Toggle */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex text-slate-400 hover:text-white transition-transform duration-200"
              title={isSidebarOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isSidebarOpen ? <LuPanelLeftClose size={22} /> : <LuPanelLeftOpen size={22} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
            </button>
          </div>

          {/* Center - Administrador */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Administrador Principal
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 sm:gap-5 relative">
            {/* Mobile Logo */}
            <div className="md:hidden flex items-center gap-2">
              <img src="/images/logo_actual.png" alt="PoliRED" className="w-8 h-8 rounded-full" />
              <span className="text-lg font-bold text-white">PoliRED</span>
            </div>

            <div className="hidden md:block relative">
              <button
                onClick={() => setHeaderDropdownOpen(!headerDropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <img
                  src={getProfilePicUrl()}
                  alt="Perfil"
                  className="w-9 h-9 rounded-full object-cover border-2 border-slate-700 hover:border-slate-500 transition"
                />
              </button>

              <AnimatePresence>
                {headerDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-12 right-0 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-slate-700 bg-slate-900/50">
                      <p className="text-white font-semibold truncate">{user?.nombre}</p>
                      <p className="text-slate-400 text-xs truncate">{user?.email || user?.rol}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/dashboard"
                        onClick={() => setHeaderDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition"
                      >
                        <MdPerson size={18} /> Ver perfil
                      </Link>
                      <button
                        onClick={() => {
                          setHeaderDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-slate-700 rounded-md transition"
                      >
                        <SlLogout size={18} /> Cerrar sesión
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Mobile Header Avatar removed as per user request */}
          </div>
        </header>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='md:hidden bg-slate-900 border-b border-slate-800 z-40 relative'
            >
              <nav className='p-4 space-y-2'>
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-300 ${
                      isActive(path)
                        ? 'bg-slate-800 text-blue-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                  </Link>
                ))}
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-300 ${
                    isActive('/dashboard')
                      ? 'bg-slate-800 text-blue-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <MdPerson size={20} />
                  <span>Ver perfil</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 text-sm text-white bg-red-600/80 hover:bg-red-700 px-3 py-2 rounded-lg transition mt-4"
                >
                  <SlLogout size={16} /> Salir
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        </main>

      </div>
    </div>
  );
};

export default Dashboard;
