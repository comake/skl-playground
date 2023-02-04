import { RDFS, Entity } from '@comake/skl-js-engine';
import React from "react";
import SchemaNavItem from './SchemaNavItem';

export type SchemaSectionProps = {
  name: string;
  subSections?: SchemaSectionProps[];
  schemas?: Entity[];
}

function SchemaSection({ name, schemas, subSections }: SchemaSectionProps) {
  const [open, setOpen] = React.useState(false);
  const toggleOpen = React.useCallback(() => setOpen(!open), [open]);

  const sortedSchemas = React.useMemo<Entity[]>(() => {
    if (schemas) {
      return schemas.sort((aSchema, bSchema) => {
        const aName = aSchema[RDFS.label] as string || aSchema['@id'];
        const bName = bSchema[RDFS.label] as string || bSchema['@id'];
        return aName.localeCompare(bName);
      });
    }
    return [];
  }, [schemas]);

  return (
    <div className={`Schema-Section ${open ? 'open' : ''}`}>
      <div className='Schema-Section-Header Centered' onClick={toggleOpen}>
        <div className={['Schema-Section-Arrow', open ? 'Rotated' : ''].join(' ')}>›</div>
        <div className='Schema-Section-Name'>{ name }</div>
      </div>
      { subSections && subSections.map((section) => (
        <SchemaSection {...section} />
      ))}
      { sortedSchemas.map((schema) => (
        <SchemaNavItem key={schema['@id']} schema={schema} />
      ))}
    </div>
  );
}

export default SchemaSection;
