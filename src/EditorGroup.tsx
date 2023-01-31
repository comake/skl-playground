import { useCallback, useContext, useMemo } from 'react';
import SchemaContext from './contexts/SchemaContext';
import SchemaEditor from './SchemaEditor';
import SchemaTab from './SchemaTab';

function EditorGroup() {
  const { schemas, coreSchemas, selectedSchema, openSchemas } = useContext(SchemaContext);

  const selectedSchemaContent = useMemo(() => {
    if (selectedSchema && selectedSchema in schemas) {
      return schemas[selectedSchema];
    }
    if (selectedSchema && selectedSchema in coreSchemas) {
      return coreSchemas[selectedSchema];
    }
  }, [coreSchemas, schemas, selectedSchema]);

  const onSchemaEditorChange = useCallback(() => {
    
  }, []);

  const displayedOpenSchemas = useMemo(() => {
    if (selectedSchema && !openSchemas.includes(selectedSchema)) {
      return [ ...openSchemas, selectedSchema ];
    }
    return openSchemas;
  }, [selectedSchema, openSchemas]);
  

  return (
    <div className='Editor-Group'>
      { displayedOpenSchemas.length > 0 && (
        <div className='Editor-Group-Tabs'>
          { displayedOpenSchemas.map((schema) => {
            return <SchemaTab key={schema} schema={schema} />
          })}
          <div className='Flex-Spacer'></div>
        </div>
      )}
      <div className='Editor'>
        { selectedSchema && <SchemaEditor 
            key={selectedSchema}
            schema={selectedSchemaContent} 
            onChange={onSchemaEditorChange} 
          />
        }
      </div>
    </div>
  )
}

export default EditorGroup;