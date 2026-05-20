import { useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Custom hook para detectar posición del scroll y estado del header
 * @param {number} threshold - Altura en pixels para activar cambios de estilo
 * @returns {Object} { scrollY: MotionValue, isScrolled: boolean, scrollProgress: number }
 */
export const useScrollAnimation = (threshold = 100) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useMotionValueEvent(scrollY, 'change', (current) => {
    setIsScrolled(current > threshold);
    // Calcular progreso de 0 a 1 para animaciones suave proporcionales al scroll
    const progress = Math.min(current / threshold, 1);
    setScrollProgress(progress);
  });

  return { scrollY, isScrolled, scrollProgress };
};

export default useScrollAnimation;
