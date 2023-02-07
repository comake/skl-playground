import { RDFS, Entity } from '@comake/skl-js-engine';
import React from "react";
import SchemaListItem from './SchemaListItem';

export type SchemaSectionProps = {
  name: string;
  subSections?: SchemaSectionProps[];
  schemas?: Entity[];
  isCore?: boolean;
}

function SchemaSection({ name, schemas, subSections, isCore }: SchemaSectionProps) {
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
        <SchemaSection key={section.name} {...section} isCore={isCore} />
      ))}
      { sortedSchemas.map((schema) => (
        <SchemaListItem editingDisabled={isCore} key={schema['@id']} schema={schema} />
      ))}
    </div>
  );
}

export default SchemaSection;
