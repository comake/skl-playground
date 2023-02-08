import { useContext, useMemo } from 'react';
import ProjectContext from '../contexts/ProjectContext';
import SchemaContext from '../contexts/SchemaContext';
import ProjectDropdown from './ProjectDropdown';
import SchemaSection from './SchemaSection';
import NewSchemaButton from './NewSchemaButton';
import { schemasBySection } from '../util/SchemaHelpers';

function Explorer() {
  const { schemas, coreSchemas } = useContext(SchemaContext);
  const { selectedProject } = useContext(ProjectContext);

  const schemaSections = useMemo(() => schemasBySection(schemas), [schemas]);

  return (
    <div className='Explorer'>
      <div className='Project-Header Centered'>
        <div className='Project-Name'>{selectedProject.name}</div>
        <NewSchemaButton />
        <ProjectDropdown />
      </div>
      <div className='Tree-View'>
        <SchemaSection
          isCore
          name={'Core Schemas'}
          schemas={Object.values(coreSchemas)}
        />
        <SchemaSection
          name={'Schemas'}
          subSections={schemaSections}
        />
      </div>
    </div>
  )
}

export default Explorer;