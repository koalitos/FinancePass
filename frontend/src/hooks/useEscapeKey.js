import { useEffect } from 'react';

/**
 * Hook para fechar modal/componente ao pressionar ESC
 * @param {Function} onEscape - Função a ser executada ao pressionar ESC
 * @param {boolean} isActive - Se o hook deve estar ativo (default: true)
 */
export const useEscapeKey = (onEscape, isActive = true) => {
  useEffect(() => {
    if (!isActive) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onEscape();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onEscape, isActive]);
};

export default useEscapeKey;
