import { useEffect } from 'react';

function useWindowEvent(effect: string, conditional: boolean, callback: () => void) {
  return useEffect(() => {
    if (conditional) {
      window.addEventListener(effect, callback)
    }

    return () => {
      if (conditional) {
        window.removeEventListener(effect, callback)
      }
    }
  }, [conditional, callback, effect])
}

export default useWindowEvent;