import { Link } from 'react-router-dom';
import { motion, useTransform, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import StarBorder from './StarBorder';

const HeaderDynamic = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY, isScrolled } = useScrollAnimation(100);

  const navLinks = [
    { href: '#about', label: 'Sobre nosotros' },
    { href: '#servicios', label: 'Servicios' },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Animaciones suaves basadas en scrollY (no en estado boolean)
  const headerBlurValue = useTransform(scrollY, [0, 100], [0, 8]);
  const headerBlur = useTransform(headerBlurValue, (v) => `blur(${v}px)`);
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.8]);
  const borderRadiusValue = useTransform(scrollY, [0, 100], [0, 15]);
  const marginTopValue = useTransform(scrollY, [0, 100], [0, 0]);
  const marginBottomValue = useTransform(scrollY, [0, 100], [0, 0]);
  const paddingTopValue = useTransform(scrollY, [0, 100], [16, 8]);
  const paddingBottomValue = useTransform(scrollY, [0, 100], [16, 7]);
  const paddingLeftValue = useTransform(scrollY, [0, 100], [32, 24]);
  const paddingRightValue = useTransform(scrollY, [0, 100], [32, 24]);
  const bgColor = useTransform(
    bgOpacity,
    (v) => `rgba(15, 23, 42, ${v})`
  );

  return (
    <>
      {/* Header Fixed */}
      <motion.header className="fixed top-0 left-0 right-0 z-[100]">
        {/* Full-width container con BLUR */}
        <motion.div
          className="w-full"
          style={{
            backdropFilter: headerBlur,
          }}
        >
          {/* Inner container - full width */}
          <motion.div
            className="w-full"
            style={{}}
          >
            {/* Header items container */}
            <motion.div
              className="flex flex-row justify-between items-center gap-2 sm:gap-4"
              style={{
                borderRadius: borderRadiusValue,
                marginTop: marginTopValue,
                marginBottom: marginBottomValue,
                paddingTop: paddingTopValue,
                paddingBottom: paddingBottomValue,
                paddingLeft: paddingLeftValue,
                paddingRight: paddingRightValue,
                backgroundColor: bgColor,
              }}
            >
              {/* Logo Section */}
              <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <motion.div className="flex items-center gap-x-2">
                  <img
                    className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14"
                    src="/images/logo_actual.png"
                    alt="Logo"
                  />
                  <h1
                    className="font-extrabold tracking-widest text-xl sm:text-2xl lg:text-3xl hidden sm:block"
                    style={{
                      WebkitTextStroke: '1.5px #e7eaf0',
                      color: 'transparent',
                    }}
                  >
                    PoliRED
                  </h1>
                </motion.div>
              </Link>

              {/* Navigation Links - Desktop */}
              <motion.div className="hidden md:flex items-center justify-center flex-1">
                <ul className="flex gap-4 lg:gap-8 justify-center flex-wrap">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="font-bold text-white text-sm lg:text-base hover:text-purple-400 transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Admin Button + Mobile Menu Toggle */}
              <motion.div className="flex items-center gap-1 sm:gap-2">
                <StarBorder
                  as="a"
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="#14ca32"
                  speed="5s"
                  thickness={3}
                  className="text-xs sm:text-sm py-1.5 sm:py-2 px-2 sm:px-4 whitespace-nowrap"
                >
                  Descargar App
                </StarBorder>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  className="md:hidden p-2 text-white hover:text-purple-400 transition-colors"
                  aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                  aria-expanded={mobileMenuOpen}
                >
                  {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
                </button>
              </motion.div>
            </motion.div>

            {/* Mobile Navigation */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.nav
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="md:hidden overflow-hidden border-t border-white/10"
                  style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)' }}
                >
                  <ul className="flex flex-col py-3 px-4 gap-1">
                    {navLinks.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          onClick={closeMobileMenu}
                          className="block font-bold text-white text-sm py-2.5 px-2 rounded-lg hover:bg-white/10 hover:text-purple-400 transition-colors"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.nav>
              )}
            </AnimatePresence>

            {/* Bottom border gradient */}
            {isScrolled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[1px] bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0"
              />
            )}
          </motion.div>
        </motion.div>
      </motion.header>

      {/* Spacer para evitar que el contenido se superponga */}
      <div className="h-16 sm:h-20 md:h-24 lg:h-28" />
    </>
  );
};

export default HeaderDynamic;
