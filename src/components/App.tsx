import { useEffect, useMemo, useState } from 'react';
import '../css/App.css';
import Header from './Header';
import AppBody from './AppBody';
import ThemeContext from '../contexts/ThemeContext';
import ResultContext from '../contexts/ResultContext';
import SchemaContext from '../contexts/SchemaContext';
import { keyOnId, loadCoreSchemas, loadSchemasForProject } from '../util/SchemaHelpers';
import { Entity } from '@comake/skl-js-engine';
import { preloadedProjects, Project } from '../PreloadedProjects';
import ProjectContext from '../contexts/ProjectContext';

function App() { 
  const [projects, setProjects] = useState<Record<string, Project>>(keyOnId(preloadedProjects));
  const [selectedProjectId, setSelectedProjectId] = useState(preloadedProjects[0].id);
  const [prevSelectedProjectId, setPrevSelectedProjectId] = useState<string>();
  const [theme, setTheme] = useState('dark');
  const [schemas, setSchemas] = useState<Record<string, Entity>>({});
  const [coreSchemas, setCoreSchemas] = useState<Record<string, Entity>>({});
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
    () => ({ schemas, coreSchemas, setSchemas, setCoreSchemas, selectedSchema, setSelectedSchema, openSchemas, setOpenSchemas }), 
    [ schemas, coreSchemas, setSchemas, setCoreSchemas, selectedSchema, setSelectedSchema, openSchemas, setOpenSchemas ],
  );

  const projectContext = useMemo(
    () => ({ 
      selectedProject: projects[selectedProjectId],
      setSelectedProjectId,
      projects: Object.values(projects),
     }), 
    [setSelectedProjectId, projects, selectedProjectId]
  );

  useEffect(() => {
    async function loadAndSetCoreSchemas() {
      const coreSchemas = await loadCoreSchemas();
      setCoreSchemas(coreSchemas);
    }
    loadAndSetCoreSchemas();
  }, []);

  useEffect(() => {
    async function loadAndSetSchemasForProject(projectId: string) {
      const project = projects[projectId];
      let projectSchemas: Record<string, Entity>;
      if (project.loaded) {
        projectSchemas = project.schemas;
      } else {
        projectSchemas = await loadSchemasForProject(project, coreSchemas);
        setProjects((projects) => ({ 
          ...projects, 
          [projectId]: {
            ...project,
            schemas: projectSchemas,
            loaded: true
          }
        }))
      }
      setSchemas(projectSchemas);
    }

    if (Object.keys(coreSchemas).length > 0) {
      if (selectedProjectId !== prevSelectedProjectId) {
        setPrevSelectedProjectId(selectedProjectId);
        // Save previous project schema edits
        if (prevSelectedProjectId) {
          setProjects((projects) => ({ 
            ...projects, 
            [selectedProjectId]: {
              ...projects[selectedProjectId],
              schemas,
              loaded: true
            }
          }))
        }
        setResult(undefined);
        setSelectedSchema(undefined);
        setOpenSchemas([]);
        loadAndSetSchemasForProject(selectedProjectId);
      }
    }
  }, [coreSchemas, prevSelectedProjectId, projects, schemas, selectedProjectId]);

  return (
    <ProjectContext.Provider value={projectContext}>
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
    </ProjectContext.Provider>
  )
}

export default App;