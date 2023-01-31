import { RDFS, Entity } from '@comake/skql-js-engine';
import React from "react";
import SchemaNavItem from './SchemaNavItem';

type SchemaSectionProps = {
  sectionName: string;
  schemas: Entity[];
}

function SchemaSection({ sectionName, schemas }: SchemaSectionProps) {
  const [open, setOpen] = React.useState(false);
  const toggleOpen = React.useCallback(() => setOpen(!open), [open]);

  const sortedSchemas = React.useMemo<Entity[]>(() => {
    return schemas.sort((aSchema, bSchema) => {
      const aName = aSchema[RDFS.label] as string || aSchema['@id'];
      const bName = bSchema[RDFS.label] as string || bSchema['@id'];
      return aName.localeCompare(bName);
    })
  }, [schemas])

  return (
    <div className='Schema-Section'>
      <div className='Schema-Section-Header' onClick={toggleOpen}>
        <div className={['Schema-Section-Arrow', open ? 'Rotated' : ''].join(' ')}>›</div>
        <div className='Schema-Section-Name'>{ sectionName }</div>
      </div>
      { open && sortedSchemas.map((schema) => {
        return <SchemaNavItem key={schema['@id']} schema={schema} />;
      })}
    </div>
  );
}

export default SchemaSection;
