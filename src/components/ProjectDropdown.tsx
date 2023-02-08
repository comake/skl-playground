import { useContext } from 'react';
import ProjectContext from '../contexts/ProjectContext';
import Dropdown from './Dropdown';
import { ReactComponent as EllipsisIcon } from '../images/ellipsis.svg';
import ProjectButton from './ProjectButton';

function ProjectDropdown() {
  const { projects, setSelectedProjectId, createNewProject } = useContext(ProjectContext);

  const buttonContents = <>
    <div className='Project-Header-Button'><EllipsisIcon className='Ellipsis-Icon'/></div>
  </>
  
  return (
    <Dropdown
      additionalClasses='Project-Dropdown'
      buttonContents={buttonContents}
    >
      <div className='Project-Dropdown-Contents'>
        <div className='Project-Options-Container'>
          <div className='Project-Dropdown-Header'>Switch Projects</div>
          { projects.map((project) => (
            <ProjectButton 
              key={project.name} 
              project={project} 
              selectProject={setSelectedProjectId} 
            />
          ))}
        </div>
        <div className='Dropdown-Line'></div>
        <button className='Dropdown-Option' onClick={createNewProject}>
          Create a new Project
        </button>
        <a 
          className='Dropdown-Option' 
          target='_blank' 
          href='https://github.com/comake/skl-dictionary' 
          rel='noreferrer'
        >
          Contribute Schemas to the SKL Dictionary
        </a>
        <a 
          className='Dropdown-Option'
          target='_blank' 
          href='https://docs.standardknowledge.com' 
          rel='noreferrer'
        >
          View the documentation
        </a>
      </div>
    </Dropdown>
  )
}

export default ProjectDropdown;