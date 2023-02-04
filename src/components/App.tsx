import { useEffect, useMemo, useState } from 'react';
import '../css/App.css';
import Header from './Header';
import AppBody from './AppBody';
import ThemeContext from '../contexts/ThemeContext';
import ResultContext from '../contexts/ResultContext';
import SchemaContext from '../contexts/SchemaContext';
import { loadSchemaSet, SCHEMA_SETS } from '../util/SchemaHelpers';

function App() { 
  const [theme, setTheme] = useState('dark');
  const [{ schemas, coreSchemas }, setSchemas] = useState<{
    coreSchemas: {},
    schemas: {},
  }>({ coreSchemas: {}, schemas: {} });
  const [selectedSchema, setSelectedSchema] = useState<string>();
  const [openSchemas, setOpenSchemas] = useState<string[]>([]);
  const [result, setResult] = useState<string>();
  const [loadingResult, setLoadingResult] = useState(false);

  const themeContext = useMemo(
    () => ({ theme, setTheme }), 
    [ theme, setTheme ],
  );

  const resultContext = useMemo(
    () => ({ result, setResult, loadingResult, setLoadingResult }), 
    [ result, setResult, loadingResult, setLoadingResult ],
  );

  const schemaContext = useMemo(
    () => ({ schemas, coreSchemas, setSchemas, selectedSchema, setSelectedSchema, openSchemas, setOpenSchemas }), 
    [ schemas, coreSchemas, setSchemas, selectedSchema, setSelectedSchema, openSchemas, setOpenSchemas ],
  );

  useEffect(() => {
    async function loadDefaultSchemas() {
      const { schemas, coreSchemas } = await loadSchemaSet(SCHEMA_SETS.files);
      setSchemas({ schemas, coreSchemas });
    }
    loadDefaultSchemas();
  }, []);

  return (
    <SchemaContext.Provider value={schemaContext}>
      <ResultContext.Provider value={resultContext}>
        <ThemeContext.Provider value={themeContext}>
          <div className={`App ${theme}`}>
            <Header />
            <AppBody />
          </div>
        </ThemeContext.Provider>
      </ResultContext.Provider>
    </SchemaContext.Provider>
  )
}

export default App;