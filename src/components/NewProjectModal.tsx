import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import ProjectContext from '../contexts/ProjectContext';
import useDocumentEvent from '../hooks/useDocumentEvent';
import { InputElementEvent } from '../util/Types';
import Modal from './Modal'

export interface NewProjectModalProps {
  close: () => void;
}

function NewProjectModal({ close }: NewProjectModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const { insertProject, projects, setSelectedProjectId } = useContext(ProjectContext);
  const [error, setError] = useState<string>();

  const onNameChange = useCallback((event: InputElementEvent) => {
    setName(event.currentTarget.value);
    setError(undefined);
  }, []);

  const createProject = useCallback(() => {
    if (name.length > 0) {
      if (projects.some(project => project.name === name)) {
        setError('A project with this name already exists');
      } else {
        insertProject({
          id: name,
          name,
          description: 'My custom project',
          loaded: true,
          schemas: {}
        });
        setSelectedProjectId(name);
        close();
      }
    }
  }, [close, insertProject, name, projects, setSelectedProjectId]);

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter' && name.length > 0) {
      createProject();
    }
  }, [createProject, name.length]);

  useDocumentEvent('keydown', true, onKeyDown);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Modal
      header={'Create a new Project'}
      additionalClasses={'New-Project-Modal'}
      close={close}
    >
      <div className={'Input-Wrapper'}>
        <input
          ref={inputRef}
          type={'text'}
          value={name}
          onChange={onNameChange}
          placeholder={'Project Name'}
        />
      </div>
      <div className='Modal-Footer'>
        { error && <div className='Modal-Error Error'>{error}</div>}
        <div className='Flex-Spacer'></div>
        <button 
          className='CTA-Button Create-Project-Button' 
          disabled={name.length === 0} 
          onClick={createProject}
        >
          Create
        </button>
      </div>
    </Modal>
  )
}

export default NewProjectModal;