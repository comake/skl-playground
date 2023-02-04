import { useCallback, useContext } from 'react';
import ThemeContext from '../contexts/ThemeContext';
import { ReactComponent as SunIcon } from '../images/sun.svg';
import { ReactComponent as MoonIcon } from '../images/moon.svg';


function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = useCallback(() => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  }, [setTheme, theme]);
  
  return (
    <button onClick={toggleTheme} className='Theme-Toggle Centered'>
      { theme === 'dark' ? <SunIcon /> : <MoonIcon /> }
    </button>
  )
}

export default ThemeToggle;