import { Link } from 'react-router-dom';
import { motion, useTransform } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const HeaderDynamic = ({ poliredPosition = { x: 0, y: 0, opacity: 0 } }) => {
  const { scrollY, isScrolled } = useScrollAnimation(100);

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
      <motion.header className="fixed top-0 left-0 right-0 z-40">
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
              className="flex flex-col sm:flex-row justify-between items-center gap-4"
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

              {/* Navigation Links */}
              <motion.div className="hidden sm:flex items-center justify-center">
                <ul className="flex gap-4 md:gap-6 lg:gap-8 justify-center flex-wrap">
                  <li>
                    <a
                      href="#about"
                      className="font-bold text-white text-xs sm:text-sm md:text-base hover:text-purple-400 transition-colors duration-200"
                    >
                      Sobre nosotros
                    </a>
                  </li>
                  <li>
                    <a
                      href="#servicios"
                      className="font-bold text-white text-xs sm:text-sm md:text-base hover:text-purple-400 transition-colors duration-200"
                    >
                      Servicios
                    </a>
                  </li>
                </ul>
              </motion.div>

              {/* Admin Button */}
              <motion.div className="flex gap-2">
                <a href="/login">
                  <button className="bg-none hover:bg-purple-700 text-xs sm:text-sm text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:scale-105 transition-all duration-300 shadow-md font-semibold">
                    Administración
                  </button>
                </a>
              </motion.div>
            </motion.div>

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
