import { Entity, RDFS } from '@comake/skl-js-engine';
import { useCallback, useContext, useMemo, useState, useRef, MouseEvent as ReactMouseEvent } from "react";
import SchemaContext from '../contexts/SchemaContext';
import useDocumentEvent from '../hooks/useDocumentEvent';
import { ClickLocation } from '../util/Types';
import ContextMenu from './ContextMenu';

export interface SchemaListItemProps {
  schema: Entity;
  editingDisabled?: boolean;
}

function SchemaListItem({ schema, editingDisabled }: SchemaListItemProps) {
  const { 
    setSelectedSchema, 
    selectedSchema, 
    setOpenSchemas, 
    openSchemas, 
    setSchemas, 
    schemas,
  } = useContext(SchemaContext);
  const isSelected = useMemo(() => (selectedSchema === schema['@id']), [selectedSchema, schema]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [contextMenuLocation, setContextMenuLocation] = useState<ClickLocation>();
  const closeContextMenu = useCallback((event: MouseEvent) => {
    if (event.target && 
      event.target !== containerRef.current && 
      !containerRef.current?.contains(event.target as Node)
    ) {
      setContextMenuLocation(undefined);
    }
  }, []);
  useDocumentEvent('click', contextMenuLocation !== undefined, closeContextMenu)
  useDocumentEvent('contextmenu', contextMenuLocation !== undefined, closeContextMenu)

  const name = useMemo(() => {
    return schema[RDFS.label] as string || schema['@id'];
  }, [schema]);

  const selectSchema = useCallback((event: ReactMouseEvent) => {
    if (containerRef.current && containerRef.current.contains(event.target as Node)) {
      setSelectedSchema(schema['@id']);
    }
  }, [schema, setSelectedSchema]);

  const openSchema = useCallback(() => {
    if (!openSchemas.includes(schema['@id'])) {
      setOpenSchemas([ ...openSchemas, schema['@id'] ]);
    }
  }, [schema, openSchemas, setOpenSchemas]);

  const closeSchema = useCallback(() => {
    const indexInOpen = openSchemas.indexOf(schema['@id']);
    const isOpen = indexInOpen !== -1;
    setOpenSchemas(openSchemas.filter(openSchema => openSchema !== schema['@id']));
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
  }, [openSchemas, schema, isSelected, setOpenSchemas, setSelectedSchema]);

  const deleteSchema = useCallback(() => {
    const deleteConfirmation = window.confirm('Are you sure you want to delete this schema?');
    if (deleteConfirmation) {
      const { [schema['@id']]: schemaContents, ...otherSchemas } = schemas;
      closeSchema();
      setSchemas(otherSchemas);
    }
  }, [schema, schemas, closeSchema, setSchemas]);

  const onContextMenu = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setContextMenuLocation({ x: event.clientX, y: event.clientY });
  }, []);

  const classes = useMemo(() => [
      'Schema-List-Item', 
      isSelected ? 'Selected' : '',
      contextMenuLocation ? 'Context-Menu' : '',
    ].join(' '), 
    [isSelected, contextMenuLocation]
  );

  return (
    <div
      ref={containerRef}
      title={name}
      className={classes}
      onClick={selectSchema}
      onDoubleClick={openSchema}
      onContextMenu={onContextMenu}>
        {name}
        { contextMenuLocation && (
          <ContextMenu location={contextMenuLocation}>
            <div className='Context-Menu-Item' onClick={openSchema}>Open</div>
            { !editingDisabled && <div className='Context-Menu-Item Red-Context-Menu-Item' onClick={deleteSchema}>Delete</div> }
          </ContextMenu>
        )}
    </div>
  );
}

export default SchemaListItem;
