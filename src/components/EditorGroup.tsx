import { Entity } from '@comake/skl-js-engine';
import { useCallback, useContext, useMemo, useState } from 'react';
import SchemaContext from '../contexts/SchemaContext';
import useDocumentEvent from '../hooks/useDocumentEvent';
import CodeEditor from './CodeEditor';
import SchemaTab from './SchemaTab';

function EditorGroup() {
  const { schemas, coreSchemas, selectedSchema, openSchemas, setSchemas } = useContext(SchemaContext);
  const [unsavedSchemas, setUnsavedSchemas] = useState<Record<string, string>>({});

  const selectedSchemaIsCore = useMemo(() => selectedSchema && selectedSchema in coreSchemas, [selectedSchema, coreSchemas]);

  const savedSelectedSchemaContent = useMemo(() => {
    let content: Entity | undefined;
    if (selectedSchema && selectedSchema in schemas) {
      content = schemas[selectedSchema];
    }
    if (selectedSchema && selectedSchema in coreSchemas) {
      content = coreSchemas[selectedSchema];
    }
    if (content) {
      return JSON.stringify(content, null, 2);
    }
  }, [coreSchemas, schemas, selectedSchema]);

  useDocumentEvent('keydown', true, (event: KeyboardEvent) => {
    if (event.metaKey && event.key === 's') {
      event.stopPropagation();
      event.preventDefault();
      if (selectedSchema && selectedSchema in unsavedSchemas) {
        try {
          const newSchema = JSON.parse(unsavedSchemas[selectedSchema]);
          setSchemas({
            schemas: { ...schemas, [selectedSchema]: newSchema }, 
            coreSchemas 
          });
          const { [selectedSchema]: schema, ...newUnsavedSchemas } = unsavedSchemas;
          setUnsavedSchemas(newUnsavedSchemas);
        } catch (error: unknown) {
          alert('This schema cannot be saved due to syntax error.')
        }
      }
    }
  }, true);

  const displayedOpenSchemas = useMemo(() => {
    if (selectedSchema && !openSchemas.includes(selectedSchema)) {
      return [ ...openSchemas, selectedSchema ];
    }
    return openSchemas;
  }, [selectedSchema, openSchemas]);

  const updateUnsavedSchemaValue = useCallback((content: string) => {
    if (selectedSchema) {
      let savedContent: Entity | undefined;
      if (selectedSchema && selectedSchema in schemas) {
        savedContent = schemas[selectedSchema];
      }
      if (selectedSchema && selectedSchema in coreSchemas) {
        savedContent = coreSchemas[selectedSchema];
      }
      if (savedContent) {
        const savedContentAsString = JSON.stringify(savedContent, null, 2);
        if (savedContentAsString !== content) {
          setUnsavedSchemas((unsavedSchemas) => ({ ...unsavedSchemas, [selectedSchema!]: content }));
        } else {
          const { [selectedSchema]: schema, ...newUnsavedSchemas } = unsavedSchemas;
          setUnsavedSchemas(newUnsavedSchemas);
        }
      }
    }
  }, [coreSchemas, schemas, selectedSchema, unsavedSchemas]);

  return (
    <div className='Editor-Group'>
      { displayedOpenSchemas.length > 0 && (
        <div className='Editor-Group-Tabs'>
          { displayedOpenSchemas.map((schema) => (
            <SchemaTab key={schema} schema={schema} saved={!(schema in unsavedSchemas)} />
          ))}
          <div className='Flex-Spacer'></div>
        </div>
      )}
      { selectedSchema && selectedSchemaIsCore && (
        <div className='Schema-Editor-Toolbar Centered'>
          <div className='Core-Schema-Warning'>
            This schema is part of the Core SKL Ontology. We recommend you do not edit it. 
          </div>
        </div> 
      )}
      <div className='Editor'>
        { selectedSchema &&
          <CodeEditor 
            key={selectedSchema}
            classes={`Schema-Editor`}
            locked={!selectedSchemaIsCore}
            code={unsavedSchemas[selectedSchema] ?? savedSelectedSchemaContent} 
            onChange={updateUnsavedSchemaValue} 
          />
        }
      </div>
    </div>
  )
}

export default EditorGroup;