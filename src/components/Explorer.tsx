import { useContext } from 'react';
import SchemaContext from '../contexts/SchemaContext';
import SchemaSection from './SchemaSection';

function Explorer() {
  const { schemas, coreSchemas } = useContext(SchemaContext);

  return (
    <div className='Explorer'>
      <SchemaSection
        sectionName={'Core Schemas'}
        schemas={Object.values(coreSchemas)}
      />
      <SchemaSection
        sectionName={'Schemas'}
        schemas={Object.values(schemas)}
      />
    </div>
  )
}

export default Explorer;