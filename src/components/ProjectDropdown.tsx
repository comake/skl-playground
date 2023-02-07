import { useContext } from 'react';
import ProjectContext from '../contexts/ProjectContext';
import Dropdown from './Dropdown';
import { ReactComponent as EllipsisIcon } from '../images/ellipsis.svg';
import ProjectButton from './ProjectButton';

function ProjectDropdown() {
  const { projects, setSelectedProjectId } = useContext(ProjectContext);

  const buttonContents = <>
    <div className='Project-Header-Button'><EllipsisIcon className='Ellipsis-Icon'/></div>
  </>
  
  return (
    <Dropdown
      additionalClasses='Project-Dropdown'
      buttonContents={buttonContents}
    >
      <div className='Project-Dropdown-Contents'>
        <div className='Project-Dropdown-Header'>Switch Projects</div>
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