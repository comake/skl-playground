import { useContext, useMemo } from 'react';
import ProjectContext from '../contexts/ProjectContext';
import SchemaContext from '../contexts/SchemaContext';
import { OWL, SKL } from '../util/Vocabularies';
import ProjectDropdown from './ProjectDropdown';
import SchemaSection, { SchemaSectionProps } from './SchemaSection';
import NewSchemaButton from './NewSchemaButton';

const SECTIONS = {
  Nouns: 'Nouns',
  Properties: 'Properties',
  Integrations: 'Integrations',
  Verbs: 'Verbs',
  Mappings: 'Mappings',
  Accounts: 'Accounts',
  Interface: 'Interface Components',
  Themes: 'Themes',
  Other: 'Other',
}

const TYPE_TO_SECTION = {
  [SKL.OpenApiDescription]: SECTIONS.Integrations,
  [SKL.Integration]: SECTIONS.Integrations,
  [OWL.Class]: SECTIONS.Nouns,
  [SKL.Verb]: SECTIONS.Verbs,
  [SKL.VerbIntegrationMapping]: SECTIONS.Mappings,
  [SKL.VerbNounMapping]: SECTIONS.Mappings,
  [SKL.Account]: SECTIONS.Accounts,
  [SKL.SecurityCredentials]: SECTIONS.Accounts,
};

function Explorer() {
  const { schemas, coreSchemas } = useContext(SchemaContext);
  const { selectedProject } = useContext(ProjectContext);

  const schemasBySection = useMemo(() => {
    const sectionsByName = Object.values(schemas).reduce((obj: Record<string, SchemaSectionProps>, schema) => {
        let tab: string;
        if (Array.isArray(schema['@type'])) {
          tab = schema['@type'].map(type => TYPE_TO_SECTION[type as keyof typeof TYPE_TO_SECTION]).filter(Boolean)[0];
        } else {
          tab = TYPE_TO_SECTION[schema['@type'] as keyof typeof TYPE_TO_SECTION]
        }
        tab ||= SECTIONS.Other;
        if (tab in obj) {
          if (obj[tab].schemas) {
            obj[tab].schemas!.push(schema);
          } else {
            obj[tab].schemas = [ schema ];
          }
        } else {
          obj[tab] = {
            name: tab,
            schemas: [ schema ],
          }
        }
        return obj;
      }, {});
    return Object.values(sectionsByName);
  }, [schemas]);

  return (
    <div className='Explorer'>
      <div className='Project-Header Centered'>
        <div className='Project-Name'>{selectedProject.name}</div>
        <NewSchemaButton />
        <ProjectDropdown />
      </div>
      <div className='Tree-View'>
        <SchemaSection
          isCore
          name={'Core Schemas'}
          schemas={Object.values(coreSchemas)}
        />
        <SchemaSection
          name={'Schemas'}
          subSections={schemasBySection}
        />
      </div>
    </div>
  )
}

export default Explorer;