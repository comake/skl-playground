import { useCallback, useContext } from 'react';
import ProjectContext from '../contexts/ProjectContext';
import Dropdown from './Dropdown';
import { ReactComponent as EllipsisIcon } from '../images/ellipsis.svg';
import ProjectButton from './ProjectButton';
import SchemaContext from '../contexts/SchemaContext';

function ProjectDropdown() {
  const { exportSchemas } = useContext(SchemaContext);
  const { projects, setSelectedProjectId, createNewProject } = useContext(ProjectContext);

  const buttonContents = (
    <div className='Project-Header-Button'>
      <EllipsisIcon className='Ellipsis-Icon'/>
    </div>
  );
  
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
        <button className='Dropdown-Option' onClick={exportSchemas}>
          Export Schemas
        </button>
        <div className='Dropdown-Line'></div>
        <a 
          className='Dropdown-Option'
          target='_blank' 
          href='https://docs.standardknowledge.com' 
          rel='noreferrer'
        >
          View the documentation
        </a>
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
          href={'https://github.com/comake/skl-playground'}
          target='_blank'
          rel='noreferrer'
        >
          Contribute to the playground
        </a>
        <a 
          className='Dropdown-Option'
          target='_blank' 
          href='https://discord.gg/stvfSB8kpG?ref=https://play.standardknowledge.com' 
          rel='noreferrer'
        >
          Chat with us on Discord
        </a>
      </div>
    </Dropdown>
  )
}

export default ProjectDropdown;