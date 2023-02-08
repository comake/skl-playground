import { Entity } from '@comake/skl-js-engine';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import SchemaContext from '../contexts/SchemaContext';
import useDocumentEvent from '../hooks/useDocumentEvent';
import CodeEditor from './CodeEditor';
import SchemaTab from './SchemaTab';
import { ReactComponent as SklIcon } from '../images/standard-knowledge-language.svg';

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

  const saveSchema = useCallback(() => {
    if (selectedSchema && selectedSchema in unsavedSchemas) {
      try {
        const newSchema = JSON.parse(unsavedSchemas[selectedSchema]);
        setSchemas({ ...schemas, [selectedSchema]: newSchema });
        const { [selectedSchema]: schema, ...newUnsavedSchemas } = unsavedSchemas;
        setUnsavedSchemas(newUnsavedSchemas);
      } catch (error: unknown) {
        alert('This schema cannot be saved due to syntax error.')
      }
    }
  }, [schemas, selectedSchema, setSchemas, unsavedSchemas]);

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.metaKey && event.key === 's') {
      event.stopPropagation();
      event.preventDefault();
      saveSchema();
    }
  }, [saveSchema]);

  useDocumentEvent('keydown', true, onKeyDown, true);

  const displayedOpenSchemas = useMemo(() => {
    if (selectedSchema && !openSchemas.includes(selectedSchema)) {
      return [ ...openSchemas, selectedSchema ];
    }
    return openSchemas;
  }, [selectedSchema, openSchemas]);

  const updateUnsavedSchemaValue = useCallback((content: string) => {
    if (selectedSchema) {
      setUnsavedSchemas((unsavedSchemas) => ({ ...unsavedSchemas, [selectedSchema!]: content }));
    }
  }, [selectedSchema]);

  useEffect(() => {
    if (selectedSchema && selectedSchema in unsavedSchemas) {
      let savedContent: Entity | undefined;
      if (selectedSchema && selectedSchema in schemas) {
        savedContent = schemas[selectedSchema];
      }
      if (selectedSchema && selectedSchema in coreSchemas) {
        savedContent = coreSchemas[selectedSchema];
      }
      if (savedContent) {
        const savedContentAsString = JSON.stringify(savedContent, null, 2);
        if (savedContentAsString === unsavedSchemas[selectedSchema]) {
          const { [selectedSchema]: schema, ...newUnsavedSchemas } = unsavedSchemas;
          setUnsavedSchemas(newUnsavedSchemas);
        }
      }
    }
  }, [unsavedSchemas, selectedSchema, schemas, coreSchemas]);

  return (
    <div className='Editor-Group'>
      { displayedOpenSchemas.length > 0 && (
        <div className='Editor-Group-Tabs'>
          { displayedOpenSchemas.map((schema) => (
            <SchemaTab 
              key={schema} 
              schema={schema} 
              saved={!(schema in unsavedSchemas)}
            />
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
        { !selectedSchema && (
          <div className='Editor-Background'>
            <SklIcon />
          </div>
        )}
      </div>
    </div>
  )
}

export default EditorGroup;