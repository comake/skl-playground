import { RDFS } from '@comake/skl-js-engine';
import { useCallback, useContext, useMemo } from 'react';
import SchemaContext from '../contexts/SchemaContext';
import { ClickEvent } from '../util/Types';
import CloseButton from './CloseButton';

export interface SchemaTabProps {
  schema: string;
  saved: boolean;
}

function SchemaTab({ schema, saved }: SchemaTabProps) {
  const { schemas, coreSchemas, selectedSchema, setSelectedSchema, openSchemas, setOpenSchemas } = useContext(SchemaContext);

  const schemaContent = useMemo(() => {
    if (schema in schemas) {
      return schemas[schema];
    }
    if (schema in coreSchemas) {
      return coreSchemas[schema];
    }
  }, [coreSchemas, schema, schemas]);

  const classes = useMemo(() => {
    const isOpen = openSchemas.includes(schema);
    const isSelected = selectedSchema === schema;
    return [
      'Schema-Tab',
      'Centered', 
      saved ? '' : 'unsaved',
      isSelected ? 'selected' : '',
      isOpen ? '' : 'not-open'
    ].join(' '); 
  }, [openSchemas, schema, selectedSchema, saved]);

  const setSchemaToSelected = useCallback(() => {
    setSelectedSchema(schema)
  }, [schema, setSelectedSchema]);
  const openSchema = useCallback(() => {
    if (!openSchemas.includes(schema)) {
      setOpenSchemas([ ...openSchemas, schema ]);
    }
  }, [schema, openSchemas, setOpenSchemas]);

  const closeSchema = useCallback((event: ClickEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const indexInOpen = openSchemas.indexOf(schema);
    const isOpen = indexInOpen !== -1;
    const isSelected = selectedSchema && schema === selectedSchema;
    setOpenSchemas(openSchemas.filter(openSchema => openSchema !== schema));
    if (isSelected) {
      if (isOpen && openSchemas.length > 1) {
        if (indexInOpen === 0) {
          setSelectedSchema(openSchemas[1]);
        } else {
          setSelectedSchema(openSchemas[indexInOpen - 1]);
        }
      } else if (!isOpen && openSchemas.length > 0) {
        setSelectedSchema(openSchemas[openSchemas.length - 1])
      } else {
        setSelectedSchema(undefined);
      }
    }
  }, [setOpenSchemas, openSchemas, selectedSchema, schema, setSelectedSchema]);

  return (
    <div 
      onDoubleClick={openSchema}
      onClick={setSchemaToSelected}
      className={classes}>
        <div className='Schema-Tab-Name'>
          {schemaContent 
            ? schemaContent[RDFS.label] as string || schemaContent['@id']
            : 'Not Found'
          }  
        </div>
        <CloseButton onClick={closeSchema} />
    </div>
  )
}

export default SchemaTab;