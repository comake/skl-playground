import { createContext } from 'react';

const ThemeContext = createContext({ 
  theme: 'dark', 
  setTheme: (theme: string) => {},
});

export default ThemeContext;