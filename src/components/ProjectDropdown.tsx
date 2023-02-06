import { useContext } from 'react';
import ProjectContext from '../contexts/ProjectContext';
import Dropdown from './Dropdown';
import { ReactComponent as ArrowIcon } from '../images/down-arrow.svg';
import ProjectButton from './ProjectButton';

function ProjectDropdown() {
  const { selectedProject, projects, setSelectedProjectId } = useContext(ProjectContext);

  const buttonContents = <>
    <div className='Project-Name'>{selectedProject.name}</div>
    <ArrowIcon className='Down-Arrow-Icon'/>
  </>
  
  return (
    <Dropdown
    additionalClasses='Project-Dropdown'
      buttonContents={buttonContents}
    >
      <div className='Project-Dropdown-Contents'>
        <div className='Project-Dropdown-Header'>Example Projects</div>
        { projects.map((project) => (
          <ProjectButton 
            key={project.name} 
            project={project} 
            selectProject={setSelectedProjectId} 
          />
        ))}
      </div>
    </Dropdown>
  )
}

export default ProjectDropdown;