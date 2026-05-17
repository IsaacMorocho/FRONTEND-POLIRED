import { useEffect } from 'react';

/**
 * Hook personalizado para habilitar scroll suave en toda la página
 * Uso: simplemente llama a useSmoothScroll() en cualquier componente
 * 
 * Ejemplo:
 * function MyPage() {
 *   useSmoothScroll();
 *   return <div>...</div>;
 * }
 */
const useSmoothScroll = () => {
  useEffect(() => {
    // Aplicar scroll suave al elemento raíz
    document.documentElement.style.scrollBehavior = 'smooth';

    // Limpiar al desmontar (opcional)
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);
};

export default useSmoothScroll;
