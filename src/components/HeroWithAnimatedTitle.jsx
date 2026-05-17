import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import StarBorder from './StarBorder';

/**
 * HeroWithAnimatedTitle: Hero section con animación de "PoliRED" hacia el navbar
 * - "PoliRED" inicia en el título del hero
 * - Al hacer scroll, se anima hacia la posición del navbar
 * - Usa transform para animación suave y eficiente
 * - Retorna la posición para que HeaderDynamic reciba los valores
 */
const HeroWithAnimatedTitle = ({ onPoliredUpdate }) => {
  const { scrollY } = useScroll();
  const containerRef = useRef(null);
  const [containerPosition, setContainerPosition] = useState(null);

  // Transformar scroll a valores de animación
  // De 0 a 350px de scroll, "PoliRED" se mueve de hero a navbar
  // En hero: y: 0, opacity: 1, scale: 1
  // En navbar: y: -220 (altura hasta navbar), opacity: 0, scale: 0.75
  const poliredY = useTransform(scrollY, [0, 350], [0, -220]);
  const heroPoliredOpacity = useTransform(scrollY, [0, 320, 350], [1, 0.3, 0]); // Se desvanece en hero
  const poliredScale = useTransform(scrollY, [0, 350], [1, 0.75]);

  // Escuchar cambios de scroll para actualizar el header
  useMotionValueEvent(scrollY, 'change', (current) => {
    if (current >= 0 && current <= 350) {
      const progress = Math.min(current / 350, 1);
      onPoliredUpdate?.({
        x: 0, // Sin movimiento horizontal
        y: -220 * progress,
        opacity: Math.max(0, Math.min(1, (current - 200) / 150)), // Aparece a partir de 200px
      });
    } else if (current > 350) {
      onPoliredUpdate?.({ x: 0, y: -220, opacity: 1 });
    } else {
      onPoliredUpdate?.({ x: 0, y: 0, opacity: 0 });
    }
  });

  // Obtener posición del container en mount
  const handleAnimationComplete = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerPosition(rect);
    }
  };

  return (
    <main
      ref={containerRef}
      className="relative w-full px-4 sm:px-6 lg:px-12 py-8 md:py-16 flex flex-col lg:flex-row justify-start text-white min-h-[calc(890px-40px)] items-center"
      onAnimationComplete={handleAnimationComplete}
    >
      {/* Left Side - Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-50 w-full lg:w-1/2 ml-[4%] lg:ml-[5%]"
      >
        <h1 className="font-extrabold text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl py-3 md:py-4 leading-tight">
          Conecta, comparte y crece <br /> en la <span className='text-red-500'>EPN</span>{' '}

        </h1>

        <p className="text-base sm:text-lg md:text-xl lg:text-2xl py-4 max-w-2xl">
          Comparte apuntes, chatea, descubre oportunidades y construye tu comunidad.
        </p>

        <div className="flex justify-start items-center gap-6 md:gap-8 mt-8">
          <StarBorder
            as="a"
            href="https://play.google.com/store"
            target="_blank"
            rel="noopener noreferrer"
            color="#14ca32"
            speed="5s"
            thickness={3}
          >
            Descargar App
          </StarBorder>
        </div>
      </motion.div>

      {/* Right Side - Static Phones Image */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="hidden lg:flex w-1/2 items-center justify-end pr-4 xl:pr-12"
      >
        <img
          src="/images/pantallas_polired.png"
          alt="PoliRED Screens"
          className="w-full max-w-full h-auto object-contain"
        />
      </motion.div>
    </main>
  );
};

export default HeroWithAnimatedTitle;
