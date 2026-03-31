import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que intercepta los cambios de ruta y fuerza el navegador
 * a volver a la posición Y=0, X=0, comportándose como una web tradicional.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Restaurar siempre la pantalla hasta el tope en cada transición
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Usamos instant para evitar mareo en pantallas móviles largas
    });
  }, [pathname]);

  return null;
}
