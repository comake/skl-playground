import { Entity, RDFS } from '@comake/skql-js-engine';
import React, { useCallback, useContext, useMemo } from "react";
import SchemaContext from './contexts/SchemaContext';

export interface SchemaNavItemProps {
  schema: Entity;
}

function SchemaNavItem({ schema }: SchemaNavItemProps) {
  const { setSelectedSchema, selectedSchema, setOpenSchemas, openSchemas } = useContext(SchemaContext);

  const name = React.useMemo(() => {
    return schema[RDFS.label] as string || schema['@id'];
  }, [schema]);

  const setSchemaToSelected = useCallback(() => setSelectedSchema(schema['@id']), [schema, setSelectedSchema]);
  const isSelected = useMemo(() => (selectedSchema === schema['@id']), [selectedSchema, schema]);
  const classes = useMemo(() => ['Schema-Nav-Item', isSelected ? 'Selected' : '' ].join(' '), [isSelected]);

  const openSchema = useCallback(() => {
    if (!openSchemas.includes(schema['@id'])) {
      setOpenSchemas([ ...openSchemas, schema['@id'] ]);
    }
  }, [schema, openSchemas, setOpenSchemas]);

  return (
    <div
      title={name}
      className={classes}
      onClick={setSchemaToSelected}
      onDoubleClick={openSchema}>
        {name}
    </div>
  );
}

export default SchemaNavItem;
