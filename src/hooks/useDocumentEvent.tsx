import { useEffect } from 'react';

function useDocumentEvent<T extends keyof DocumentEventMap>(
  effect: T, 
  conditional: boolean, 
  callback: (event: DocumentEventMap[T]) => void, 
  capture=false
) {
  return useEffect(() => {
    if (conditional) {
      document.addEventListener(effect, callback, capture)

      return () => {
        document.removeEventListener(effect, callback, capture)
      }
    }
  }, [conditional, callback, effect, capture])
}

export default useDocumentEvent;