import { createContext } from 'react';
import { Project } from '../PreloadedProjects';

interface ProjectContextType {
  selectedProject: Project;
  projects: Project[];
  setSelectedProjectId: (id: string) => void;
  createNewProject: () => void;
  insertProject: (project: Project) => void;
}

const ProjectContext = createContext<ProjectContextType>({ 
  selectedProject: { 
    id: 'exmaple', 
    name: 'Example', 
    schemas: {},
    loaded: true,
  }, 
  projects: [],
  setSelectedProjectId: (id: string) => {},
  createNewProject: () => {},
  insertProject: () => {},
});

export default ProjectContext;