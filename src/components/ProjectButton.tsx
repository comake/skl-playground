import { useCallback } from 'react';
import { Project } from '../PreloadedProjects';

export interface ProjectButtonProps {
  project: Project;
  selectProject: (projectId: string) => void
}

function ProjectButton({ project, selectProject }: ProjectButtonProps) {

  const onClick = useCallback(() => {
    selectProject(project.id);
  }, [project.id, selectProject]);

  return (
    <button className='Project-Button' onClick={onClick}>
      <div className='Project-Name'>{project.name}</div>
      <div className='Project-Description'>{project.description}</div>
    </button>
  )
}

export default ProjectButton;