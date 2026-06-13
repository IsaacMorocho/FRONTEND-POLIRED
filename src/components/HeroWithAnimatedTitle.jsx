import { motion } from 'framer-motion';
import StarBorder from './StarBorder';

/**
 * HeroWithAnimatedTitle: Hero section con animación de "PoliRED" hacia el navbar
 * - "PoliRED" inicia en el título del hero
 * - Al hacer scroll, se anima hacia la posición del navbar
 * - Usa transform para animación suave y eficiente
 * - Retorna la posición para que HeaderDynamic reciba los valores
 */
const HeroWithAnimatedTitle = () => {

  return (
    <main
      className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 md:py-12 lg:py-16 flex flex-col lg:flex-row justify-center lg:justify-between text-white min-h-[calc(100vh-100px)] lg:min-h-[calc(100vh-120px)] items-center gap-8 lg:gap-6"
    >
      {/* Left Side - Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full lg:w-1/2 lg:max-w-2xl text-center lg:text-left lg:ml-[2%] xl:ml-[5%]"
      >
        <h1 className="font-extrabold text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl py-2 sm:py-3 md:py-4 leading-tight">
          Conecta, comparte y crece <br className="hidden sm:block" /> en la <span className='text-red-500'>EPN</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl py-3 sm:py-4 max-w-2xl mx-auto lg:mx-0">
          Comparte apuntes, chatea, descubre oportunidades y construye tu comunidad.
        </p>

        <div className="flex justify-center lg:justify-start items-center gap-4 sm:gap-6 md:gap-8 mt-4 sm:mt-6 lg:mt-8">
          <StarBorder
            as="a"
            href="https://play.google.com/store"
            target="_blank"
            rel="noopener noreferrer"
            color="#14ca32"
            speed="5s"
            thickness={3}
            className="w-full sm:w-auto max-w-xs sm:max-w-none"
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
        className="flex w-full sm:w-4/5 md:w-3/5 lg:w-1/2 items-center justify-center lg:justify-end px-2 sm:px-4 lg:pr-4 xl:pr-12"
      >
        <img
          src="/images/pantallas_polired.png"
          alt="PoliRED Screens"
          className="w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-full h-auto object-contain"
        />
      </motion.div>
    </main>
  );
};

export default HeroWithAnimatedTitle;
