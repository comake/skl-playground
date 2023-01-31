import { useCallback, useEffect, useRef, useState } from 'react';
import useWindowEvent from './useWindowEvent';

function getWindowDimensions() {
  return { height: window.innerHeight, width: window.innerWidth }
}

const useWindowSize = (listen=true, timeoutDuration=0) => {
  const [windowSize, setWindowSize] = useState(getWindowDimensions())
  const resizeTimeout = useRef<ReturnType<typeof setTimeout>>();

  const resize = useCallback(() => {
    if (resizeTimeout.current) { clearTimeout(resizeTimeout.current) }

    if (timeoutDuration === 0) {
      setWindowSize(getWindowDimensions())
    } else {
      resizeTimeout.current = setTimeout(() => setWindowSize(getWindowDimensions()), timeoutDuration);
    }
  }, [timeoutDuration])

  useEffect(() => {
    if (listen) {
      setWindowSize(getWindowDimensions())
    }
  }, [listen])

  useWindowEvent('resize', listen, resize)

  return windowSize
}

export default useWindowSize;